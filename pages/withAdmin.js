import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

const withAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props}></Page>;

  WithAdminUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = null;

    if (token) {
      try {
        const response = await axios.get(`${API}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        user = response.data.user;
        userLinks = response.data.links;
        console.log("Admin user", user);
      } catch (error) {
        console.log("Admin error", error.response.status);

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
      context.res.end(); // VVIMP
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}), // getInitialProps return an object & we are spreading that object
        user,
        token,
      };
    }
  };

  return WithAdminUser;
};

export default withAdmin;
