import React from "react";
import { useState, useEffect } from "react";

const ListbyPosition = () => {
  const [employeePosition, setEmployeePosition] = useState([]);

  useEffect((position) => {
    fetch(`/employees/position/:${position}`)
      .then((response) => response.json())
      //   .then((data) => console.log(data));
      .then((data) => setEmployeePosition(data))
      .catch((error) => alert.error("Error with fetching superheroes", error));
  }, []);

  return (
    <div id="employeesByPosition">
      <h1>Employees by Position:</h1>
      <ul id="position">
        {employeePosition.map((employee) => {
          return <li key={employee._id}>{employee.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default ListbyPosition;
