import React, { useState, useEffect } from 'react';
import '../StyleSheets/ThreeDotExpense.css';
import axios from 'axios';

const ProgressBar = ({ monthlyExpense, monthlyTarget }) => {
    // Calculate percentages
    const maxExpense = Math.max(monthlyExpense, monthlyTarget);
    const expensePercentage = (monthlyExpense / maxExpense) * 100;
    const targetPercentage = (monthlyTarget / maxExpense) * 100;
  
    return (
      <div className="progress-container">
        <div className="bar">
          <div
            className="progress-expense"
            style={{ width: `${expensePercentage}%` }}
          >
            <span className="label">${monthlyExpense.toLocaleString()}</span>
          </div>
          <div
            className="progress-target"
            style={{ width: `${targetPercentage}%` }}
          >
            <span className="label">${monthlyTarget.toLocaleString()}</span>
          </div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color target"></span> Monthly Target (${monthlyExpense.toLocaleString()})
          </div>
          <div className="legend-item">
            <span className="legend-color expense "></span> Monthly Expense
          </div>
        </div>
      </div>
    );
  };


function SubmitExpenses({refresh}) {

    const[totIncome,setTotIncome] = useState(0);
    const[totExpense,setTotExpense]  = useState(0);
    const[tarExpense,setTarExpense] = useState(0);
    const[monthlyTarExpense,setMonthlyTarExpense] = useState(300);
    const[currentMonthlyExpense,setCurrentMonthlyExpense]=useState(150);
    const[currentYr,setCurrentYr]=useState(0);


    const getThreeDotDetails = ()=>{
        axios.get('http://localhost:5000/api/ThreeDot')
        .then(response =>{
            setTotIncome(response.data.totIncome)
            setTotExpense(response.data.totExpense)
            setTarExpense(response.data.tarExpense)
            setMonthlyTarExpense(response.data.monthlyTarExpense)
            setCurrentMonthlyExpense(response.data.currentMonthlyExpense)
            setCurrentYr(response.data.Yr)
        })
    }

    useEffect(()=>{
        getThreeDotDetails();
    },[refresh]);
    

    return (
        
        <div >
            <div className='threeDot-container'>

                <div className='oneDot-container green-shadow'>
                    <h2>Total Income/Yr</h2>
                    <h1>${new Intl.NumberFormat('en-US').format(totIncome)}</h1>
                </div>

                <div className='oneDot-container red-shadow'>
                    <h2>Total Expense/Yr</h2>
                    <h1>${new Intl.NumberFormat('en-US').format(totExpense)}</h1>
                </div>

                <div className='oneDot-container yellow-shadow'>
                    <h2>Targeted Expense/Yr</h2>
                    <h1>${new Intl.NumberFormat('en-US').format(monthlyTarExpense*12)}</h1>
                </div>
            </div>

            <div className='progress-monthly-expense-container'>
                <ProgressBar 
                    monthlyExpense={monthlyTarExpense}
                    monthlyTarget={currentMonthlyExpense}
                    ></ProgressBar>

            </div>
            
           

        </div>
    );
}

export default SubmitExpenses;