import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const updateEmployee = (employee) => {
  return fetch(`/api/employees/${employee._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const fetchEmployee = (id) => {
  return fetch(`/api/employees/${id}`).then((res) => res.json());
};

const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);

  useEffect(() => {
    setEmployeeLoading(true);
    fetchEmployee(id).then((employee) => {
      setEmployee(employee);
      setEmployeeLoading(false);
    });
  }, [id]);

  const handleUpdateEmployee = async (employee) => {
    setUpdateLoading(true);
    let updateSuccessful = false;
    try {
      // Alkalmazott frissítése
      const response = await fetch(`/api/employees/${employee._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      if (response.ok) {
        updateSuccessful = true;
      } else {
        console.error("Failed to update employee data");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setUpdateLoading(false);
      navigate("/"); // Visszanavigálás a főoldalra
      if (updateSuccessful) {
        // Frissítés sikeres üzenet megjelenítése
        console.log("Employee data updated successfully");
      } else {
        // Frissítés sikertelen üzenet megjelenítése
        console.error("Failed to update employee data");
      }
    }
  };

  if (employeeLoading) {
    return <Loading />;
  }

  return (
    <EmployeeForm
      employee={employee}
      onSave={handleUpdateEmployee}
      disabled={updateLoading}
      onCancel={() => navigate("/")}
    />
  );
};

export default EmployeeUpdater;
