import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyEmissionsChart = ({ monthlyData }) => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Scope 1',
        data: monthlyData.scope1,
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Scope 2',
        data: monthlyData.scope2,
        backgroundColor: '#60A5FA',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Scope 3',
        data: monthlyData.scope3,
        backgroundColor: '#93C5FD',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll handle legend separately to match design
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} kg`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          callback: function(value) {
            return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
          }
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlyEmissionsChart;