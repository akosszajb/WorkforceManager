import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteEmployee = async (id) => {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (response.ok) {
    return true;
  }
  return false;
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);

  const handleDelete = async (id) => {
    const success = await deleteEmployee(id);
    if (success) {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );
    } else {
      console.error(`Failed to delete employee with ID ${id}`);
    }
  };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return employees ? (
    <EmployeeTable employees={employees} onDelete={handleDelete} />
  ) : null;
};

export default EmployeeList;
