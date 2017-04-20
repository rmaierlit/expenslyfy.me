import React, {Component} from 'react';
import Report from './Report.js';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';

class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {weeks: null, minDate: '', maxDate: ''};
  }

  createReport(){
    let {minDate, maxDate} = this.state;
    function formatDate(input) {
        if (moment.isMoment(input)){
            return input.format('YYYY-MM-DD HH:mm:ss');
        } else {
            return 'none';
        }
    }
    axios.get(`/users/${this.props.name}/report?minDate=${formatDate(minDate)}&maxDate=${formatDate(maxDate)}`, {headers: {auth: this.props.token}})
        .then(res => {
          console.log('get rep:', res.data);
          this.setState({weeks: res.data});
        });
  };

  discardReport(){
      this.setState({weeks: null});
  }

  handleUpdate(key, date){
      let update = {[key]: date} //key will match the string argument, value will be a Moment.js object
      this.setState(update);
  }

  componentWillReceiveProps() { 
      this.discardReport(); //clears the report when the user logs out
  }

  render() {
    if(this.props.name === null) {
        return null;
    }

    if(!Array.isArray(this.state.weeks)){
      return (
          <div>
            <button onClick={this.createReport.bind(this)}>Create Report</button>
            <div style={{display: "flex", alignItems: "center"}}>
                <h5>minimum date/time</h5>
                <Datetime value={this.state.minDate} onChange={this.handleUpdate.bind(this, "minDate")}/>
            </div>

            <div style={{display: "flex", alignItems: "center"}}>
                <h5>maximum date/time</h5>
                <Datetime value={this.state.maxDate} onChange={this.handleUpdate.bind(this, "maxDate")}/>
            </div>
          </div>
      );
    }

    return (
        <div>
            <h3>{'Report for ' + this.props.name}</h3>

            <Report reportArray={this.state.weeks}/>

            <button onClick={this.discardReport.bind(this)}>Discard</button>
        </div>
    );
  }
}

export default ReportView;