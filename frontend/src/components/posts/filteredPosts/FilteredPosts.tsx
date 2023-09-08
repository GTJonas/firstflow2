import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import PostItem from "./postItem"; // Import your PostItem component here
import getAuthHeaders from "../../../api/getAuthHeaders.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../assets/Icons/Icons.css";

const API_BASE_URL = "http://194.71.0.30:8000/api"; // Change to your API URL

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const getTimeAgo = (date) => {
  const currentDate = new Date();
  const postDate = new Date(date);

  if (
    currentDate.getFullYear() === postDate.getFullYear() &&
    currentDate.getMonth() === postDate.getMonth() &&
    currentDate.getDate() === postDate.getDate()
  ) {
    return `Today ⋅ ${dayNames[postDate.getDay()]}`;
  } else {
    const daysAgo = Math.floor(
      (currentDate - postDate) / (1000 * 60 * 60 * 24)
    );

    if (daysAgo === 1) {
      return `Yesterday ⋅ ${dayNames[postDate.getDay()]}`;
    } else if (daysAgo <= 7) {
      return `${dayNames[postDate.getDay()]}`;
    } else if (daysAgo <= 14) {
      return `1 week ago ${dayNames[postDate.getDay()]}`;
    } else if (daysAgo <= 21) {
      return `2 weeks ago ${dayNames[postDate.getDay()]}`;
    } else if (daysAgo <= 30) {
      return `${Math.floor(daysAgo / 7)} weeks ago (${
        dayNames[postDate.getDay()]
      }`;
    } else if (daysAgo <= 60) {
      return `1 month ago ${dayNames[postDate.getDay()]}`;
    } else if (daysAgo <= 90) {
      return `2 months ago ${dayNames[postDate.getDay()]}`;
    } else {
      const monthsAgo = Math.floor(daysAgo / 30);
      return `${monthsAgo} months ago ${dayNames[postDate.getDay()]}`;
    }
  }
};

const FilteredPosts = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(""); // Step 1
  const [classOptions, setClassOptions] = useState([]);
  const [classesFetched, setClassesFetched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const isHistoryPage = location.pathname.includes("/history");

  const [weeks, setWeeks] = useState(2); // Predefined to 2 weeks
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5); // Default per page
  const [totalPosts, setTotalPosts] = useState(0);

  // Add a loading state for posts related to a specific student
  const [loadingStudentPosts, setLoadingStudentPosts] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const handleStudentChange = (studentUuid) => {
    setSelectedStudent(studentUuid);
    setFilteredPosts([]); // Reset filteredPosts to an empty array

    // Set loadingStudentPosts to true while fetching student-specific posts
    setLoadingStudentPosts(true);

    // Call the API again with the updated student UUID
    fetchAndSetData();
  };

  const fetchAndSetData = async () => {
    try {
      const params = {
        per_page: perPage,
        page: currentPage,
        class_id: selectedClassId,
        user_uuid: selectedStudent, // Make sure this value is correct
      };

      // Make the API request

      const postsResponse = await axios.get(`${API_BASE_URL}/filtered-posts`, {
        params: params,
        headers: {
          ...getAuthHeaders(),
        },
      });

      setFilteredPosts(postsResponse.data.filteredPosts);
      setLastPage(postsResponse.data.pagination.last_page);
      setPerPage(postsResponse.data.pagination.per_page);
      setTotalPosts(postsResponse.data.pagination.total);

      // Set loadingStudentPosts back to false once posts are loaded
      setLoadingStudentPosts(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      // Also set loadingStudentPosts to false on error
      setLoadingStudentPosts(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, [selectedClassId, weeks, currentPage, perPage, selectedStudent]);

  const fetchClasses = async () => {
    try {
      const classOptionsResponse = await axios.get(
        `${API_BASE_URL}/show-own-class`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      //console.log(JSON.stringify(classOptionsResponse, null, 2));
      setClassOptions(classOptionsResponse.data.classes);
      setClassesFetched(true);
      console.log("ClassOptions: ", classOptions);
      console.log("classOptions.length: ", classOptions.length);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    // Check if the location pathname contains "/history"
    if (isHistoryPage) {
      // Perform actions when navigating to history
      setLoading(true); // For example, reset loading state
      fetchAndSetData(); // Refetch data
    }
  }, [isHistoryPage]); // Re-run the effect when the location changes

  useEffect(() => {
    if (!classesFetched) {
      fetchClasses();
    }
  }, [classesFetched]);

  const postsByTimeAgo = useMemo(() => {
    return filteredPosts.reduce((acc, post) => {
      const postDate = new Date(post.created_at);
      postDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00

      const timeAgo = getTimeAgo(postDate);

      if (!acc[timeAgo]) {
        acc[timeAgo] = [];
      }

      acc[timeAgo].push(post);

      return acc;
    }, {});
  }, [filteredPosts]); // Use useMemo to optimize rendering

  const renderPostsByTimeAgo = useMemo(() => {
    return Object.entries(postsByTimeAgo).map(([timeAgo, posts]) => (
      <div key={timeAgo}>
        <strong>{timeAgo}</strong>
        {posts.map((post) => (
          <PostItem key={post.uuid} post={post} user={user} />
        ))}
      </div>
    ));
  }, [postsByTimeAgo, user]);

  // ... Inside the renderClassSelector useMemo
  const renderClassSelector = useMemo(() => {
    if (classesFetched === true && user.user.roleId !== 4) {
      if (classOptions.length > 0) {
        console.log("Rendering class selector with options");
        return (
          <div>
            <select
              value={selectedClassId} // This value is selected based on user interaction
              onChange={(e) => setSelectedClassId(e.target.value)} // This updates the selectedClassId state
            >
              <option value="">All Classes</option>
              {classOptions.map((classObj) => (
                <option key={classObj.classid} value={classObj.classid}>
                  {classObj.classname} - {classObj.school_name}
                </option>
              ))}
            </select>
          </div>
        );
      } else {
        console.log("No classes available to render");
        return null;
      }
    } else {
      console.log("Class not fetched or user role is 4.");
      return null;
    }
  }, [classOptions, selectedClassId, classesFetched, decodedToken.userRole]);

  const renderStudentSelector = useMemo(() => {
    if (selectedClassId && classOptions.length > 0) {
      const selectedClass = classOptions.find(
        (classObj) => classObj.classid === parseInt(selectedClassId)
      );
      if (selectedClass && selectedClass.students.length > 0) {
        return (
          <div>
            <select
              value={selectedStudent} // This value should match the UUID of the selected student
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              <option value="">Select Student</option>
              {selectedClass.students.map((student) => (
                <option key={student.uuid} value={student.uuid}>
                  {" "}
                  {/* This value should be student.uuid */}
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>
        );
      }
    }
    return null;
  }, [selectedClassId, selectedStudent, classOptions]);

  if (currentPage >= 1) {
    return (
      <>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {/* Show a loading indicator while loading student-specific posts */}
            {loadingStudentPosts ? (
              <p>Loading student posts...</p>
            ) : (
              <>
                {user.user.roleId !== 4 && renderClassSelector}
                {renderStudentSelector} {/* Render the student selector */}
                <div>{renderPostsByTimeAgo}</div>
              </>
            )}
            {totalPosts < 5 ? (
              <></>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-primary"
                >
                  Previous Page
                </button>
                <span>
                  {currentPage} / {lastPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="btn btn-primary"
                >
                  Next Page
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  } else {
    return <>No posts found.</>;
  }
};

export default FilteredPosts;
