import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
// by default the react-quill runs in client-side environment so when
// so at first when next js runs in the server side we will not be able to see our Rich text editor
// so we need to import react-quill dynamically
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// const ReactQuill = require("react-quill");
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import withAdmin from "../../withAdmin";
import "quill/dist/quill.bubble.css";

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    buttonText: "Update",
    imageUploadText: "Image",
    imagePreview: oldCategory.image.url,
    image: "",
  });
  const [content, setContent] = useState(oldCategory.content);

  const {
    name,
    success,
    error,
    buttonText,
    imageUploadText,
    image,
    imagePreview,
  } = state;

  // handle rich text editor content
  const handleContent = (e) => {
    console.log("React quill's event ---", e);
    setContent(e); // we will directly
    setState({ ...state, success: "", error: "" });
  };

  // handle normal inputs
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
  };

  // handle image
  const handleImage = (event) => {
    let imgName = "";
    if (event.target.files[0]) {
      console.log("file input is true", event.target.files[0]);
      imgName = event.target.files[0].name;

      // In this way we can use different size images for different purpose
      Resizer.imageFileResizer(
        event.target.files[0], // file to be resized
        300, // maxWidth in px of new img
        300, // maxHeight in px of new img
        "JPEG", // compressFormat of new img
        100, // quality
        0, // It is the degree of clockwise rotation to apply to uploaded image
        (uri) => {
          // Is the callBack function of the resized new image UR
          console.log(uri);
          setState({
            ...state,
            image: uri,
            success: "",
            error: "",
            imageUploadText: imgName,
          });
        },
        "base64" // Is the output type of the resized new image.
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Updating ..." });

    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(response.data.content);
      setState({
        ...state,
        name: response.data.name,
        buttonText: "Updated",
        imageUploadText: "Image",
        success: `${response.data.name} is updated successfully`,
        imagePreview: response.data.image.url,
        image: "",
      });
    } catch (error) {
      setState({
        ...state,
        // formData: "", - don't make the formdata empty otherwise its functions won't work
        buttonText: "Try Again !",
        imageUploadText: "Image",
        error: error.response.data.error,
      });
      setContent("");
    }
  };

  const updateCategoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange("name")}
            value={name}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Content</label>

          <ReactQuill
            value={content}
            onChange={handleContent}
            placeholder="Write your description"
            theme="bubble"
            className="pb-5 mb-3"
            style={{
              border: "1px solid #ababab",
              borderRadius: "5px",
              fontFamily: "monospace",
              fontSize: "50px !important",
            }}
          />
        </div>
        <div className="form-group">
          <label className="btn btn-outline-info">
            {imageUploadText}{" "}
            <span>
              {imagePreview && (
                <img src={imagePreview} alt="image" height="20" />
              )}
            </span>
            <input
              onChange={(e) => handleImage(e)}
              type="file"
              className="form-control"
              accept="image/*"
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
          <h1>Update Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {process.browser && updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

// can use withRouter
// OR
Update.getInitialProps = async (context) => {
  // token coming from withAdmin
  const { req, query, token } = context;
  const response = await axios.post(`${API}/category/${query.slug}`);
  return {
    oldCategory: response.data.category,
    token,
  };
};

export default withAdmin(Update);
