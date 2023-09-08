import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders";
import DoughnutChart from "../../Charts/UserattendanceChart";

const Stats = () => {
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvedUsers, setApprovedUsers] = useState([]); // Updated state initialization
  const [rejectedUsers, setRejectedUsers] = useState([]); // Updated state initialization
  const [pendingUsers, setPendingUsers] = useState([]); // Updated state initialization

  const [totalStudentsCount, setTotalStudentsCount] = useState(0);

  // State to hold the selected class
  const [classSelector, setClassSelector] = useState(""); // Initialize with an empty string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://194.71.0.30:8000/api/getAttendanceStatus",
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

        setClassData(response.data);
        setIsLoading(false);

        setApprovedUsers(response.data.approved);
        setRejectedUsers(response.data.rejected);
        setPendingUsers(response.data.pending);
        setTotalStudentsCount(response.data.studentCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

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
                approvedUsers={approvedUsers}
                rejectedUsers={rejectedUsers}
                pendingUsers={pendingUsers}
              />
            </div>

            {pendingUsers.length !== 0 && (
              <h2>
                Pending: {pendingUsers.length} /{" "}
                {totalStudentsCount -
                  approvedUsers.length -
                  rejectedUsers.length}
              </h2>
            )}
            <h2>
              Approved: {approvedUsers.length} / {totalStudentsCount}
            </h2>
            <h2>
              Rejected: {rejectedUsers.length} / {totalStudentsCount}
            </h2>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;
