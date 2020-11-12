import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Link from "next/link";
import { API } from "../config";
import Moment from "moment";

const Home = ({ categories }) => {
  const [popular, setPopular] = useState([]);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  };

  useEffect(() => {
    loadPopular();
  }, []);

  // links related stuff ------
  const listOfLinks = () => {
    return (
      popular &&
      popular.map((link, i) => (
        <div
          className="row alert alert-info p-2"
          style={{ overflowWrap: "break-word" }}
        >
          <div className="col-md-8" onClick={(e) => handleClick(link._id)}>
            <a href={link?.url} target="_blank">
              <h5 className="pt-2">{link.title}</h5>
              <h6
                className="pt-2"
                style={{ fontSize: "12px" }}
                className="text-primary"
              >
                {link.url}
              </h6>
            </a>
          </div>
          <div className="col-md-4 pt-2">
            <span className="pull-right">
              {Moment(link.createdAt).fromNow()} by {link.postedBy.name}
            </span>
            <br />
          </div>

          <div className="col-md-12">
            <span className="badge text-dark">
              {link.type} / {link.medium}
            </span>
            {link.categories.map((cat, i) => (
              <span key={cat._id} className="badge text-danger">
                {cat.name}
              </span>
            ))}
            <span className="badge badge-secondary pull-right">
              {link.clicks} Clicks
            </span>
          </div>
        </div>
      ))
    );
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    console.log("Click count response", response);

    loadPopular();
  };

  // link related stuff end ------

  // map(()=>{ return() })    OR    map(()=>()) - directly return
  const listCategories = () => {
    return categories.map((cat, i) => (
      <Link href={`/link/${cat.slug}`} key={cat._id}>
        <a
          style={{ border: "1px solid #ececec" }}
          className="bg-light p-3 col-md-4"
        >
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={cat.image && cat.image?.url}
                  alt={cat.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
              <div className="col-md-8">
                <h4>{cat.name}</h4>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
      <div className="row pt-3">
        <h3 className="font-weight-normal pb-3">Trending</h3>
        <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async ({ context }) => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
