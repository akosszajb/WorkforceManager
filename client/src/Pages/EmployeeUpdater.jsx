import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

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
      const response = await fetch(`/api/employees/${id}`, {
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
      navigate("/");
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
