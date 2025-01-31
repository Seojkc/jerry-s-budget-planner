import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExpenseLineChart = ({ expenses }) => {
  // Process data to group expenses by month
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Chart data configuration
  const chartData = {
    labels: Object.keys(monthlyTotals), // Months
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyTotals), // Expense amounts
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
          text: 'Month',
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
  const expenses = [
    { date: '2023-10-01', amount: 300 },
    { date: '2023-10-15', amount: 150 },
    { date: '2023-11-05', amount: 200 },
    { date: '2023-11-20', amount: 400 },
    { date: '2023-12-10', amount: 500 },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ExpenseLineChart expenses={expenses} />
    </div>
  );
};

export default App;