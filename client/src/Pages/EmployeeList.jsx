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

const toggleEmployeePresent = async (id, present) => {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ present }),
  });
  if (response.ok) {
    return true;
  }
  return false;
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ key: null, order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  const handlePresentToggle = async (id, present) => {
    const success = await toggleEmployeePresent(id, present);
    if (success) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === id ? { ...employee, present } : employee
        )
      );
    } else {
      console.error(`Failed to toggle employee present status with ID ${id}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    if (sortBy.key === key) {
      setSortBy({ key, order: sortBy.order === "asc" ? "desc" : "asc" });
    } else {
      setSortBy({ key, order: "asc" });
    }
  };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setEmployees(employees);
        setLoading(false);
        setTotalPages(Math.ceil(employees.length / 10));
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  let filteredEmployees = employees
    ? employees.filter((employee) => {
        return (
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.level.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  if (sortBy.key) {
    filteredEmployees.sort((a, b) => {
      const keyA = a[sortBy.key];
      const keyB = b[sortBy.key];
      if (typeof keyA === "string") {
        return sortBy.order === "asc"
          ? keyA.localeCompare(keyB)
          : keyB.localeCompare(keyA);
      } else {
        return sortBy.order === "asc" ? keyA - keyB : keyB - keyA;
      }
    });
  }

  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

      <button type="button" onClick={() => handleSort("firstName")}>
        Sort by First Name
      </button>
      <button type="button" onClick={() => handleSort("middleName")}>
        Sort by Middle Name
      </button>
      <button type="button" onClick={() => handleSort("lastName")}>
        Sort by Last Name
      </button>
      <button type="button" onClick={() => handleSort("level")}>
        Sort by Level
      </button>
      <button type="button" onClick={() => handleSort("position")}>
        Sort by Position
      </button>

      <EmployeeTable
        employees={currentEmployees}
        onDelete={handleDelete}
        handlePresentToggle={handlePresentToggle}
      />
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default EmployeeList;
