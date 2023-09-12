import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Charts.css";

interface DoughnutChartProps {
  approvedUsers: User[];
  rejectedUsers: User[];
  pendingUsers: User[];
}

interface User {
  id: string;
  name: string;
  status: "approved" | "rejected" | "pending";
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  approvedUsers,
  rejectedUsers,
  pendingUsers,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart if it exists
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }

      // Create a new doughnut chart
      myChartRef.current = new Chart(ctx, {
        type: "doughnut",
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
        data: {
          labels: ["Approved", "Rejected", "Pending"],
          datasets: [
            {
              data: [
                approvedUsers.length,
                rejectedUsers.length,
                pendingUsers.length,
              ],
              backgroundColor: ["#33FF57", "#FF5733", "#FFFF00"],
            },
          ],
        },
      });
    }

    return () => {
      // Destroy the chart when the component unmounts
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [approvedUsers, rejectedUsers, pendingUsers]);

  return (
    <div className="w-100">
      <canvas id="myChart" ref={chartRef}></canvas>
    </div>
  );
};

export default DoughnutChart;
