import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import withAdmin from "../../withAdmin";

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });

  const { error, success, categories } = state;

  const loadCategories = async () => {
    console.log("load categories running");
    const response = await axios.get(`${API}/categories`);
    setState({
      ...state,
      categories: response.data,
    });
  };

  const confirmDelete = (e, slug) => {
    console.log("confirm delete running");
    // console.log("delete slug", slug);
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete ?");
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    console.log("handle delete running running");
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        loadCategories();
        console.log("setting the delete success message");
        setState({ ...state });
        // cannot set the success message bcz of some fucking weird thing
      }
    } catch (error) {
      setState({ ...state, error: error.response.data.error });
    }
  };

  const listCategories = () => {
    console.log("list categoreies running");
    return categories.map((cat, i) => (
      <div className="bg-light p-3 col-md-6" key={cat._id}>
        <Link href={`/link/${cat.slug}`}>
          <a
            style={{ border: "1px solid #ececec" }}
            className="bg-light p-3 col-md-4"
          >
            <div>
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={cat.image && cat.image?.url}
                    alt={cat.name}
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
                <div className="col-md-6">
                  <h4>{cat.name}</h4>
                </div>
                <div className="col-md-3">
                  <Link href={`/admin/category/${cat.slug}`}>
                    <button className="btn btn-outline-info btn-sm py-2 btn-block">
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={(e) => confirmDelete(e, cat.slug)}
                    className="btn btn-small btn-outline-danger btn-block"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>
    ));
  };

  useEffect(() => {
    console.log("use effect running");

    loadCategories();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          {JSON.stringify(success)}
          {JSON.stringify(error)}
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <h1>List Of Categories</h1>
          <br />
        </div>
      </div>

      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(Read);
