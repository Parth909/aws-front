import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import { withRouter } from "next/router";
import Layout from "../../../components/Layout";

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate Account",
    success: "",
    error: "",
    disabled: false,
  });

  const { name, token, buttonText, success, error, disabled } = state;

  useEffect(() => {
    let token = router.query.id;
    console.log(token);

    if (token) {
      const data = jwt.decode(token); // decoding the token and getting the name only
      console.log(name);
      setState({ ...state, name: data.name, token });
    }
  }, [router]); // if router.query.id is present run this piece of code again

  const clickSubmit = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      buttonText: "Activating .... ",
    });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });

      setState({
        ...state,
        name: "",
        token: "",
        buttonText: "Activated Your Account",
        success: response.data.message,
        disabled: true,
      });
      console.log(response.data.message);
    } catch (error) {
      setState({
        ...state,
        buttonText: "Activate Your Account",
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>G'day {name}, Activate your account </h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            disabled={disabled}
            onClick={clickSubmit}
            className="btn btn-outline-info btn-block btn-lg font-weight-bold"
          >
            {buttonText}
          </button>
        </div>
      </div>
      {JSON.stringify(state)}
    </Layout>
  );
};

export default withRouter(ActivateAccount);
