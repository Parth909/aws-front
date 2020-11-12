const User = ({ user }) => {
  return <Layout>{JSON.stringify(user)}</Layout>;
};
// the returned things will be accessible as props
// USED FOR SSR - see HELP.md
User.getInitialProps = async (context) => {
  // with the help of getInitial.. we get access to context
  const token = getCookie("token", context.req);

  // as this is a protected route we need to send the header as well

  try {
    const response = await axios.get(`${API}/user`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      user: response.data,
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        user: "No User",
      };
    }
  }
};

// right - click -> view page source
// const User = () => {
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//     axios
//       .get("https://jsonplaceholder.typicode.com/todos")
//       .then((response) => setTodos(response.data));
//   }, []);

//   return <Layout>{JSON.stringify(todos)}</Layout>;
// };

// - arn:aws:iam::167640006345:user/Parth

// ============================================================================
// =================== CATEGORY IMAGE UPLOAD USING FORM DATA ==================
// ============================================================================

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import withAdmin from "../../withAdmin";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    formData: process.browser && new FormData(), // FormData is available from the browser API
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });

  const {
    name,
    content,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  // need to handle file as well - or you can handle files field differently
  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageName =
      name === "image" ? e.target.files[0].name : "Upload Image";

    formData.set(name, value);
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      imageUploadText: imageName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Creating ..." });

    try {
      const response = await axios.post(`${API}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({
        ...state,
        name: "",
        content: "",
        formData: "",
        buttonText: "Created",
        imageUploadText: "Upload Image",
        success: `${response.data.name} is created successfully`,
      });
    } catch (error) {
      setState({
        ...state,
        name: "",
        content: "",
        // formData: "", - don't make the formdata empty otherwise its functions won't work
        buttonText: "Try Again !",
        imageUploadText: "Upload Image",
        error: error.response.data.error,
      });
    }

    console.log(...formData);
  };

  const createCategoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange("name")}
            value={name}
            type="text"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Content</label>
          <textarea
            onChange={handleChange("content")}
            value={content}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label className="btn btn-outline-secondary">
            {imageUploadText}
            <input
              onChange={handleChange("image")}
              type="file"
              className="form-control"
              accept="image/*"
              required
              hidden
            />
          </label>
        </div>
        <div>
          <button className="btn btn-outline-info">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
