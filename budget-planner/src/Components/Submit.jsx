import React, { useState, useEffect } from 'react';
import '../StyleSheets/NewExpense.css';
import Gennie from '../ExternalFiles/submit.gif'


function SubmitExpenses({show}) {


    

    

    return (
        
        <div className={`submit-container ${show ? 'show' : 'hide'}`}>
           

            <img src={Gennie} className={show ? 'show' : 'hide'}/>
            <h1>Submitted</h1>
            
        </div>
    );
}

export default SubmitExpenses;