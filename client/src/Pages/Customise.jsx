import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../StyleSheets/customise.css';
import Button from '@mui/material/Button';
import axios from 'axios';
import Submit from '../Components/Submit'
function Customise() {

    

    const currentYear= new Date().getFullYear();
    const [tarMonExp, setTarMonExp] = useState(0); // Add useState for tarMonExp
    const [totIncome, setTotIncome] = useState(0); // Add useState for totIncome
    const [blnTarMonExp, setBlnTarMonExp] = useState(false);
    const [blnTotIncome, setBlnTotIncome] = useState(false);
    const [YrToUpdate, setYrToUpdate] = useState(currentYear);


    const years=[];
    for(let i=0;i<=6;i++){
        years.push(currentYear+1-i);
    }

    function validateData()
    {
        var check=true;
        if(totIncome<=0){
            check=false;
            setBlnTotIncome(true);
        }else{
            setBlnTotIncome(false);
        }
        if(tarMonExp<=0){
            check=false;
            setBlnTarMonExp(true);
        }else{
            setBlnTarMonExp(false);
        }

        if(check){
            updateUsrDetails();
        }

    }

    const updateUsrDetails =()=>
    {
        var data={
            id                   : 300,
            totIncome             :totIncome,
            totExpense            :0,
            tarExpense            :tarMonExp,
            monthlyTarExpense     :tarMonExp,
            currentMonthlyExpense :0,
            YrUserDetail          :YrToUpdate
    }
        axios.post('http://localhost:5000/api/ThreeDot', data)
        .then(response => {
            console.log('Saved successfully:', response.data);

        })
        .catch(error => {
            console.error('Error saving data:', error);
        });

    }

    const getThreeDotDetails = ()=>{
        axios.get('http://localhost:5000/api/ThreeDot')
        .then(response =>{
            console.log(response.data);
            setTotIncome(response.data.totIncome)
            setTarMonExp(response.data.monthlyTarExpense);
        })
    }

    const getThisThreeDotDetails=(year)=>{
        console.log(year)
        axios.get(`http://localhost:5000/api/ThreeDot/${year}`)
        .then(response =>{
            console.log(response.data);
            setTotIncome(response.data.totIncome)
            setTarMonExp(response.data.monthlyTarExpense);
        })

    }

    useEffect(()=>{
        getThreeDotDetails();
    },[]);

    const setTotIncomeChange = (event) => {
        // Get the value from the event
        setTotIncome(event.target.value); // Update totIncome state on change
    };
    const setTarMonExpChange = (event) => {
        // Get the value from the event
        setTarMonExp(event.target.value); // Update totIncome state on change
    };
    const setYrToUpdateChange = (event) => {
        // Get the value from the event
        setYrToUpdate(event.target.value); // Update totIncome state on change
        getThisThreeDotDetails(event.target.value);
    };


    return (
        <div className="container-customise-dashboard">
            <h1>Customise the DashBoard</h1>

            <div className='content-div'>

                <table>
                    <tr className='content-div-tr' >
                        <td><label className='label-textbox'>Total Income</label></td>
                        <td><TextField onChange={setTotIncomeChange} error={blnTotIncome} id="outlined-basic" value={totIncome} label="Total Income" variant="outlined" /></td>
                    </tr>
                    <div className='height-div'></div>
                    <tr>
                        <td><label className='label-textbox'>Targeted Monthly Expense</label></td>
                        <td><TextField onChange={setTarMonExpChange} error={blnTarMonExp} id="outlined-basic" value={tarMonExp} label="Expense" variant="outlined" /></td>
                    </tr>
                    <div className='height-div'></div>
                    <tr>
                        <td><label className='label-textbox'>Year</label></td>
                        <td>
                        <select variant="outlined" className='select-year-box' value={YrToUpdate} onChange={setYrToUpdateChange}>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                {year}
                                </option>
                            ))}
                            </select>
                        </td>
                    </tr>                    
                    <div className='height-div'></div>
                    <tr>
                        <td rowSpan={2}>
                            <Button onClick={validateData} variant="contained" className='submit-button'>Submit</Button>
                        </td>

                    </tr>
                </table>


            </div>
            
            


        </div>
    );
}

export default Customise;