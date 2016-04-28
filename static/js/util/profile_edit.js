import React from 'react';
import TextField from 'react-mdl/lib/Textfield';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { browserHistory } from 'react-router';
import moment from 'moment';

// utility functions for pushing changes to profile forms back to the
// redux store.
// this expects that the `updateProfile` and `profile` props are passed
// in to whatever component it is used in.

// bind to this.boundTextField in the constructor of a form component
// to update text fields when editing the profile
export function boundTextField(key, label, error) {
  const { updateProfile, profile } = this.props;
  let onChange = e => {
    let clone = Object.assign({}, profile);
    clone[key] = e.target.value;
    updateProfile(clone);
  };
  return (
    <TextField
      floatingLabel
      label={label}
      value={profile[key]}
      error={error}
      onChange={onChange} />
  );
}

// bind this to this.boundSelectField in the constructor of a form component
// to update select fields
// pass in the name (used as placeholder), key for profile, and the options.
export function boundSelectField(key, label, options, error) {
  const { updateProfile, profile } = this.props;
  let onChange = value => {
    let clone = Object.assign({}, profile);
    clone[key] = value ? value.value : null;
    updateProfile(clone);
  };
  return <div>
    <Select
      options={options}
      value={profile[key]}
      placeholder={label}
      onChange={onChange} />
    <span className="validation-error-text">{error}</span>
  </div>;
}

// bind this to this.boundSelectField in the constructor of a form component
// to update select fields
// pass in the name (used as placeholder), key for profile, and the options.
export function boundDateField(key, label, error) {
  const { updateProfile, profile} = this.props;
  let onChange = date => {
    let clone = Object.assign({}, profile);
    // format as ISO-8601
    clone[key] = date.format("YYYY-MM-DD");
    updateProfile(clone);
  };
  let newDate = profile[key] ? moment(profile[key], "YYYY-MM-DD") : null;
  return <div>
    <DatePicker
      selected={newDate}
      placeholderText={label}
      showYearDropdown
      onChange={onChange}
    />
    <span className="validation-error-text">{error}</span>
  </div>;
}
export function boundEducationMonthField(instance, key, error) {
  const {updateProfile, profile} = this.props;
  var profile_with_education = addInitialEducation(profile);
  var education;
  let onChange = month => {
    let education_list = profile_with_education['education'];
    if ('id' in instance) {
      [ education ] = education_list.filter( obj => {return obj.id === instance['id']});
    }else{
      [ education ] = education_list.filter( obj => { return obj['degree_name'] === instance['degree_name']});

    }
    // format as ISO-8601
    if (education[key]){
      education[key] = moment(education[key]).set('month', month.value).format('YYYY-MM-DD');
    } else {
      education[key] = moment().set('month', month.value).format('YYYY-MM-DD');
    }
    updateProfile(profile_with_education);
  };
  let month = instance[key] ? moment(instance[key], "YYYY-MM-DD").month() : null;
  const month_options = [
    { value: 0, label: 'January'},
    { value: 1, label: 'February'},
    { value: 2, label: 'March'},
    { value: 3, label: 'April'},
    { value: 4, label: 'May'},
    { value: 5, label: 'June'},
    { value: 6, label: 'July'},
    { value: 7, label: 'August'},
    { value: 8, label: 'September'},
    { value: 9, label: 'October'},
    { value: 10, label: 'November'},
    { value: 11, label: 'December'}
  ];


  return <div>
    <Select
      options={month_options}
      value={month}
      placeholder="MM"
      onChange={onChange}
    />

    <span className="validation-error-text">{error}</span>
  </div>;
}

export function boundEducationYearField(instance, key){
  const {updateProfile, profile} = this.props;
 var profile_with_education = addInitialEducation(profile);
  var education;
  let onChange = year => {
    let education_list = profile_with_education['education'];
    if ('id' in instance) {
      [ education ] = education_list.filter( obj => {return obj.id === instance['id']});
    }else{
      [ education ] = education_list.filter( obj => { return obj['degree_name'] === instance['degree_name']});

    }
    // format as ISO-8601
    if (education[key]){
      education[key] = moment(education[key]).set('year', year.value).format('YYYY-MM-DD');
    } else {
      education[key] = moment().set('year', year.value).format('YYYY-MM-DD');
    }
    updateProfile(profile_with_education);
  };
  let year = instance[key] ? moment(instance[key], "YYYY-MM-DD").year() : null;  
  return  <TextField
      label="YYYY"
      value={year}
      onChange={onChange}/>;
}

export function boundEducationSelectField(instance, key, label, options){

  const { updateProfile, profile} = this.props;
  var profile_with_education = addInitialEducation(profile);
  var education;
  let onChange = (value) => {
    let education_list = profile_with_education['education'];
    if ('id' in instance) {
      [ education ] = education_list.filter( obj => {return obj.id === instance['id']});
    }else{
      [ education ] = education_list.filter( obj => { return obj['degree_name'] === instance['degree_name']});

    }
    education[key] = value ? value.value : null;

    profile_with_education['education'] = education_list;
    updateProfile(profile_with_education);
  };

  return (<Select
      options={options}
      value={instance[key]}
      placeholder={label}
      onChange={onChange}
    />
  );
}
/* this is probably not needed anymore */
export function addInitialEducation(profile){
  let level = profile['edx_level_of_education'];

  let new_profile = Object.assign({}, profile);
  let education_list = profile['education'];
  if (typeof(education_list) === "undefined" || education_list.length < 1) {
    switch(level) {
      case 'd':
        education_list = ['d', 'm', 'b', 'hs'].map(ed => ({'degree_name': ed, 'graduation_date': null}));
        break;
      case 'm':
        education_list = ['m','b', 'hs'].map(ed => ({'degree_name': ed, 'graduation_date': null}));
        break;
      case 'b':
        education_list = ['b', 'hs'].map(ed => ({'degree_name': ed, 'graduation_date': null}));
        break;
      case 'a':
        education_list = ['a', 'hs'].map(ed => ({'degree_name': ed, 'graduation_date': null}));
        break;
    }
    new_profile['education'] = education_list;
  }
  return new_profile;
  
}


// bind to this.saveAndContinue.bind(this, '/next/url')
export function saveAndContinue(next) {
  const { saveProfile, profile } = this.props;

  saveProfile(profile).then(() => {
    browserHistory.push(next)
  });
}
