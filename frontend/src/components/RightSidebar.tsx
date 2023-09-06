import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../api/getAuthHeaders.tsx";

function RightSidebar({ user }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://194.71.0.30:80000/api/show-own-class",
        {
          headers: getAuthHeaders(),
        }
      );
      console.log("Api call = " + JSON.stringify(response));
      setClasses(response.data.classes);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }

  //console.log(user);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const renderRoleContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return <p>User not available.</p>;
    }

    const roleID = user.user.roleId;
    switch (roleID) {
      case 1:
        return (
          <>
            <p>Admin</p>
            <p>Placeholder</p>
            {/* Admin-specific content */}
          </>
        );

      case 2: // Supervisor
        return (
          <>
            <h2>Teachers</h2>
            {classes.length > 0 ? (
              <ul>
                {classes
                  .flatMap((classItem) => classItem.teacher)
                  .map((teacher) => (
                    <li key={teacher.uuid}>
                      <img
                        src={teacher.profile_picture}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        alt="Teacher Profile"
                      />
                      <p>
                        {teacher.first_name} {teacher.last_name} -{" "}
                        {teacher.classname}
                      </p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No unique teachers available.</p>
            )}

            <h2>Students</h2>
            {classes.length > 0 ? (
              <ul>
                {classes
                  .flatMap((classItem) => classItem.students)
                  .map((student) => (
                    <li key={student.uuid}>
                      <img
                        src={student.profile_picture}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        alt="Student Profile"
                      />
                      <p>
                        {student.first_name} {student.last_name} -{" "}
                        {student.classname}
                      </p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No students available.</p>
            )}
          </>
        );

      case 3: // Teacher
        return (
          <>
            <h2>Your Classes</h2>
            {classes.length > 0 ? (
              <ul>
                {classes.map((classItem) => (
                  <li key={classItem.classid}>
                    <p>Class Name: {classItem.classname}</p>
                    {/*
                                        <p>
                                            Teacher:
                                            <img
                                                src={classItem.teacher.profile_picture}
                                                className="rounded-circle"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                alt="Teacher Profile"
                                            />
                                            {classItem.teacher.first_name} {classItem.teacher.last_name}
                                        </p>
                                        */}
                    <p>Students:</p>
                    <ul>
                      {classItem.students.map((student) => (
                        <li key={student.uuid}>
                          <img
                            src={student.profile_picture}
                            className="rounded-circle"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            alt="Student Profile"
                          />
                          {student.first_name} {student.last_name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes available.</p>
            )}
          </>
        );

      case 4: // Student
        return (
          <>
            <h2>Din klass</h2>
            {classes.length > 0 ? (
              <ul>
                {/* this can be a component */}
                {classes.map((classItem) => (
                  <li key={classItem.classid}>
                    <p>{classItem.classname}</p>
                    <p>
                      <img
                        src={classItem.teacher.profile_picture}
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        alt="Teacher Profile"
                      />
                      {classItem.teacher.first_name}{" "}
                      {classItem.teacher.last_name} - Lärare
                    </p>
                    <ul>
                      {classItem.students.map((student) => (
                        <li key={student.uuid}>
                          <img
                            src={student.profile_picture}
                            className="rounded-circle"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            alt="Student Profile"
                          />
                          {student.first_name} {student.last_name} - Elev
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes available.</p>
            )}
          </>
        );

      default:
        return <p>Error</p>;
    }
  };

  return <div className="Sidebar">{renderRoleContent()}</div>;
}

export default RightSidebar;
