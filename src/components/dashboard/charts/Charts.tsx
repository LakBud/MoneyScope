import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import type { TransactionProps } from "../../types/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

type ChartsProps = {
  transactions: (TransactionProps & { budget?: string; recurrence?: string })[];
};

type ChartSelection =
  | "line"
  | "rollingAverage"
  | "bar"
  | "pie"
  | "doughnut"
  | "incomeExpense"
  | "top5"
  | "forecast"
  | "budgetTotals";

const Charts = ({ transactions }: ChartsProps) => {
  const chartRef = useRef<ChartJS | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartSelection>("line");

  // ---------- Aggregations ----------
  const categoryTotals: Record<string, { value: number }> = {};
  const budgetTotals: Record<string, { value: number }> = {};

  transactions.forEach((t) => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = { value: 0 };
    categoryTotals[t.category].value += t.value;

    if (t.budget) {
      if (!budgetTotals[t.budget]) budgetTotals[t.budget] = { value: 0 };
      budgetTotals[t.budget].value += t.value;
    }
  });

  const labelsLine = transactions.map((t, i) => t.title || `Tx ${i + 1}`);
  const cumulativeValues = transactions.reduce<number[]>((acc, t, i) => {
    const total = (acc[i - 1] || 0) + t.value;
    acc.push(total);
    return acc;
  }, []);

  const rollingAvg = cumulativeValues.map((_, i) => {
    const slice = cumulativeValues.slice(Math.max(0, i - 2), i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const totalIncome = transactions.filter((t) => t.value > 0).reduce((a, t) => a + t.value, 0);
  const totalExpense = Math.abs(transactions.filter((t) => t.value < 0).reduce((a, t) => a + t.value, 0));
  const top5Tx = [...transactions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 5);

  const labelsCategory = Object.keys(categoryTotals);
  const labelsBudget = Object.keys(budgetTotals);

  // ---------- Modern Palette ----------
  const modernPalette = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#F43F5E", "#3B82F6", "#8B5CF6", "#F97316"];

  // ---------- Gradient Helpers ----------
  const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any, color: string) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, `${color}20`);
    gradient.addColorStop(1, `${color}80`);
    return gradient;
  };

  // ---------- Chart Data ----------
  const lineData: ChartData<"line", number[], string> = {
    labels: labelsLine,
    datasets: [
      {
        label: "Cumulative Balance",
        data: cumulativeValues,
        borderColor: "#6366F1",
        backgroundColor: (ctx) => createGradient(ctx.chart.ctx, ctx.chart.chartArea, "#6366F1"),
        tension: 0.3,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: cumulativeValues.map((v) => (v >= 0 ? "#10B981" : "#EF4444")),
        pointHoverBackgroundColor: cumulativeValues.map((v) => (v >= 0 ? "#34D399" : "#F87171")),
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: cumulativeValues.map((v) => (v >= 0 ? "#047857" : "#B91C1C")),
        borderWidth: 3,
      },
    ],
  };

  const rollingAverageData: ChartData<"line", number[], string> = {
    labels: labelsLine,
    datasets: [
      {
        label: "Rolling Average",
        data: rollingAvg,
        borderColor: "#F59E0B",
        backgroundColor: (ctx) => createGradient(ctx.chart.ctx, ctx.chart.chartArea, "#F59E0B"),
        tension: 0.3,
        fill: true,
        borderDash: [5, 5],
        pointRadius: 4,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
    ],
  };

  const barData: ChartData<"bar", number[], string> = {
    labels: labelsCategory,
    datasets: [
      {
        label: "Category Total",
        data: labelsCategory.map((c) => categoryTotals[c].value),
        backgroundColor: labelsCategory.map((_, i) => modernPalette[i % modernPalette.length]),
        borderRadius: 12,
        maxBarThickness: 50,
      },
    ],
  };

  const pieData: ChartData<"pie", number[], string> = {
    labels: labelsCategory,
    datasets: [
      {
        data: labelsCategory.map((c) => categoryTotals[c].value),
        backgroundColor: labelsCategory.map((_, i) => `hsl(${i * 45}, 70%, 60%)`),
        hoverOffset: 25,
        hoverBorderColor: "#fff",
        hoverBorderWidth: 4,
      },
    ],
  };

  const doughnutData: ChartData<"doughnut", number[], string> = pieData as unknown as ChartData<"doughnut", number[], string>;

  const incomeExpenseData: ChartData<"doughnut", number[], string> = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#10B981", "#EF4444"],
        hoverOffset: 25,
        hoverBorderColor: "#fff",
        hoverBorderWidth: 4,
      },
    ],
  };

  const top5Data: ChartData<"bar", number[], string> = {
    labels: top5Tx.map((t) => t.title),
    datasets: [
      {
        label: "Top 5 Transactions",
        data: top5Tx.map((t) => t.value),
        backgroundColor: top5Tx.map((t) => (t.value >= 0 ? "#10B981" : "#EF4444")),
        borderRadius: 12,
        maxBarThickness: 50,
      },
    ],
  };

  const budgetBarData: ChartData<"bar", number[], string> = {
    labels: labelsBudget,
    datasets: [
      {
        label: "Budget Totals",
        data: labelsBudget.map((b) => budgetTotals[b].value),
        backgroundColor: labelsBudget.map((_, i) => modernPalette[i % modernPalette.length]),
        borderRadius: 12,
        maxBarThickness: 50,
      },
    ],
  };

  // ---------- Modern Options ----------
  const modernOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeOutQuart" },
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 20, padding: 15, font: { size: 14 } } },
      tooltip: { mode: "index", intersect: false, padding: 10 },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb", borderDash: [4, 4] } },
    },
  };

  useEffect(() => {
    chartRef.current?.update();
    chartRef.current?.resize();
  }, [transactions, selectedChart]);

  // ---------- Render ----------
  return (
    <div className="w-full h-full bg-white/30 backdrop-blur-xl rounded-3xl shadow-lg p-4 md:p-6 flex flex-col gap-4 border border-white/20">
      {/* Chart type buttons */}
      <div className="flex flex-wrap justify-end gap-2 md:gap-3 mb-3">
        {[
          { key: "line", label: "Balance" },
          { key: "rollingAverage", label: "Rolling Avg" },
          { key: "bar", label: "Category Total" },
          { key: "pie", label: "Category Share" },
          { key: "doughnut", label: "Category Doughnut" },
          { key: "incomeExpense", label: "Income vs Expense" },
          { key: "top5", label: "Top 5" },
          { key: "budgetTotals", label: "Budget Totals" },
        ].map((chart) => (
          <button
            key={chart.key}
            onClick={() => setSelectedChart(chart.key as ChartSelection)}
            className={`flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl font-semibold transition-all duration-300 ${
              selectedChart === chart.key
                ? "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white/40 text-blue-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400 hover:text-white shadow-sm"
            }`}
          >
            {chart.label}
          </button>
        ))}
      </div>

      {/* Chart display */}
      <div className="flex-1 min-h-[18rem] md:min-h-[24rem] lg:min-h-[28rem] w-full">
        {selectedChart === "line" && <Line ref={chartRef as any} data={lineData} options={modernOptions} />}
        {selectedChart === "rollingAverage" && <Line ref={chartRef as any} data={rollingAverageData} options={modernOptions} />}
        {selectedChart === "bar" && <Bar ref={chartRef as any} data={barData} options={modernOptions} />}
        {selectedChart === "pie" && <Pie ref={chartRef as any} data={pieData} options={modernOptions} />}
        {selectedChart === "doughnut" && <Doughnut ref={chartRef as any} data={doughnutData} options={modernOptions} />}
        {selectedChart === "incomeExpense" && <Doughnut ref={chartRef as any} data={incomeExpenseData} options={modernOptions} />}
        {selectedChart === "top5" && <Bar ref={chartRef as any} data={top5Data} options={modernOptions} />}
        {selectedChart === "budgetTotals" && <Bar ref={chartRef as any} data={budgetBarData} options={modernOptions} />}
      </div>
    </div>
  );
};

export default Charts;
