import React, {Component} from 'react';

class LookupUser extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        this.props.getExpenses(event.target.value);
    }

    render() {
        if (this.props.userList === null){
            console.log(this.props.userList);
            return null;
        }
        let userOptions = this.props.userList.map(user => <option key={user.name} value={user.name}>{user.name}</option>);
        return (
            <select onChange={this.handleChange.bind(this)}>
                {userOptions}
            </select>
        );
    };
}

export default LookupUser;