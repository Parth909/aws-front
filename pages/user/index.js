import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import Moment from "moment";
import Router from "next/router";

const User = ({ user, token, userLinks }) => {
  const json = () => {
    return (
      <div>
        <div>{JSON.stringify(user, undefined, 4)}</div>
        <div>{JSON.stringify(token, undefined, 4)}</div>
        <div>{JSON.stringify(userLinks, undefined, 4)}</div>
      </div>
    );
  };

  const confirmDelete = (e, id) => {
    console.log("confirm delete running");
    // console.log("delete slug", slug);
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete ?");
    if (answer) {
      handleDelete(id);
    }
  };
  const handleDelete = async (id) => {
    console.log("handle delete running running");
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        console.log("setting the delete success message");
        Router.replace("/user");
      }
    } catch (error) {
      console.log(error);
      // setState({ ...state, error: error.response.data.error });
    }
  };

  const listOfLinks = () => {
    return userLinks.map((link, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8">
          {/* Can't use Link as this links will not be within the app */}
          <a href={link.url} target="_blank">
            <h5 className="pt-2">{link.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {link.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {Moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {link.type} / {link.medium}
          </span>
          {link.categories.map((c, i) => (
            <span key={i} className="badge text-info">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary">{link.clicks} clicks</span>

          <span
            onClick={(e) => confirmDelete(e, link._id)}
            className="badge text-white pull-right btn btn-sm btn-danger"
          >
            Delete
          </span>

          <Link href={`/user/link/${link._id}`}>
            <span className="badge  text-white pull-right btn btn-sm btn-info">
              Update
            </span>
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <Layout>
      <h1>
        {user.name}'s dashboard{" "}
        <span className="text-danger">/{user.role}</span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item text-dark">
              <Link href={`${API}/user/link/create`}>
                <a className="nav-link">Submit a link</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href={`${API}/user/profile/update`}>
                <a className="nav-link">Update Profile</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a>Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your Links</h2>
          <br />
          {listOfLinks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
