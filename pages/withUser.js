import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

const withUser = (Page) => {
  // static func
  const WithAuthUser = (props) => <Page {...props}></Page>;
  // see zzzzzzz.js
  // WithAuthUser.getTnitialProps is same as any Page.getInitialProps in that respective Page
  // generalizing this getInitialProps to apply to any Page passed in
  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = null;

    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        if (error.response.status === 400) {
          user = null;
        }
      }
    }

    if (user === null) {
      // redirect

      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}), // getInitialProps return an object & we are spreading that object
        user,
        token,
        userLinks,
      };
    }
  };

  return WithAuthUser;
};

export default withUser;
