import React from 'react'
import { useState } from 'react'
import { useSelector } from "react-redux";

const AdminSignUp = () => {
    const [adminAddress, setAdminAddress] = useState("");
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [emailId , setEmailId] = useState("");
    const [password , setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
       
          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">Login in?</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default AdminSignUp