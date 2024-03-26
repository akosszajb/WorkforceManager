import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(employee?.firstName ?? "");
  const [middleName, setMiddleName] = useState(employee?.middleName ?? "");
  const [lastName, setLastName] = useState(employee?.lastName ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [selectedEquipments, setSelectedEquipments] = useState(
    employee && employee.equipment ? [employee.equipment.name] : []
  );
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await fetch("/api/equipments");
        if (!response.ok) {
          throw new Error("Failed to fetch equipments");
        }
        const data = await response.json();
        setEquipments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEquipments();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "/api/employees";
    let method = "POST";

    if (employee && employee._id) {
      endpoint = `/api/employees/${employee._id}`;
      method = "PATCH";
    }

    const newEmployee = {
      firstName,
      middleName,
      lastName,
      level,
      position,
      equipment: selectedEquipments.length > 0 ? selectedEquipments[0] : "",
    };

    console.log("Selected Equipments:", selectedEquipments);

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} employee data`
        );
      }

      if (method === "POST") {
        // Ha új alkalmazottat hozunk létre, akkor a válasz tartalmazza az új alkalmazottat,
        // amelyet a mentés után menthetünk a szülő komponensen keresztül.
        const createdEmployee = await response.json();
        onSave(createdEmployee);
      } else {
        // Ha frissítettük az alkalmazottat, akkor csak frissítsük a helyi állapotot,
        // nincs szükség további válasz feldolgozására.
        onSave(newEmployee);
      }
    } catch (error) {
      console.error(
        `Error ${method === "POST" ? "creating" : "updating"} employee:`,
        error
      );
    }
    navigate("/");
  };

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="firstName">First Name:</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          name="firstName"
          id="firstName"
        />
      </div>

      <div className="control">
        <label htmlFor="middleName">Middle Name:</label>
        <input
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          name="middleName"
          id="middleName"
        />
      </div>

      <div className="control">
        <label htmlFor="lastName">Last Name:</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          name="lastName"
          id="lastName"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name="position"
          id="position"
        />
      </div>

      <div className="control">
        <label htmlFor="equipments">Equipments:</label>
        <select
          multiple
          name="equipments"
          value={selectedEquipments}
          onChange={(e) =>
            setSelectedEquipments(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {equipments.map((equipment) => (
            <option key={equipment._id} value={equipment.name}>
              {equipment.name}
            </option>
          ))}
        </select>
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
