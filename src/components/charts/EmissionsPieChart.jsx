import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmissionsPieChart = ({ scope1, scope2, scope3 }) => {
  const data = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        data: [scope1, scope2, scope3],
        backgroundColor: [
          '#3B82F6', // Blue for Scope 1
          '#60A5FA', // Light blue for Scope 2  
          '#93C5FD', // Lighter blue for Scope 3
        ],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          color: '#6B7280',
        },
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(0);
            return `${context.label}: ${context.parsed.toLocaleString()} kg (${percentage}%)`;
          }
        }
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default EmissionsPieChart;