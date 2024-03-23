import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import "./Layout.css";

const Layout = () => {
  const [filterValue, setFilterValue] = useState("");

  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSubmit = () => {
    fetch(`/api/employees/level/${filterValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error with fetching employees:", error);
      });
  };

  return (
    <div className="Layout">
      <nav>
        <ul>
          <li className="grow">
            <Link to="/">Employees</Link>
          </li>
          <li>
            <label className="position/level-input">
              Position/Level to filter:
              <input type="text" value={filterValue} onChange={handleChange} />
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </label>
          </li>
          <li>
            <Link to="/create">
              <button type="button">Create Employee</button>
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
