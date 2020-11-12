import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config"; // environment variable from next.config.js
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
  const [state, setState] = useState({
    email: "parthbhoir979@gmail.com",
    password: "123456",
    error: "",
    success: "",
    buttonText: "Login",
  });

  useEffect(() => {
    const userPresent = isAuth();
    userPresent && Router.push("/");
  }, []);

  const { email, password, error, success, buttonText } = state;

  // variable for object keys are written in this fashion
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Showing the word Registering ...
    // order of buttonText : *Register* - *Registering* - *Submitted*
    setState({ ...state, buttonText: "Logging In ... " });

    try {
      // Basically In Async Await Any Promise Returning Function will be inside Try Catch Block
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });

      // data > token && user obj from the backend
      authenticate(response, () => {
        if (isAuth() && isAuth().role === "admin") Router.push(`/admin`);
        else Router.push(`/user`);
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
          required
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-info">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <div className="col-md-6 offset-md-3">
        <h1>Login</h1>
        <br />
        {loginForm()}
        <Link href="/auth/password/forgot">
          <a className="text text-danger">Forgot Password</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
