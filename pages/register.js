import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config"; // environment variable from next.config.js
import { isAuth } from "../helpers/auth"; // to check if user is present

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
    loadedCategories: [],
    categories: [], // sent these to the backend
  });

  useEffect(() => {
    const userPresent = isAuth();
    console.log(userPresent);
    userPresent && Router.push("/");
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;

  // handle multiple checkboxes
  const handleToggle = (catId) => (e) => {
    // return the found index or -1
    // if we get -1 add the category in the arr
    // if we found index remove the category from the arr
    const clickedCategoryId = categories.indexOf(catId);
    const all = [...categories];

    if (clickedCategoryId === -1) {
      all.push(catId);
    } else {
      all.splice(clickedCategoryId, 1);
    }

    setState({ ...state, categories: all, success: "", error: "" });
  };

  // show categories - checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((cat, i) => (
        <li className="list-unstyled" key={cat._id}>
          <input
            type="checkbox"
            onChange={handleToggle(cat._id)}
            className="mr-2"
          />
          <label className="form-check-label">{cat.name}</label>
        </li>
      ))
    );
  };

  // variable for object keys are written in this fashion
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Showing the word Registering ...
    // order of buttonText : *Register* - *Registering* - *Submitted*
    setState({ ...state, buttonText: "Registering ... " });

    try {
      // Basically In Async Await Any Promise Returning Function will be inside Try Catch Block
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories,
      });

      if (response) {
        setState({
          ...state,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
          success: response.data.message, // res.json({message:'Email has been ..... '})
        });
      }
    } catch (error) {
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   //Showing the word Registering ...
  //   // order of buttonText : *Register* - *Registering* - *Submitted*
  //   setState({ ...state, buttonText: "Registering ... " });

  //   axios
  //     .post(`http://localhost:8000/api/register`, {
  //       name,
  //       email,
  //       password,
  //     })
  //     .then((response) => {
  //       setState({
  //         ...state,
  //         name: "",
  //         email: "",
  //         password: "",
  //         buttonText: "Submitted",
  //         success: response.data.message, // res.json({message:'Email has been ..... '})
  //       });
  //     })
  //     .catch((error) => {
  //       setState({
  //         ...state,
  //         buttonText: "Register",
  //         error: error.response.data.error,
  //       });
  //     });
  // };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name"
          required
        />
      </div>
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
        <label className="text-muted ml-4">Categories</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
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
        <h1>Register</h1>
        <br />
        {registerForm()}
        <hr />
        {JSON.stringify(categories)}
      </div>
    </Layout>
  );
};

export default Register;
