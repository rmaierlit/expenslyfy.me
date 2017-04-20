import React, {Component} from 'react';

function Report(props) {
    const reportArray = props.reportArray;

    if (reportArray.length === 0) {
        return (<h5>no expenses in this range</h5>);
    }

    const reportList = reportArray.map((item) => 
        <li key={item.week.toString()}>
            {`From ${item.week_start} to ${item.week_end} -- ${item.total_amount_spent}`}
        </li>
    );

    return (
        <ul>
            {reportList}
        </ul>
    );
}

export default Report;