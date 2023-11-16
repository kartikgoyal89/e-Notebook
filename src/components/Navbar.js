import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    let navigate = useNavigate();
    let location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/signin")
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">NoteBook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>
                        </ul>
                    </div>
                    {!localStorage.getItem('token') ? <form className="d-flex">
                        <Link type="button" to='/signin' className="btn text-light">Sign in</Link>
                        <Link type="button" to='/signup' className="btn btn-outline-light">Sign up</Link>
                    </form> : <button onClick={handleLogout} className='btn btn-outline-light'>Logout</button>}
                </div>
            </nav>

        </>
    )
}

export default Navbar
