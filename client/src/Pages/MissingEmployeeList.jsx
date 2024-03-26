import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import MissingEmployeeTable from "../Components/MissingEmployeeTable/MissingEmployeeTable";

const fetchMissingEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteMissingEmployee = async (id) => {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (response.ok) {
    return true;
  }
  return false;
};

const MissingEmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const handleDelete = async (id) => {
    const success = await deleteMissingEmployee(id);
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

  const handleSortByFirstName = () => {
    setSortBy("firstName");
  };
  const handleSortByMiddleName = () => {
    setSortBy("middleName");
  };
  const handleSortByLastName = () => {
    setSortBy("lastName");
  };

  useEffect(() => {
    fetchMissingEmployees()
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
          !employee.present &&
          (employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.level.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    : [];

  if (sortBy) {
    filteredEmployees.sort((a, b) => {
      if (sortBy === "position") {
        return (a.position || "").localeCompare(b.position || "");
      } else if (sortBy === "level") {
        return (a.level || "").localeCompare(b.level || "");
      } else if (sortBy === "firstName") {
        return (a.firstName || "").localeCompare(b.firstName || "");
      } else if (sortBy === "middleName") {
        return (a.middleName || "").localeCompare(b.middleName || "");
      } else if (sortBy === "lastName") {
        return (a.lastName || "").localeCompare(b.lastName || "");
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

      <button type="button" onClick={handleSortByFirstName}>
        Sort by First Name
      </button>
      <button type="button" onClick={handleSortByMiddleName}>
        Sort by Middle Name
      </button>
      <button type="button" onClick={handleSortByLastName}>
        Sort by Last Name
      </button>
      <button type="button" onClick={handleSortByLevel}>
        Sort by Level
      </button>
      <button type="button" onClick={handleSortByPosition}>
        Sort by Position
      </button>

      <MissingEmployeeTable
        employees={filteredEmployees}
        onDelete={handleDelete}
      />
    </>
  );
};

export default MissingEmployeeList;
