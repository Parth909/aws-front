// React is available globally
// But to use its Properties like Fragment, useState and so on IMPORT statement is required
import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <Head>
      {/* Required meta tags  */}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      ></meta>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/css/styles.css" />
    </Head>
  );
  const divstyle = {
    display: "flex",
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-info">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link custom-white">Home</a>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/user/link/create">
          <a className="nav-link custom-white">Submit a link</a>
        </Link>
      </li>

      {!isAuth() && (
        <div style={divstyle}>
          <div className="nav-item inline">
            <Link href="/login">
              <a className="nav-link inline custom-white">Login</a>
            </Link>
          </div>
          <div className="nav-item inline">
            <Link href="/register">
              <a className="nav-link inline custom-white">Register</a>
            </Link>
          </div>
        </div>
      )}

      {/* It is isAuth() && not isAuth - which will give terrible error */}
      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin">
            <a className="nav-link custom-white">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto">
          <Link href="/user">
            <a className="nav-link custom-white">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link custom-white">
            Logout
          </a>
        </li>
      )}
    </ul>
  );

  return (
    <React.Fragment>
      {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
