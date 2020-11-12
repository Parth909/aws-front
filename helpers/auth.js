import cookie from "js-cookie";
import Router from "next/router";

// Set In Cookie
export const setCookie = (key, value) => {
  // In nextjs can check if in the browser or server
  if (process.browser) {
    // process.server  server
    cookie.set(key, value, {
      expires: 7, // will expire in 7 days
    });
  }
};

// Remove From Cookie
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

// Get from cookie such as storage token
// will be useful when we need to make request to server with auth token
export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  // console.log("req.headers", req.headers);
  // console.log("req.headers.cookie --", req.headers.cookie);
  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));

  if (!token) {
    return undefined;
  }

  let tokenValue = token.split("=")[1];
  console.log("Get cookie from server", tokenValue);
  return tokenValue;
};

// Set in localstorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    // things are stored in localstorage as json data
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove from localstorage
export const removeLocalStorage = (key, value) => {
  if (process.browser) {
    return localStorage.removeItem(key);
  }
};

// Authenticate user by passing data to cookie and localstorageduring signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next(); // next will act like a callback function - see *login.js*
};

// access user info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    console.log("Cookie checked", cookieChecked);

    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user")); // converting JSON data to javascript
      } else {
        return false;
      }
    }
  }
};

// update the user in local storage when info updated
export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = user;
      localStorage.setItem("user", JSON.stringify(auth));
      next();
      // next refers to some callback *function* where this method is actually used
    }
  }
};

//logout
export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};
