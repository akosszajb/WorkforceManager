import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchLevelEmployee = async (level) => {
  const response = await fetch(`/api/employees/position/${level}`);
  const data = await response.json();
  return data;
};

const LevelEmployeeList = ({ filterLevel }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filterLevel.trim() !== "") {
          const filteredEmployees = await fetchLevelEmployee(filterLevel);
          setEmployees(filteredEmployees);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching level employees:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterLevel]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div></div>

      <EmployeeTable employees={employees} />
    </div>
  );
};

export default LevelEmployeeList;
