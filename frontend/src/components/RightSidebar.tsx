import React, { useState, useEffect } from "react";
import axios from "axios";
import getAuthHeaders from "../api/getAuthHeaders.tsx";
import defaultimage from "../assets/default.png";
import { useHistory, Link } from "react-router-dom"; // Import useHistory

function RightSidebar({ user }) {
  const [classes, setClasses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await axios.get(
        "http://194.71.0.30:8000/api/show-own-class",
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

    const uniqueTeachers = {}; // To track unique teachers

    const roleID = user.user.roleId;
    switch (roleID) {
      case 1:
        return (
          <div className="rightsidebar">
            <p>Admin</p>
            <p>Placeholder</p>
            {/* Admin-specific content */}
          </div>
        );

      case 2: // Supervisor
        return (
          <div>
            <h2>Teachers</h2>
            {classes.length > 0 ? (
              <ul>
                {classes.map((classItem) => {
                  const teacher = classItem.teacher;
                  const teacherUUID = teacher.uuid;

                  // Check if this teacher has been rendered already
                  if (!uniqueTeachers[teacherUUID]) {
                    // Mark this teacher as rendered
                    uniqueTeachers[teacherUUID] = true;

                    return (
                      <li key={teacherUUID}>
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
                          {teacher.first_name} {teacher.last_name}
                        </p>
                      </li>
                    );
                  } else {
                    // This teacher has already been rendered, skip
                    return null;
                  }
                })}
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
                    <Link to={`/?user=${student.uuid}`}>
                      <li key={student.uuid}>
                        <img
                          src={
                            student.profile_picture
                              ? student.profile_picture
                              : defaultimage
                          }
                          className="rounded-circle profile"
                          alt="Student Profile"
                        />
                        <p>
                          {student.first_name} {student.last_name} -{" "}
                          {student.classname}
                        </p>
                      </li>
                    </Link>
                  ))}
              </ul>
            ) : (
              <p>No students available.</p>
            )}
          </div>
        );

      case 3: // Teacher
        return (
          <div className="">
            <h2>Your Classes</h2>
            {classes.length > 0 ? (
              <ul>
                {classes.map((classItem) => (
                  <li key={classItem.classid}>
                    {/* Create dynamic links for teachers */}
                    <Link to={`/?class=${classItem.classid}`}>
                      <h4>Class Name: {classItem.classname}</h4>
                    </Link>
                    {/* Rest of the content */}
                    <p>Students:</p>
                    <ul>
                      {classItem.students.map((student) => (
                        <li key={student.uuid}>
                          <Link
                            to={`/?class=${classItem.classid}&user=${student.uuid}`}
                          >
                            <div className="profile p-2">
                              <img
                                src={
                                  student.profile_picture
                                    ? student.profile_picture
                                    : defaultimage
                                }
                                className="rounded-circle mr-2"
                              />
                              <div className="p-4">
                                {student.first_name} {student.last_name}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes available.</p>
            )}
          </div>
        );

      case 4: // Student
        return (
          <div className="rightsidebar">
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
          </div>
        );

      default:
        return <p>Error</p>;
    }
  };

  return <div className="Sidebar  p-3">{renderRoleContent()}</div>;
}

export default RightSidebar;
