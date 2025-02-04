import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../StyleSheets/ProgressLineBarChart.css'
import axios from 'axios';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExpenseLineChart = ({ expenses }) => {
 

  // Chart data configuration
  const chartData = {
    labels:expenses.map(item => item.date), // Months
    datasets: [
      {
        label: 'Monthly Expenses',
        data:expenses.map(item => item.amount), // Expense amounts
        borderColor: '#36A2EB', // Line color
        backgroundColor: '#36A2EB', // Point color
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4, // Smooth curve
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
        beginAtZero: true,
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};








// Usage example
const App = () => {

    const [selected, setSelected] = useState("Food");
    const [isOpen, setIsOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('3months');
    const [chartData, setChartData] = useState({ category: [], amount: [] });
    const [categories, setCategories] = useState([]); // Initialize as empty array
    const [expenses, setExpenses] = useState([]); 
    


    const fetchCategories = () => {
        axios.get(`http://localhost:5000/api/ExpenseDataResponse/GetCategoryBasedChart`)
            .then(response => {
                const processedData = response.data.map(item => ({
                    label: item.label,
                    value: item.label.toLowerCase() // or use unique ID if available
                }));
                setCategories(processedData);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    };

    const fetchChartData = () => {
        axios.get(`http://localhost:5000/api/ExpenseDataResponse/GetCategoryBasedChart/${timeRange}/${selected}`)
          .then((response) => {
            const processedData = response.data.labels.map((label, index) => ({
              date: label, // Use the label as the date
              amount: response.data.data[index], // Use the corresponding data value
            }));
            setExpenses(processedData); // Update chart data
          })
          .catch(error => {
            console.error("There was an error fetching the chart data!", error);
          });
      };
    
      useEffect(() => {
            fetchCategories();
        }, []);

        useEffect(()=>{
            fetchChartData();
        },[selected,timeRange])


    

    const handleSelect = (option) => {
        setSelected(option.label);
        setIsOpen(false); // Close dropdown after selection
    };

    console.log("expenses : ",expenses)

    

  

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ExpenseLineChart expenses={expenses} />

      <div style={{ marginBottom: '20px' }} className='Expense-data-chart-button-div DOnut-data-chart-button-div'>
        <button onClick={() => setTimeRange('3months')} className={timeRange=="3months" ? 'Expense-data-chart-button-div-active':''} >3 Months</button>
        <button onClick={() => setTimeRange('6months')} className={timeRange=="6months" ? 'Expense-data-chart-button-div-active':''}>6 Months</button>
        <button onClick={() => setTimeRange('1year')} className={timeRange=="1year" ? 'Expense-data-chart-button-div-active':''}>1 Year</button>
        <button onClick={() => setTimeRange('5years')} className={timeRange=="5years" ? 'Expense-data-chart-button-div-active':''}>5 Years</button>
        <button onClick={() => setTimeRange('all')} className={timeRange=="all" ? 'Expense-data-chart-button-div-active':''}>All</button>
      </div>
      <div>
        
        <div className="dropdown">
            <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
                {selected}
            </button>
            {isOpen && (
                <div className="dropdown-content">
                {categories.map((option) => (
                    <div
                    key={option.label}
                    className="dropdown-item"
                    onClick={() => handleSelect(option)}
                    >
                    {option.label}
                    </div>
                ))}
                </div>
            )}
        </div> 

      </div>

    </div>
  );
};

export default App;