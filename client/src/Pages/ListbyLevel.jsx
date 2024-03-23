import React from "react";
import { useState, useEffect } from "react";

const ListbyLevel = () => {
  const [employeeLevel, setEmployeeLevel] = useState([]);

  useEffect((level) => {
    fetch(`/employees/level/:${level}`)
      .then((response) => response.json())
      //   .then((data) => console.log(data));
      .then((data) => setEmployeeLevel(data))
      .catch((error) => alert.error("Error with fetching superheroes", error));
  }, []);

  return (
    <div id="employeesByLevel">
      <h1>Employees by Level:</h1>
      <ul id="level">
        {employeeLevel.map((employee) => {
          return <li key={employee._id}>{employee.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default ListbyLevel;
