import React from 'react';
import '../StyleSheets/Income.css';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Sales",
          data: [65, 59, 80, 81, 56, 55],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          pointBackgroundColor: "rgba(75,192,192,1)",
          tension: 0.4, 
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return <Line data={data} options={options} />;
};

function Income() {
    return (
        <div className="Container">
            <h1>Hello World</h1>
            <p>This is the Income content area.</p>
            <LineChart/>
        </div>
    );
}

export default Income;