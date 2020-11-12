import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { getCookie, isAuth } from "../../../helpers/auth";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import withUser from "../../withUser";

const Update = ({ oldLink, token }) => {
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories, // catgories that the user has checked
    loadedCategories: [], // categories from the db
    success: "",
    error: "",
    type: oldLink.type,
    medium: oldLink.medium,
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    type,
    success,
    error,
    medium,
  } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // use update link based on logged in user
    let dynamicUrl;
    if (isAuth() && isAuth().role == "admin") {
      dynamicUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUrl = `${API}/link/${oldLink._id}`;
    }
    try {
      const response = await axios.put(
        dynamicUrl,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setState({
          ...state,
          success: "Link is updated",
        });
      }
    } catch (error) {
      console.log("error.response.data", error.response.data);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, success: "", error: "" });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, success: "", error: "" });
  };

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
      categories &&
      loadedCategories &&
      loadedCategories.map((cat, i) => (
        <li className="list-unstyled" key={cat._id}>
          <input
            type="checkbox"
            checked={categories.includes(cat._id)}
            onChange={handleToggle(cat._id)}
            className="mr-2"
          />
          <label className="form-check-label">{cat.name}</label>
        </li>
      ))
    );
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };

  //show types
  const showTypes = () => {
    return (
      <React.Fragment>
        <div className="form-check ml-3">
          <label className="form-check-label pl-3 ml-1">
            {/* In Normal inputs the e.target.value is dynamic & depends on what we type but */}
            {/* Here as nothing is being typed only clicked so we need to enter the value manually */}
            <input
              type="radio"
              onChange={handleTypeClick}
              checked={type === "free"}
              value="free"
              className="form-check-input"
              name="type"
            />
            Free
          </label>
        </div>
        <div className="form-check ml-3">
          <label className="form-check-label pl-3 ml-1">
            <input
              type="radio"
              onChange={handleTypeClick}
              checked={type === "paid"}
              value="paid"
              className="form-check-input"
              name="type"
            />
            Paid
          </label>
        </div>
      </React.Fragment>
    );
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };

  // show medium
  const showMedium = () => {
    return (
      <React.Fragment>
        <div className="form-check ml-3">
          <label className="form-check-label pl-3 ml-1">
            {/* In Normal inputs the e.target.value is dynamic & depends on what we type but */}
            {/* Here as nothing is being typed only clicked so we need to enter the value manually */}
            <input
              type="radio"
              onChange={handleMediumClick}
              checked={medium === "video"}
              value="video"
              className="form-check-input"
              name="medium"
            />
            Video
          </label>
        </div>
        <div className="form-check ml-3">
          <label className="form-check-label pl-3 ml-1">
            <input
              type="radio"
              onChange={handleMediumClick}
              checked={medium === "book"}
              value="book"
              className="form-check-input"
              name="medium"
            />
            Book
          </label>
        </div>
      </React.Fragment>
    );
  };

  // link create form
  const submitLinkForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={handleTitleChange}
            value={title}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Content Url</label>
          <input
            onChange={handleURLChange}
            value={url}
            type="url"
            className="form-control"
          />
        </div>
        <div>
          <button
            disabled={!token}
            className="btn btn-outline-info"
            type="submit"
          >
            {isAuth() || token ? "Update" : "Login to update"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Update Link :- </h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4">Category</label>
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Type</label>
            {showTypes()}
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Medium</label>
            {showMedium()}
          </div>
        </div>
        <div className="col-md-8">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
      {JSON.stringify(categories)}
      {JSON.stringify(type)}
      {JSON.stringify(medium)}
      Token:-{JSON.stringify(token)}
    </Layout>
  );
};

Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return {
    oldLink: response.data,
    token,
  };
};

export default withUser(Update);
