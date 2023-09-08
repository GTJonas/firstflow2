import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

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
    <div style={{ width: "200px" }}>
      <canvas
        ref={chartRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      ></canvas>
    </div>
  );
};

export default DoughnutChart;
