import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders";

const Stats = () => {
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [attendanceData, setAttendanceData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.78:8000/api/show-own-class",
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

        setClassData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (classData) {
        try {
          // Iterate through the students in the class data and fetch their attendance data
          const studentAttendancePromises = classData.classes[0].students.map(
            async (student) => {
              const response = await axios.get(
                `http://192.168.1.78:8000/api/getAttendanceHistory?user_uuid=${student.uuid}`,
                {
                  headers: {
                    ...getAuthHeaders(),
                  },
                }
              );

              return {
                student,
                attendance: response.data.attendance,
              };
            }
          );

          // Wait for all attendance requests to complete
          const studentAttendanceData = await Promise.all(
            studentAttendancePromises
          );

          setAttendanceData(studentAttendanceData);
          setDataLoaded(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchAttendanceData();
  }, [classData]);

  return (
    <div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <h1>Class Information</h1>
          <p>Display class information here.</p>

          <h1>Student Attendance</h1>
          {dataLoaded ? (
            attendanceData.map((studentAttendance) => (
              <div key={studentAttendance.student.uuid}>
                <h2>
                  {studentAttendance.student.first_name}{" "}
                  {studentAttendance.student.last_name}
                </h2>
                {/* Render attendance data for the student here */}
                <ul>
                  {studentAttendance.attendance.map((item, index) => (
                    <li key={index}>
                      Date: {item.date}, Status: {item.status}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Loading attendance data...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;
