import '../StyleSheets/DashBoard.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popup from '../Components/NewExpense.jsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ThreeDot from '../Components/ThreeDotExpense.jsx'

function Dashboard() {

    const [showPopup, setshowPopup] = useState(false);
    const [refresh,setRefresh]=useState(false);
    const togglePopup = ()=>
    {
        if(showPopup){
            getExpenseList();
            refreshThreeDot();
        }
        setshowPopup(!showPopup);
    }

    function createExpenses(amount, budgetID, category, description, expenseDate, expenseID, userID) {
        
        console.log(category)
        console.log("koppaaan")
        expenseDate = format(new Date(expenseDate), 'dd MMMM, yyyy');

        return {
            amount, 
            budgetID, 
            category, 
            description, 
            expenseDate, 
            expenseID, 
            userID
        };
    }

    //functions and variables
    const [expenses, setExpenses] = useState([]);

    const getExpenseList = () => {
        
        axios.get('http://localhost:5000/api/expenses')
            .then(response => {
                const processedExpenses = response.data.map(thisExpenseData => 
                    createExpenses(
                        thisExpenseData.amount,
                        thisExpenseData.budgetID,
                        thisExpenseData.category,
                        thisExpenseData.description,
                        thisExpenseData.expenseDate,
                        thisExpenseData.expenseID,
                        thisExpenseData.userID
                    )
                );
                setExpenses(processedExpenses); // Replace entire expenses list
            })
            .catch(error => {
                console.error("There was an error fetching the expenses!", error);
            });
    };

    function deleteExpense(id){
        
        axios.delete(`http://localhost:5000/api/Expenses/${id}`)
        .then(response => {
            console.log("Expense deleted successfully:", response);
            getExpenseList(); // Refresh the list after deletion
            refreshThreeDot();
        })
        .catch(error => {
            console.error("There was an error deleting the expense!", error);
        });
    }

    // Load the expenses once when the component mounts
    useEffect(() => {
        getExpenseList();
    }, []);

    function refreshThreeDot(){
        setRefresh((prev)=>!prev)
    }

    expenses.length > 0 && console.log("thisw : ", expenses);
 
    //page setup
    return (
        <div className={showPopup?'Container blur-background':'Container '} >
            <h1 className='welcome-tag'>Welcome to Dashboard,</h1>
            <ThreeDot refresh={refresh}></ThreeDot>
            <div className='button-expense-container'>
                <Button onClick={togglePopup} variant="contained" className='new-expense-button'>New Expense</Button>
                
                <Popup show={showPopup} handleClose={togglePopup}>
                </Popup>
            </div>


            <TableContainer component={Paper} className="tableContainer table-body">
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow  className="tableHeader">
                    <TableCell className='expense-id-table-row'>Expense ID</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Action</TableCell>


                    </TableRow>
                </TableHead>
                <TableBody className='table-body'>
                    {expenses.map((row,index) => (
                    <TableRow
                        key={row.expenseID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" className='expense-id-table-row'>
                        {index+1}
                        </TableCell>
                        <TableCell align="right" className='expense-date-table-row'>{row.expenseDate}</TableCell>
                        <TableCell align="right">{row.category}</TableCell>
                        <TableCell align="right">$ {row.amount}</TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="delete" color="error" onClick={()=>{deleteExpense(row.expenseID)}} >
                                <DeleteIcon />
                            </IconButton>         
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    );
}

export default Dashboard;