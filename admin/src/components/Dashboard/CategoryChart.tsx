import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ categoryData }: any) => {
  // Chuẩn bị dữ liệu cho biểu đồ
  const labels = categoryData.categories.map(
    (item: { category: any }) => item.category
  ); // ["Bóng đá", "Bóng rổ", "Bóng bàn", "Áo Nam"]
  const data = categoryData.categories.map(
    (item: { productCount: any }) => item.productCount
  ); // [15, 1, 1, 2]
  const navigate = useNavigate();
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Product Count",
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Hiển thị legend ở trên cùng
      },
      title: {
        display: true,
        text: "Product Distribution by Category",
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default CategoryChart;
