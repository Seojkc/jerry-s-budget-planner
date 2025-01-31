import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
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
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: '70%' // This makes it a donut instead of a pie
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
      
      {/* Optional: Center text showing total */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
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
  const expenses = [
    { category: 'Food', amount: 300 },
    { category: 'Transport', amount: 150 },
    { category: 'Housing', amount: 1200 },
    { category: 'Utilities', amount: 200 },
    { category: 'Entertainment', amount: 100 },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ExpenseDonutChart expenses={expenses} />
    </div>
  );
};

export default App;