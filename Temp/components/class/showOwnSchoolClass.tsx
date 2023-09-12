import React, { useEffect, useState } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const ShowOwnSchoolClass = () => {
  const [classDetailsList, setClassDetailsList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState({});
  const [classId, setClassId] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [isAssignDetachMode, setIsAssignDetachMode] = useState(false); // Define and manage this state

  useEffect(() => {
    async function fetchData() {
      try {
        const [classDetailsResponse, companiesResponse] = await Promise.all([
          axios.get("http://194.71.0.30:8000/api/show-own-class", {
            headers: getAuthHeaders(),
          }),
          axios.get("http://194.71.0.30:8000/api/company/all/show", {
            headers: getAuthHeaders(),
          }),
        ]);

        setClassDetailsList(classDetailsResponse.data.classes);
        setCompanies(companiesResponse.data.companies);

        if (classDetailsResponse.data.classes.length > 0) {
          const schoolId =
            classDetailsResponse.data.classes[0].teacher.school_id;

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

    fetchData();
  }, []);

  const handleCompanyChange = (event, classIndex, studentIndex) => {
    const { value } = event.target;

    setSelectedCompanies((prevSelectedCompanies) => ({
      ...prevSelectedCompanies,
      [classIndex]: {
        ...prevSelectedCompanies[classIndex],
        [studentIndex]: value,
      },
    }));
  };

  const updateUserCompany = async (
    classIndex,
    studentIndex,
    newCompanyUuid
  ) => {
    try {
      const response = await axios.put(
        "http://194.71.0.30:8000/api/change-company",
        {
          user_id: classDetailsList[classIndex].students[studentIndex].uuid,
          new_company_uuid: newCompanyUuid,
        },
        { headers: getAuthHeaders() }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAllCompanies = async () => {
    const updates = [];

    // Loop through all classes and students
    classDetailsList.forEach((classDetails, classIndex) => {
      classDetails.students.forEach((student, studentIndex) => {
        const newCompanyUuid = selectedCompanies[classIndex]?.[studentIndex];
        if (newCompanyUuid) {
          updates.push(
            updateUserCompany(classIndex, studentIndex, newCompanyUuid)
          );
        }
      });
    });

    // Wait for all updates to finish
    await Promise.all(updates);

    console.log("All companies updated");
  };

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
      setStudents((prevStudents) => [
        ...prevStudents,
        ...response.data.students,
      ]);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while assigning students.");
    }
  };

  const handleDetachStudent = async (studentUuid) => {
    try {
      // Perform the detachment logic here
      // You can use axios or any other method to send a request to your API
      // to detach the student from the class

      // After the detachment is successful, update the students state
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.uuid !== studentUuid)
      );

      setMessage("Student detached successfully.");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while detaching the student.");
    }
  };

  return (
    <div className="bg-white p-4 rounded">
      {Array.isArray(classDetailsList) &&
        classDetailsList.map((classDetails, classIndex) => (
          <div key={classIndex}>
            <h2>{classDetails.classname}</h2>
            <p>
              Teacher: {classDetails.teacher.first_name}{" "}
              {classDetails.teacher.last_name}
            </p>
            {isAssignDetachMode ? (
              <div>
                <p>Students for Assign/Detach:</p>
                <ul>
                  {classDetails.students.map((student, studentIndex) => (
                    <li key={studentIndex}>
                      {student.first_name} {student.last_name}
                      {isAssignDetachMode && (
                        <select
                          className="ms-2"
                          value={
                            selectedCompanies[classIndex]?.[studentIndex] || ""
                          }
                          onChange={(event) =>
                            handleCompanyChange(event, classIndex, studentIndex)
                          }
                        >
                          <option value="">Select a company</option>
                          {companies.map((company, index) => (
                            <option key={index} value={company.uuid}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => handleDetachStudent(student.uuid)} // Replace with your detach function
                      >
                        Detach
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p>Students:</p>
                <ul>
                  {classDetails.students.map((student, studentIndex) => (
                    <li key={studentIndex}>
                      {student.first_name} {student.last_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      {isAssignDetachMode && (
        <div>
          <h2>Assign/Detach Students</h2>
          <div>
            <div>
              <label>Select Class:</label>
              <select onChange={(e) => setClassId(e.target.value)}>
                <option value="">Select a class</option>
                {classDetailsList.map((classItem) => (
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
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
              >
                {students.map((student) => {
                  if (student.role_id === 4) {
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

            <button className="m-2" onClick={handleAssignStudents}>
              Assign Students
            </button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
      <button onClick={() => setIsAssignDetachMode(true)}>
        Switch to Assign/Detach Mode
      </button>
      <button onClick={() => setIsAssignDetachMode(false)}>
        Switch to View Mode
      </button>
      <button onClick={updateAllCompanies}>Update All Companies</button>
    </div>
  );
};

export default ShowOwnSchoolClass;
