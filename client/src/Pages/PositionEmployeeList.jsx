// PositionEmployeeList.jsx

import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchPositionEmployee = async (position) => {
  const response = await fetch(`/api/employees/position/${position}`);
  const data = await response.json();
  return data;
};

const PositionEmployeeList = ({ filterPosition }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filterPosition.trim() !== "") {
          const filteredEmployees = await fetchPositionEmployee(filterPosition);
          setEmployees(filteredEmployees);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching position employees:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterPosition]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <h2> Filtered employees</h2>
      </div>

      <EmployeeTable employees={employees} />
    </div>
  );
};

export default PositionEmployeeList;
