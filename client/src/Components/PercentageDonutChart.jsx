import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../StyleSheets/ProgressLineBarChart.css'
import axios from 'axios';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseDonutChart = ({ expenses }) => {

    
    
  // Process expense data by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Chart data configuration
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384', // Pink
            '#36A2EB', // Blue
            '#FFCE56', // Yellow
            '#4BC0C0', // Teal
            '#9966FF', // Purple
            '#FF9F49', // Orange
            '#FF6B6B', // Coral
            '#6BFF6B', // Light Green
            '#C9CBFF', // Lavender
            '#FFD700', // Gold
        ],
        hoverBackgroundColor: [
          '#FF4466', // Darker Pink
            '#1E90FF', // Darker Blue
            '#FFB732', // Darker Yellow
            '#3AA8A8', // Darker Teal
            '#7D4DFF', // Darker Purple
            '#FF8C00', // Darker Orange
            '#FF4A4A', // Darker Coral
            '#4DFF4D', // Darker Light Green
            '#A8AAFF', // Darker Lavender
            '#FFC400', // Darker Gold
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return ` $${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: '50%' // This makes it a donut instead of a pie
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
      
      {/* Optional: Center text showing total */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Total
        </div>
        <div>
          ${Object.values(categoryTotals).reduce((a, b) => a + b, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

// Usage example
const App = () => {

    const [timeRange, setTimeRange] = useState('3months');
  
    const [chartData, setChartData] = useState({ category: [], amount: [] });


  const fetchChartData = () => {
    axios.get(`http://localhost:5000/api/ExpenseDataResponse/GetPercentageDistributionRange/${timeRange}`)
      .then(response => {
        const processedData = {
            category: response.data.labels,
            amount: response.data.data,
        };
        setChartData(processedData); // Update chart data
      })
      .catch(error => {
        console.error("There was an error fetching the chart data!", error);
      });
  };

  useEffect(() => {
      fetchChartData();
    }, [timeRange]);
  
    console.log(chartData)

    const expenses = chartData.category.map((category, index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the first letter
        amount: chartData.amount[index]
      }));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ExpenseDonutChart expenses={expenses} />

      <div style={{ marginBottom: '20px' }} className='Expense-data-chart-button-div DOnut-data-chart-button-div'>
        <button onClick={() => setTimeRange('3months')} className={timeRange=="3months" ? 'Expense-data-chart-button-div-active':''} >3 Months</button>
        <button onClick={() => setTimeRange('6months')} className={timeRange=="6months" ? 'Expense-data-chart-button-div-active':''}>6 Months</button>
        <button onClick={() => setTimeRange('1year')} className={timeRange=="1year" ? 'Expense-data-chart-button-div-active':''}>1 Year</button>
        <button onClick={() => setTimeRange('5years')} className={timeRange=="5years" ? 'Expense-data-chart-button-div-active':''}>5 Years</button>
        <button onClick={() => setTimeRange('all')} className={timeRange=="all" ? 'Expense-data-chart-button-div-active':''}>All</button>
      </div>
    </div>
  );
};

export default App;