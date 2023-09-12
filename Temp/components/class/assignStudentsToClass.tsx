import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const AssignStudentsToClass = () => {
  const [classId, setClassId] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchClassesAndStudents() {
      try {
        const responseClasses = await axios.get(
          "http://194.71.0.30:8000/api/show-own-class",
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );
        setClasses(responseClasses.data.classes);

        // classes.teacher>classId ? Alternative Fetch user data get schoolid

        if (responseClasses.data.classes.length > 0) {
          const schoolId = responseClasses.data.classes[0].teacher.school_id;
          console.log(classes);

          const responseStudents = await axios.get(
            `http://194.71.0.30:8000/api/get-all-students-from-school/${schoolId}`,
            {
              headers: {
                ...getAuthHeaders(),
              },
            }
          );

          const studentsFromSchool = responseStudents.data.filter(
            (student) => student.role_id === 4
          );
          setStudents(studentsFromSchool);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchClassesAndStudents();
  }, []);

  const handleAssignStudents = async () => {
    try {
      const response = await axios.put(
        "http://194.71.0.30:8000/api/assign-students-to-class",
        {
          class_id: classId,
          student_ids: studentIds,
        },
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      setMessage(response.data.message);

      // Update the students state with the newly assigned students
      setStudents([...students, ...response.data.students]); // Make sure response.data.students matches the structure of your state
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while assigning students.");
    }
  };

  const handleDetachStudents = async () => {
    try {
      const responseDetach = await axios.put(
        "http://194.71.0.30:8000/api/detach-students-from-class",
        {
          class_id: classId,
          student_ids: studentIds,
        },
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      setMessage(responseDetach.data.message);

      // Update the students state by filtering out the detached students
      setStudents(
        students.filter((student) => !studentIds.includes(student.uuid))
      ); // Make sure to adjust this to match your data structure
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while detaching students.");
    }
  };

  return (
    <div className="post  bg-white " style={{ height: "1000px" }}>
      <h2>Assign Students to Class</h2>
      <div>
        <label>Select Class:</label>
        <select onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select a class</option>
          {classes.map((classItem) => (
            <option key={classItem.classid} value={classItem.classid}>
              {classItem.classname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Students:</label>
        <select
          className="mt-4 row"
          multiple
          value={studentIds}
          onChange={(e) =>
            setStudentIds(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {students.map((student) => {
            if (student.role_id === 4) {
              // Adjusted condition here
              return (
                <option key={student.uuid} value={student.uuid}>
                  {student.first_name} {student.last_name}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AssignStudentsToClass;
