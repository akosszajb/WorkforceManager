import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";
import { useParams } from "react-router-dom";

const fetchSearchedEmployees = (search) => {
  return fetch(`/employees/${search}`).then((res) => res.json());
};

const deleteSearchedEmployee = async (id) => {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (response.ok) {
    return true;
  }
  return false;
};

const SearchedEmployeeList = () => {
  const { search } = useParams();
  const [searchEmployeeTerm, setSearchEmployeeTerm] = useState(search);
  const [loading, setLoading] = useState(true);
  const [searchedEmployees, setSearchedEmployees] = useState([]);
  const [sortSearchedBy, setSortSearchedBy] = useState(null);

  const handleSearchedDelete = async (id) => {
    const success = await deleteSearchedEmployee(id);
    if (success) {
      setSearchedEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );
    } else {
      console.error(`Failed to delete from searched employees with ID ${id}`);
    }
  };

  const handleSSearch = (event) => {
    setSearchEmployeeTerm(event.target.value);
  };

  const handleSSortByPosition = () => {
    setSortSearchedBy("position");
  };

  const handleSSortByLevel = () => {
    setSortSearchedBy("level");
  };

  const handleSSortByFirstName = () => {
    setSortSearchedBy("firstName");
  };

  const handleSSortByMiddleName = () => {
    setSortSearchedBy("middleName");
  };

  const handleSSortByLastName = () => {
    setSortSearchedBy("lastName");
  };

  useEffect(() => {
    // Egy második useEffect a komponens inicializálásához
    fetchSearchedEmployees(search) // Keresési kifejezés átadása
      .then((employees) => {
        setLoading(false);
        setSearchedEmployees(employees);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []); // Üres függőséglista, így csak a komponens inicializálásakor fut le

  let filteredSEmployees = searchedEmployees.slice(); // Másolat készítése

  if (sortSearchedBy) {
    filteredSEmployees.sort((a, b) => {
      if (sortSearchedBy === "position") {
        return (a.position || "").localeCompare(b.position || "");
      } else if (sortSearchedBy === "level") {
        return (a.level || "").localeCompare(b.level || "");
      } else if (sortSearchedBy === "firstName") {
        return (a.firstName || "").localeCompare(b.firstName || "");
      } else if (sortSearchedBy === "middleName") {
        return (a.middleName || "").localeCompare(b.middleName || "");
      } else if (sortSearchedBy === "lastName") {
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
        value={searchEmployeeTerm}
        onChange={handleSSearch}
      />

      <button type="button" onClick={handleSSortByFirstName}>
        Sort by First Name
      </button>
      <button type="button" onClick={handleSSortByMiddleName}>
        Sort by Middle Name
      </button>
      <button type="button" onClick={handleSSortByLastName}>
        Sort by Last Name
      </button>
      <button type="button" onClick={handleSSortByLevel}>
        Sort by Level
      </button>
      <button type="button" onClick={handleSSortByPosition}>
        Sort by Position
      </button>

      <EmployeeTable
        employees={filteredSEmployees}
        onDelete={handleSearchedDelete}
      />
    </>
  );
};

export default SearchedEmployeeList;
