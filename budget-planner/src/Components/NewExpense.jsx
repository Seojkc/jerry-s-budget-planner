import React, { useEffect, useState } from 'react';
import '../StyleSheets/NewExpense.css';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { DatePicker, Space } from 'antd';
import { format } from 'date-fns'; // Import the format function



const Popup = ({ handleClose, show, children}) =>{


    const [selectedDate, setSelectedDate] = useState(new Date().dateString);
    
    const [formData, setFormData] = useState({
        amount:0,
        budgetID:1,
        category:'',
        description:'',
        expenseDate:selectedDate,
        userID:1
    });





    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
      };
    
      const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
      };

    
    
    // const onChange = (date, dateString) => 
    // {
    //     setSelectedDate(dateString); // Update the date as a string
    //     console.log(date, dateString);
    // };

    const showHideClassName = show ? 'popup-overlay':'display-none';

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        width: 100%;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: rgba(241, 246, 252, 0);
        border-bottom: 1px solid black !important;
        border: 0px solid white;
        border-radius:0px;
        box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    
        &:hover {
          border-color: ${blue[400]};
        }
    
        &:focus {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
        }
    
        
      `,
      );

    const handleClickOutside = (e) => {
        if (e.target.className == 'popup-overlay') {
          handleClose();
        }
      };

    const setNewExpenseData=(e)=>
    {
        if(e.target!=undefined){
            const { name, value } = e.target;
            if(['category', 'amount', 'description'].includes(name))
            {
                setFormData(prevData =>({ ...prevData, [name]: value }));
            }
        }
    }

    const resetData = ()=>{
        const initialFormData = {
            amount:0,
            budgetID:1,
            category:'',
            description:'',
            expenseDate:selectedDate,
            userID:1
        };

        setFormData(initialFormData) 
    }

    const [errors,setErrors]=useState(
        {
            category:false,
            amount:false,
            expenseDate:false,
            description:false

        }
    )

    

    const handleSubmit = (e)=>{

        const checkErrors = {
            category:formData.category.trim()==='',
            amount:formData.amount<=0,
            expenseDate:formData.expenseDate===null,
            description:false
        }


        setErrors(checkErrors);

        let validated=true;
        Object.entries(checkErrors).forEach((entry)=>{
            const [key,value]=entry;
            if(value){
                validated=false;
            }
            
        })
        
        if(validated){
            e.preventDefault();
            axios
                .post('http://localhost:5000/api/expenses',formData)
                .then((response)=>{
                    console.log("Expense Added : ",response.data)
    
                    resetData();
                    handleClose();
                })
                .catch((error)=>{
                    console.log("Error catched")
                })
        }
        
    }


    

    


    return(
        <div  onClick={handleClickOutside} className={showHideClassName}>
            <section className="popup-main">
                <h1>Add Expense</h1>
                {/* <div className="IconButton-close">
                    <IconButton   aria-label="delete" onClick={handleClose} >
                        <CloseIcon  className="CloseIcon"/>
                    </IconButton>
                </div> */}
                <div className="text-field-box">
                    <TextField error={errors.category} helperText={errors.category?"Field Required":""} name="category" onChange={setNewExpenseData} value={formData.category}  className="text-field" id="filled-basic" label=" Category" variant="standard"/>
                    <div className="white-space"></div>
                    <TextField  error={errors.amount} helperText={errors.amount?"Field Required":""}  name="amount" inputProps={{ min: 0 }} value={formData.amount} onChange={setNewExpenseData} type="number" className="text-field" label="Amount" variant="standard"/>
                    <div className="white-space"></div>
                    <DatePicker name="expenseDate" 
                        error={errors.expenseDate} helperText={errors.expenseDate?"Field Required":""} 
                        onChange={(date) => setFormData(prevData => ({
                            ...prevData,
                            expenseDate: date 
                        }))}  
                    value={formData.expenseDate} dateFormat="yyyy-MM-dd" className="text-field"/>
                    <div className="white-space"></div>
                    <TextField multiline rows={4} label="Description" name="description" onChange={setNewExpenseData} value={formData.description}  className="text-field"  minRows={5} maxRows={6} variant="standard"/>
                </div>

                <div className="button-area">
                    <Button variant="contained" onClick={handleSubmit} className="submit-button">Submit</Button>
                    <Button  onClick={handleClose} variant="contained" className="cancel-button">Cancel</Button>
                </div>
            </section>

        </div>
    )


}


export default Popup;










