import { useMemo } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  type ChartDataset,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

// Generate random stock-like data
const generateStockData = (base: number, volatility: number, points = 12) => {
  const data: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5) * volatility;
    data.push(Math.max(value, 0));
  }
  return data;
};

// Random color generator
const randomColor = (alpha = 0.8) =>
  `rgba(${50 + Math.floor(Math.random() * 205)}, ${50 + Math.floor(Math.random() * 205)}, ${
    50 + Math.floor(Math.random() * 205)
  }, ${alpha})`;

// Generate line dataset
const generateLineDataset = (): ChartDataset<"line", number[]> => {
  const color = randomColor();
  return {
    label: "Trend",
    data: generateStockData(400 + Math.random() * 300, 150),
    borderColor: color,
    backgroundColor: color.replace("0.8", "0.05"),
    tension: 0.3 + Math.random() * 0.2,
    borderWidth: 2,
    fill: Math.random() > 0.5,
    pointRadius: 0,
  };
};

// Generate bar dataset
const generateBarDataset = (): ChartDataset<"bar", number[]> => {
  const color = randomColor();
  return {
    label: "Volume",
    data: generateStockData(100 + Math.random() * 200, 100),
    backgroundColor: color.replace("0.8", "0.15"),
  };
};

// Generate Pie/Doughnut dataset
const generatePieData = () => ({
  labels: ["A", "B", "C", "D"],
  datasets: [
    {
      data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: Array.from({ length: 4 }, () => randomColor(0.3)),
      borderWidth: 0,
    },
  ],
});

export default function ModernChartsBg() {
  // Memoized datasets for performance
  const lineData = useMemo(
    () => ({
      labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
      datasets: [generateLineDataset(), generateLineDataset()],
    }),
    []
  );

  const barData = useMemo(
    () => ({
      labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
      datasets: [generateBarDataset(), generateBarDataset()],
    }),
    []
  );

  const pieData = useMemo(() => generatePieData(), []);
  const doughnutData = useMemo(() => generatePieData(), []);

  // Type-safe chart options
  const lineOptions: import("chart.js").ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    resizeDelay: 200,
  };

  const barOptions: import("chart.js").ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    resizeDelay: 200,
  };

  const pieOptions: import("chart.js").ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const doughnutOptions: import("chart.js").ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="fixed inset-0 z-1 pointer-events-none opacity-30">
      {/* Bar chart background */}
      <Bar data={barData} options={barOptions} className="absolute inset-0" />

      {/* Line chart overlay */}
      <Line data={lineData} options={lineOptions} className="absolute inset-0" />

      {/* Decorative Pie chart */}
      <div className="absolute top-4 left-4 w-24 h-24">
        <Pie data={pieData} options={pieOptions} />
      </div>

      {/* Decorative Doughnut chart */}
      <div className="absolute bottom-4 right-4 w-24 h-24">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}
