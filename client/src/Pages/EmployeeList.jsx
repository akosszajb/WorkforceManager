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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortByPosition = () => {
    setSortBy("position");
  };

  const handleSortByLevel = () => {
    setSortBy("level");
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

  let filteredEmployees = employees
    ? employees.filter((employee) => {
        return (
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.level.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  if (sortBy) {
    filteredEmployees.sort((a, b) => {
      if (sortBy === "position") {
        return a.position.localeCompare(b.position);
      } else if (sortBy === "level") {
        return a.level.localeCompare(b.level);
      }
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search by Position or Level"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button type="button" onClick={handleSortByPosition}>
        Sort by Position
      </button>
      <button type="button" onClick={handleSortByLevel}>
        Sort by Level
      </button>
      <EmployeeTable employees={filteredEmployees} onDelete={handleDelete} />
    </>
  );
};

export default EmployeeList;
