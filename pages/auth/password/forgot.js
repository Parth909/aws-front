import { useState } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Router from "next/router";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot Password",
    success: "",
    error: "",
    disabled: false,
  });

  const { email, buttonText, success, error, disabled } = state;

  const handleChange = (e) => {
    setState({ ...state, success: "", error: "", email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API}/forgot-password`, { email });

      setState({
        ...state,
        email: "",
        buttonText: "Submitted",
        success: response.data.message,
        disabled: true,
      });
    } catch (error) {
      setState({ ...state, error: error.response.data.error });
    }
  };

  const passwordForgotForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            onChange={handleChange}
            value={email}
            placeholder="Type your email"
            required
            disabled={disabled}
          />
        </div>
        <div>
          <button
            disabled={disabled}
            className="btn btn-outline-info btn-block font-weight-bold"
          >
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
