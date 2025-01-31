import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import '../StyleSheets/ProgressLineBarChart.css'

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const LineChart = () => {
  // State to manage the selected time range
  const [timeRange, setTimeRange] = useState('3months');
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  const [targetExpense,setTargetExpense] = useState(0);

  const fetchChartData = () => {
    axios.get(`http://localhost:5000/api/ExpenseDataResponse/GetTargetExpenseData/${timeRange}`)
      .then(response => {
        const processedData = {
          labels: response.data.labels,
          data: response.data.data,
        };
        setChartData(processedData); // Update chart data
      })
      .catch(error => {
        console.error("There was an error fetching the chart data!", error);
      });
  };

  const fetchtargetExpense = () => {
    axios.get(`http://localhost:5000/api/ExpenseDataResponse/GetTargetExpenseAmount`)
      .then(response => {
        setTargetExpense(response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the chart data!", error);
      });
  };

  // Fetch data when the component mounts or when timeRange changes
  useEffect(() => {
    fetchChartData();
    fetchtargetExpense();
  }, [timeRange]);

  
  // Chart data
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Expense',
        data:  chartData.data,
        fill: false,
        borderColor: 'rgb(103, 241, 110)',
        tension: 0.1,
      },
      {
        label: 'Monthly Target',
        data: Array(chartData.labels.length).fill(targetExpense), // Horizontal line at 500
        borderColor: 'rgba(255, 99, 99, 0.5)',
        borderWidth: 4,
        borderDash: [9, 8], // Dashed line
        fill: false,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      
      <div className='Expense-data-chart-div'> 
        <Line data={data} options={options} className='Expense-data-chart'/>
      </div>
      
      <div style={{ marginBottom: '20px' }} className='Expense-data-chart-button-div'>
        <button onClick={() => setTimeRange('3months')} className={timeRange=="3months" ? 'Expense-data-chart-button-div-active':''} >3 Months</button>
        <button onClick={() => setTimeRange('6months')} className={timeRange=="6months" ? 'Expense-data-chart-button-div-active':''}>6 Months</button>
        <button onClick={() => setTimeRange('1year')} className={timeRange=="1year" ? 'Expense-data-chart-button-div-active':''}>1 Year</button>
        <button onClick={() => setTimeRange('5years')} className={timeRange=="5years" ? 'Expense-data-chart-button-div-active':''}>5 Years</button>
        <button onClick={() => setTimeRange('all')} className={timeRange=="all" ? 'Expense-data-chart-button-div-active':''}>All</button>
      </div>
    </div>
  );
};


const ProgressLine = () => {

  return (
    <div>
        <LineChart/>
    </div>
  );
};

export default ProgressLine;