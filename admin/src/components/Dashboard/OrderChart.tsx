import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderChart = ({ dataFromServer }: any) => {
  // Chuẩn bị dữ liệu cho biểu đồ
  const labels = dataFromServer.orderStats.map(
    (stat: { day: any }) => `Day ${stat.day}`
  );
  const data = dataFromServer.orderStats.map(
    (stat: { orderCount: any }) => stat.orderCount
  );

  // Cấu hình biểu đồ
  const chartData = {
    labels: labels, // ["Day 1", "Day 2", ..., "Day 31"]
    datasets: [
      {
        label: "Số đơn hàng",
        data: data, // [0, 0, 0, 3, 8, ...]
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3, // Làm mượt đường cong
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Đơn hàng trong tháng ${dataFromServer.month}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày trong tháng",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số đơn hàng",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default OrderChart;
