import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface DoughnutChartProps {
  approved?: number;
  declined?: number;
  pending?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  approved = 1,
  declined = 1,
  pending = 1,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let myChart: Chart | null = null;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (myChart) {
        myChart.destroy();
      }

      myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Approved", "Declined", "Pending"],
          datasets: [
            {
              data: [approved, declined, pending],
              backgroundColor: ["#33FF57", "#FF5733", "#FFFF00"],
            },
          ],
        },
      });
    }

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [approved, declined, pending]);

  return (
    <div style={{ width: "200px" }}>
      <canvas
        ref={chartRef}
        style={{
          height: "100%",
          width: "100%",
          // Add your CSS styles here
        }}
      ></canvas>
    </div>
  );
};

export default DoughnutChart;
