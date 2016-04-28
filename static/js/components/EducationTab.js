import React from 'react';
import Button from 'react-mdl/lib/Button';
import { boundTextField, boundSelectField, boundEducationSelectField,
  addInitialEducation, boundEducationMonthField, boundEducationYearField,
  saveAndContinue } from '../util/profile_edit';
import { Grid, Cell, Switch } from 'react-mdl';

class EducationTab extends React.Component {
  constructor(props) {
    super(props);
    this.boundTextField = boundTextField.bind(this);
    this.boundSelectField = boundSelectField.bind(this);
    this.boundEducationSelectField = boundEducationSelectField.bind(this);
    this.boundEducationMonthField = boundEducationMonthField.bind(this);
    this.boundEducationYearField = boundEducationYearField.bind(this);
    this.educationLevelOptions = [
      { value: 'hs', label: "High school", enabled: true },
      { value: 'a', label: 'Associate degree', enabled: true },
      { value: 'b', label: "Bachelor's degree", enabled: true },
      { value: 'm', label: "Master's or professional degree", enabled: false },
      { value: 'p', label: "Doctorate", enabled: false }

      // { value: 'none', label: "No formal education" },
      // { value: 'jhs', label: "Junior high school"},
      // { value: 'el', label: "Elementary school"}

    ];

    this.saveAndContinue = saveAndContinue.bind(this, '/dashboard');
  }
  printAddDegree(level){
    if (level.enabled){
      return <Grid key={"add-"+level.value}><Button onClick={}>+ Add Degree</Button></Grid>;
    }
  }

  render() {
    let {profile, errors} = this.props;
    var new_profile = addInitialEducation(profile);
    
    var education_list = new_profile['education'].map((education_instance , index) => {
      return <Cell col={6} key={index} className="education-unit"><p>Tell us about your degree or certification</p>
        {this.boundEducationSelectField(education_instance, 'degree_name', 'Degree', this.educationLevelOptions)}
        {this.boundEducationMonthField(education_instance, 'graduation_date', errors.graduation_date)}
        {this.boundEducationYearField(education_instance, 'graduation_date')}

      </Cell>
    });
    var levels_grid = this.educationLevelOptions.map(level =>{
      return <Cell col={12} key={level.value} >
        <Grid key={level.value} className="education-level-header">
          <Cell col={11} key="name"><h5 className="education-level-name">{level.label}</h5></Cell>
          <Cell col={1} key="switch"> <Switch ripple id="switch1" className="education-level-switch" defaultChecked/></Cell>
        </Grid>
        { this.printAddDegree(level)}
      </Cell>
    });


    return <Grid className="profile-tab-grid">
      <Dialog open={this.state.openDialog} onCancel={this.handleCloseDialog}>
          <DialogTitle>Allow data collection?</DialogTitle>
          <DialogContent>
            <p>Allowing us to collect data will let us get you the information you want faster.</p>
          </DialogContent>
          <DialogActions>
            <Button type='button'>Agree</Button>
            <Button type='button' onClick={this.handleCloseDialog}>Disagree</Button>
          </DialogActions>
        </Dialog>

      {levels_grid}
        {education_list}

     <Button raised onClick={this.saveAndContinue}>
        Save and continue
     </Button>
    </Grid>;
  }
}

EducationTab.propTypes = {
  openDialog: React.PropTypes.bool,
  profile:        React.PropTypes.object,
  saveProfile:    React.PropTypes.func,
  updateProfile:  React.PropTypes.func
};

export default EducationTab;