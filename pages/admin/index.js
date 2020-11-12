import Layout from "../../components/Layout";
import Link from "next/link";
import withAdmin from "../withAdmin";
import { Fragment } from "react";

const Admin = ({ user, token, userLinks }) => {
  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <div></div>
      <br />
      <div className="row">
        <div className="col-md-4">
          {/* For some reason li wasn't working so need to cp the ul */}
          <ul className="nav flex-column">
            {/* React-Quill requires the page to reload in order to load their CSS */}
            {/* <Link > */}
            <a href="/admin/category/create">Create Category</a>
            {/* </Link> */}
            <li className="nav-item">
              <Link href="/admin/category/read">
                <a>Categories List</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/link/read">
                <a>All Links</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a>Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">Goood</div>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
