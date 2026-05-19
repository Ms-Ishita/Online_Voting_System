import React, { useState } from "react";
import { User, Lock, LogIn } from "lucide-react";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="login-wrapper">

  
      <style>{`
        .login-wrapper{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:#020617;
          font-family:sans-serif;
          color:#F8FAFC;
        }

        .login-card{
          width:380px;
          padding:40px;
          background:#0F172A80;
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:20px;
          box-shadow:0 0 40px rgba(59,130,246,0.08);
        }

        .login-title{
          font-size:24px;
          font-weight:700;
          margin-bottom:6px;
        }

        .login-sub{
          color:#94A3B8;
          font-size:14px;
          margin-bottom:25px;
        }

        .input-group{
          margin-bottom:18px;
        }

        .input-label{
          font-size:12px;
          text-transform:uppercase;
          color:#94A3B8;
          margin-bottom:6px;
          display:block;
        }

        .input-box{
          display:flex;
          align-items:center;
          gap:10px;
          background:#02061780;
          border:1px solid rgba(255,255,255,0.05);
          padding:12px;
          border-radius:12px;
          transition:0.3s;
        }

        .input-box:focus-within{
          border-color:#3B82F6;
          box-shadow:0 0 10px rgba(59,130,246,0.3);
        }

        .input-box input{
          background:transparent;
          border:none;
          outline:none;
          color:white;
          width:100%;
          font-size:14px;
        }

        .login-btn{
          width:100%;
          margin-top:10px;
          padding:12px;
          border:none;
          border-radius:12px;
          background:#3B82F6;
          color:white;
          font-weight:600;
          cursor:pointer;
          transition:0.3s;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:8px;
        }

        .login-btn:hover{
          background:#2563EB;
          transform:translateY(-1px);
        }

        .bottom-text{
          margin-top:20px;
          text-align:center;
          font-size:14px;
          color:#94A3B8;
        }

        .bottom-text span{
          color:#3B82F6;
          cursor:pointer;
          font-weight:600;
        }

        @media(max-width:450px){
          .login-card{
            width:90%;
            padding:30px;
          }
        }
      `}</style>

      {/* LOGIN CARD */}
      <div className="login-card">

        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-sub">Login to access Voting Dashboard</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-box">
              <User size={18}/>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-box">
              <Lock size={18}/>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="login-btn">
            <LogIn size={18}/>
            Login
          </button>

        </form>

        <p className="bottom-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
};

export default Login;