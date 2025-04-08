import { Link } from "react-router-dom";
import "./MissingEmployeeTable.css";

const MissingEmployeeTable = ({ employees, onDelete }) => (
  <div className="MissingEmployeeTable">
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Level</th>
          <th>Position</th>
          <th>Present </th>
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
            <td>
              <input type="checkbox" checked={employee.present} readOnly />
            </td>
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

export default MissingEmployeeTable;
