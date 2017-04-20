import React, {Component} from 'react';

function Report(props) {
    const reportArray = props.reportArray;
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