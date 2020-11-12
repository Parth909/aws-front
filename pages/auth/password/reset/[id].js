import { useState, useEffect } from "react";
import axios from "axios";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alerts";
import { API } from "../../../../config";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";

const ResetPassword = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
    disabled: false,
  });

  const {
    name,
    token,
    newPassword,
    buttonText,
    success,
    error,
    disabled,
  } = state;

  useEffect(() => {
    console.log(router);
    // decode doesn't require any SECRET
    const decoded = jwt.decode(router.query.id);

    if (decoded) {
      setState({ ...state, name: decoded.name, token: router.query.id });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, success: "", error: "", newPassword: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      buttonText: "Sending ....",
    });

    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });

      setState({
        ...state,
        newPassword: "",
        buttonText: "Submitted",
        success: response.data.message,
        disabled: true,
      });
    } catch (error) {
      setState({ ...state, error: error.response.data.error });
    }
  };

  const passwordResetForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange}
            value={newPassword}
            placeholder="Type your password"
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
          <h1>Hi {name}, Reset your password</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
          <br />
          <Link href="/auth/password/forgot">
            <a className="text text-danger">Link not working! Try again</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
// this makes the router props available
