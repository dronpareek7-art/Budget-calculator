import React, { useState } from "react";
import { auth } from "../firebase";
import "./Login.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { GiWallet } from "react-icons/gi";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      alert("Please fill all fields");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(cred.user, { displayName: name });
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    email &&
    password &&
    (isLogin || (name && confirmPassword && password === confirmPassword));

  return (
    <div className="auth-container">
      <div className="auth-box">

        <div className="auth-header">
          <GiWallet className="auth-logo" />
          <h2>Budget Tracker</h2>
        </div>{" "}
        
        <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="auth-sub">
          {isLogin
            ? "Sign in to your budget tracker"
            : "Start tracking your finances"}
        </p>
        {!isLogin && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button onClick={handleAuth} disabled={!canSubmit || loading}>
          {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
        </button>
        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? (
            <>
              Don't have an account? <span>Sign up</span>
            </>
          ) : (
            <>
              Already have an account? <span>Sign in</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
