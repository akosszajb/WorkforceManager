import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import EmployeeTable from "../../Components/EmployeeTable";

// Fetch függvények definíciója
const fetchPositionEmployee = async (position) => {
  const response = await fetch(`/api/employees/position/${position}`);
  const data = await response.json();
  return data;
};

const fetchLevelEmployee = async (level) => {
  const response = await fetch(`/api/employees/level/${level}`);
  const data = await response.json();
  return data;
};

const Layout = () => {
  const [filterPosition, setFilterPosition] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Állapot a szűrés jelenlétének jelzésére

  useEffect(() => {
    fetch(`/api/employees`)
      .then((response) => response.json())
      .then((data) => {
        setAllEmployees(data);
        setFilteredEmployees(data); // Az összes alkalmazott megjelenítése kezdetben
      })
      .catch((error) => {
        console.error("Error with fetching employees:", error);
      });
  }, []);

  useEffect(() => {
    if (filterPosition !== "") {
      handlePositionFilter();
    } else if (filterLevel !== "") {
      handleLevelFilter();
    } else {
      setFilteredEmployees(allEmployees);
    }
  }, [filterPosition, filterLevel, allEmployees]); // Figyeljük az allEmployees állapot változását is

  const handlePositionFilter = async () => {
    if (filterPosition !== "") {
      const filteredEmployees = await fetchPositionEmployee(filterPosition);
      setFilteredEmployees(filteredEmployees);
      setIsFiltered(true); // Szűrés jelenlétének beállítása
    } else {
      setFilteredEmployees(allEmployees);
      setIsFiltered(false); // Nincs szűrés
    }
  };

  const handleLevelFilter = async () => {
    if (filterLevel !== "") {
      const filteredEmployees = await fetchLevelEmployee(filterLevel);
      setFilteredEmployees(filteredEmployees);
      setIsFiltered(true); // Szűrés jelenlétének beállítása
    } else {
      setFilteredEmployees(allEmployees);
      setIsFiltered(false); // Nincs szűrés
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "position") {
      setFilterPosition(value);
    } else if (name === "level") {
      setFilterLevel(value);
    }
  };

  const handlePageReload = () => {
    if (filterPosition !== "" || filterLevel !== "") {
      setFilterPosition("");
      setFilterLevel("");
      setIsFiltered(false);
      window.location.href = "http://localhost:3000/";
    }
  };

  const handleDeleteEmployee = async (id) => {
    const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (response.ok) {
      // Törlés után frissítjük csak a szűrt alkalmazottak listáját
      const updatedFilteredEmployees = filteredEmployees.filter(
        (employee) => employee._id !== id
      );
      console.log(updatedFilteredEmployees); // Hibakeresés céljából kiírjuk a konzolra a frissített állapotot
      setFilteredEmployees([...updatedFilteredEmployees]);
    }
  };

  return (
    <div className="Layout">
      <nav>
        <ul>
          <li className="grow">
            <Link to="/">Employees</Link>
          </li>
          <li>
            <label>
              Position:
              <input
                type="text"
                name="position"
                value={filterPosition}
                onChange={handleFilterChange}
              />
            </label>
          </li>
          <li>
            <label>
              Level:
              <input
                type="text"
                name="level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </label>
          </li>
          <li>
            <button type="button" onClick={handlePageReload}>
              Clear Filters
            </button>
          </li>
          <li>
            <Link to="/create">
              <button type="button">Create Employee</button>
            </Link>
          </li>
        </ul>
      </nav>
      {isFiltered && (
        <div className="FilteredEmployeeList">
          <h2>Employees - Filtered</h2>
          <EmployeeTable
            employees={filteredEmployees}
            onDelete={handleDeleteEmployee}
          />
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
