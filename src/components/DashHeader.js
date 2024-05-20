import { Link } from "react-router-dom";

import React from 'react'

const DashHeader = () => {
  const content = (
    <header className="dash-header">
      <div className="dash-header__container">
        <Link to="/dash/notes">
            <h1 className="dash-header__title">Tech Notes</h1>
        </Link>

        <nav className="dash-header__nav">
        </nav>    
      </div>
    </header>
  )

  return content
}

export default DashHeader