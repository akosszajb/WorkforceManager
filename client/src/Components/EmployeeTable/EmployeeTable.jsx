import { Link } from "react-router-dom";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees, onDelete, handlePresentToggle }) => {
  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Level</th>
            <th>Position</th>
            <th>Favourite Brand</th>
            <th>Present </th>
            <th>Equipment assigned to employee</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.firstName}</td>
              <td>{employee.middleName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>{employee.favBrand.name}</td>

              <td>
                <input
                  type="checkbox"
                  onChange={() =>
                    handlePresentToggle(employee._id, !employee.present)
                  }
                  checked={employee.present}
                />
              </td>
              <td>{employee.equipment}</td>
              <td>
                <Link to={`/employee/update/${employee._id}`}>
                  <button type="button">Update</button>
                </Link>

                <button type="button" onClick={() => onDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
