import React from 'react';
import Button from 'react-mdl/lib/Button';

import ProfileTab from "../util/ProfileTab";
import { saveAndContinue } from "../util/profile_edit";

class PersonalTab extends ProfileTab {
  constructor(props) {
    super(props);
    this.saveAndContinue = saveAndContinue.bind(this, '/profile/education');
  }

  static propTypes = {
    profile:        React.PropTypes.object,
    errors:         React.PropTypes.object,
    saveProfile:    React.PropTypes.func,
    updateProfile:  React.PropTypes.func,
  };

  static defaultProps = {
    requiredFields: [
      ['first_name'],
      ['last_name'],
      ['preferred_name'],
      ['gender'],
      ['preferred_language'],
      ['city'],
      ['country'],
      ['birth_city'],
      ['birth_country'],
      ['date_of_birth'],
    ],
    validationMessages: {
      'first_name': "Given name",
      'last_name': "Family name",
      'preferred_name': "Preferred name",
      'gender': "Gender",
      'preferred_language': "Preferred language",
      'city': "City",
      'country': "Country",
      'birth_city': 'City',
      'birth_country': "Country",
      'date_of_birth': "Date of birth"
    }
  }

  render() {
    return <div>
      {this.boundTextField(["first_name"], "Given name")}<br />
      {this.boundTextField(["last_name"], "Family name")}<br />
      {this.boundTextField(["preferred_name"], "Preferred name")}<br />
      {this.boundSelectField(['gender'], 'Gender', this.genderOptions)}<br />
      {this.boundSelectField(
        ['preferred_language'],
        'Preferred language',
        this.languageOptions
      )}<br />
      <h4>Where do you live?</h4>
      {this.boundTextField(['city'], 'City')}<br />
      {this.boundTextField(['state_or_territory'],'State or Territory')}<br />
      {this.boundSelectField(['country'], 'Country', this.countryOptions)}<br />
      <h4>Where were you born?</h4>
      {this.boundTextField(['birth_city'], 'City')}<br />
      {this.boundTextField(['birth_state_or_territory'], 'State or Territory')}<br />
      {this.boundSelectField(['birth_country'], 'Country', this.countryOptions)}<br />
      {this.boundDateField(['date_of_birth'], 'Date of birth')}<br />
      <Button raised onClick={this.saveAndContinue}>
        Save and continue
      </Button>
    </div>;
  }
}

export default PersonalTab;
