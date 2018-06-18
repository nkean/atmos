import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <div className="navbar">
    <div>
      <ul>
        <li>
          <Link to="/rooms">
            Rooms
          </Link>
        </li>
        <li>
          <Link to="/settings">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Nav;
