import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { ProfitLossData, InvestmentType } from "../types/type";

// Register all necessary Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Mock data for Profit/Loss (Bar Chart)
const profitLossData: ProfitLossData[] = [
  { month: "Jan 2025", value: 500 },
  { month: "Feb 2025", value: 200 },
  { month: "Mar 2025", value: -300 },
  { month: "Apr 2025", value: 700 },
  { month: "May 2025", value: -100 },
  { month: "Jun 2025", value: 400 },
];

// Mock data for Investments (Pie Chart)
const investmentsDetail: InvestmentType = {
  investment: [
    { name: "Tata Power", quantity: 10, pricePerQuantity: 390 },
    { name: "Waree Energy", quantity: 5, pricePerQuantity: 2300 },
    { name: "Arkade Developer", quantity: 2, pricePerQuantity: 148 },
    { name: "GTL Infra", quantity: 700, pricePerQuantity: 1.45 },
  ],
};

// Mock data for Portfolio Value (Line Chart)
const portfolioValueData = [
  { month: "Jan 2025", value: 10000 }, // Starting value
  { month: "Feb 2025", value: 10200 },
  { month: "Mar 2025", value: 9900 },
  { month: "Apr 2025", value: 10600 },
  { month: "May 2025", value: 10500 },
  { month: "Jun 2025", value: 10900 },
];

// --- Bar Chart Component ---
const BarChart = () => {
  const barChartData: ChartData<"bar"> = {
    labels: profitLossData.map((data) => data.month),
    datasets: [
      {
        label: "Profit/Loss ($)",
        data: profitLossData.map((data) => data.value),
        backgroundColor: profitLossData.map((data) =>
          data.value >= 0 ? "rgba(75, 192, 192, 0.7)" : "rgba(255, 99, 132, 0.7)"
        ),
        borderColor: profitLossData.map((data) =>
          data.value >= 0 ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount ($)" } },
      x: { title: { display: true, text: "Months" } },
    },
    plugins: { legend: { display: true, position: "top" }, tooltip: { enabled: true } },
  };

  return (
    <div className="w-full h-96 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Profit/Loss Over 6 Months</h2>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

// --- Pie Chart Component ---
const PieChart = () => {
  const pieChartData: ChartData<"pie"> = {
    labels: investmentsDetail.investment.map((inv) => inv.name),
    datasets: [
      {
        label: "Investment Value",
        data: investmentsDetail.investment.map((inv) => inv.quantity * inv.pricePerQuantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: true, position: "right" }, tooltip: { enabled: true } },
  };

  return (
    <div className=" h-96 p-4 w-3/4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Current Investment Allocation</h2>
      <Pie data={pieChartData} options={options} />
    </div>
  );
};

// --- Line Chart Component ---
const LineChart: React.FC = () => {
  const lineChartData: ChartData<"line"> = {
    labels: portfolioValueData.map((data) => data.month),
    datasets: [
      {
        label: "Portfolio Value ($)",
        data: portfolioValueData.map((data) => data.value),
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.1, // Slight curve for smoothness
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false, title: { display: true, text: "Value ($)" } },
      x: { title: { display: true, text: "Months" } },
    },
    plugins: { legend: { display: true, position: "top" }, tooltip: { enabled: true } },
  };

  return (
    <div className="w-full h-96 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Portfolio Value Over 6 Months</h2>
      <Line data={lineChartData} options={options} />
    </div>
  );
};

// Export all charts
export { BarChart, PieChart, LineChart };