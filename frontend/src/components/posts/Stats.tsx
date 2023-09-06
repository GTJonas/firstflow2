import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders";
import DoughnutChart from "../../Charts/UserattendanceChart";

const Stats = () => {
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [Approvedusers, setApprovedusers] = useState(0);
  const [Rejectedusers, setRejectedusers] = useState(0);
  const [Pendingusers, setPendingusers] = useState(0);
  const [Totalstudents, setTotalstudents] = useState(0);

  // State to hold the selected class
  const [classSelector, setClassSelector] = useState(""); // Initialize with an empty string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://194.71.0.30:8000/api/getAttendanceStatus",
          {
            desiredDate,
            classSelector, // Include the classSelector in the request body
          },
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

        setClassData(response.data);
        setIsLoading(false);
        setApprovedusers(response.data.approved.length);
        setRejectedusers(response.data.rejected.length);
        setPendingusers(response.data.pending.length);
        setTotalstudents(response.data.studentCount);

        // Log the value of Approvedusers here
        console.log(Approvedusers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    console.log(classData);

    fetchData();
  }, [classSelector]);

  // Handler function for class selector change
  const handleClassSelectorChange = (event) => {
    setClassSelector(event.target.value); // Update the classSelector state when the user selects a class
  };
  return (
    <div>
      <div>
        <h1>Student Attendance</h1>

        {isLoading ? (
          <p>Loading attendance data...</p>
        ) : (
          <>
            <div>
              <DoughnutChart
                approved={Approvedusers}
                rejected={Rejectedusers}
                pending={Pendingusers}
              />
            </div>

            <h2>
              Approved: {Approvedusers} / {Totalstudents - Rejectedusers}
            </h2>
            <h2>
              Rejected: {Rejectedusers} / {Totalstudents - Approvedusers}
            </h2>
            {Pendingusers !== 0 && (
              <h2>
                Pending: {Pendingusers} / {Totalstudents}
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;
