import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  type ChartDataset,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const generateStockData = (base: number, volatility: number, points = 12) => {
  const data: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5) * volatility;
    data.push(Math.max(value, 0));
  }
  return data;
};

const generateLineDataset = (): ChartDataset<"line", number[]> => {
  const color = `rgba(${Math.floor(50 + Math.random() * 200)}, ${Math.floor(50 + Math.random() * 200)}, ${Math.floor(
    50 + Math.random() * 200
  )}, 0.8)`;
  return {
    label: "Trend",
    data: generateStockData(400 + Math.random() * 300, 150),
    borderColor: color,
    backgroundColor: color.replace("0.8", "0.05"),
    tension: 0.3 + Math.random() * 0.1,
    borderWidth: 2,
    fill: Math.random() > 0.5,
    pointRadius: 0,
  };
};

const generateBarDataset = (): ChartDataset<"bar", number[]> => {
  const color = `rgba(${Math.floor(50 + Math.random() * 200)}, ${Math.floor(50 + Math.random() * 200)}, ${Math.floor(
    50 + Math.random() * 200
  )}, 0.8)`;
  return {
    label: "Volume",
    data: generateStockData(100 + Math.random() * 200, 100),
    backgroundColor: color.replace("0.8", "0.05"),
  };
};

const lineData = {
  labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
  datasets: [generateLineDataset(), generateLineDataset()],
};

const barData = {
  labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
  datasets: [generateBarDataset(), generateBarDataset()],
};

const lineOptions: import("chart.js").ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  animation: { duration: 800, easing: "easeOutQuart" },
};

const barOptions: import("chart.js").ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  animation: { duration: 800, easing: "easeOutQuart" },
};

export default function ModernChartsBg() {
  return (
    <div className="absolute inset-0 z-1 pointer-events-none opacity-30">
      {/* Subtle Bar chart background */}
      <Bar data={barData} options={barOptions} className="absolute inset-0" />

      {/* Line charts overlay */}
      <Line data={lineData} options={lineOptions} className="absolute inset-0" />
    </div>
  );
}
