import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="/">The Employee Madness Project</Link>
        </li>
        <li>
          <Link to="/">
            <button type="button">Employee Page</button>
          </Link>
        </li>
        <li>
          <Link to="/create">
            <button type="button">Create New Employee</button>
          </Link>
        </li>
        <li>
          <Link to="/missingemployees">
            <button type="button">Show Missing Employess</button>
          </Link>
        </li>
        <li>
          <Link to="/equipment">
            <button type="button">Equipment Page</button>
          </Link>
        </li>
        <li>
          <Link to="/equipmentcreator">
            <button type="button">Create New Equipment</button>
          </Link>
        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
