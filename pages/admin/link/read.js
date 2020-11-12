import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import axios from "axios";
import { API } from "../../../config";
import renderHTML from "react-render-html";
import Moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import withAdmin from "../../withAdmin";
import { getCookie } from "../../../helpers/auth";

// Implement the success & Error Messages later
const Read = ({
  token,
  links,
  totalLinks,
  totalSize,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit); // used to set the updated links
  const [skip, setSkip] = useState(linkSkip); // used to set the updated links
  const [size, setSize] = useState(totalSize);
  const [noloadedLinks, setNoLoadedLinks] = useState(totalLinks); // no of loaded links

  const [state, setState] = useState({
    error: "",
    success: "",
  });

  useEffect(() => {
    console.table({ allLinks, limit, skip, size, noloadedLinks });
  }, []);

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    console.log("Click count response", response);

    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    let upLinks = skip + limit;
    const response = await axios.post(
      `${API}/links`,
      {
        limit: upLinks,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllLinks(response.data.links);
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
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        loadUpdatedLinks();
        console.log("setting the delete success message");
        setState({ ...state, success: "Link deleted successfully" });
        // cannot set the success message bcz of some fucking weird thing
      }
    } catch (error) {
      setState({ ...state, error: error.response.data.error });
    }
  };

  const listOfLinks = () => {
    return allLinks.map((link, i) => (
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
          <span
            onClick={(e) => confirmDelete(e, link._id)}
            className="badge mx-2 text-white pull-right btn btn-sm btn-danger"
          >
            Delete
          </span>

          <Link href={`/user/link/${link._id}`}>
            <span className="badge mx-2 text-white pull-right btn btn-sm btn-info">
              Update
            </span>
          </Link>
        </div>
      </div>
    ));
  };

  const loadMoreLinks = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(
      `${API}/links`,
      {
        skip: toSkip,
        limit,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      console.log("all links", response.data.links);
      setAllLinks([...allLinks, ...response.data.links]);
      setNoLoadedLinks(allLinks.length); // updating the no of loaded links
      setSkip(toSkip); // updating the skip
    }
  };

  // const loadMoreButton = () => {
  //   return (
  //     noloadedLinks > 0 &&
  //     noloadedLinks < size && (
  //       <button onClick={loadMoreLinks} className="btn btn-outline-info btn-lg">
  //         Load More
  //       </button>
  //     )
  //   );
  // };

  return (
    <Layout>
      {allLinks.map((link) => (
        <div>{JSON.stringify(link)}</div>
      ))}
      <div className="row">
        <div className="col-md-8">
          <h2 className="display-4 font-weight-bold">All Links</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">{listOfLinks()}</div>
        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
      </div>

      <div className="row">
        <div className="col-md-12 text-center">
          {/* Just added the loadMore & hasMore  */}
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreLinks}
            hasMore={noloadedLinks > 0 && noloadedLinks < size}
            loader={
              <img src="/static/images/Blue_Transp_bg.gif" alt="Loading..." />
            }
          >
            {/* You can put it here or put it in the normal position */}
            {/* <div className="col-md-8">{listOfLinks()}</div> */}
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

// We can use withRouter which will make the *router* available as props and we can access the router.query.slug in the component

// OR

// can use getInitialProps as well for the
Read.getInitialProps = async (context) => {
  // withAdmin is not giving the token
  const { query, req } = context;

  let skip = 0;
  let limit = 2;
  const token = getCookie("token", req);
  // although we should make get request but making post request to send the skip & limit
  // or we can use the query
  const response = await axios.post(
    `${API}/links`,
    {
      skip,
      limit,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // whatever it return we can grab in the props
  return {
    token,
    links: response.data.links,
    totalLinks: response.data.links.length,
    totalSize: response.data.noOfLinks,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default withAdmin(Read);
