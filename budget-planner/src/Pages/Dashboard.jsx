import React from 'react';
import '../StyleSheets/DashBoard.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


function Dashboard() {

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/expenses')
        .then(response => {
            setExpenses(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the expenses!", error);
        });
    }, []);

    return (
        <div className="Container">
            <h1>Hello World</h1>
            <p>This is the main cont ent area.</p>
            <ul>
                {expenses.map(expense => (
                    <li key={expense.expenseID}>{expense.description} - ${expense.amount}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;