import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import axios from "axios";
import { API, APP_NAME } from "../../config";
import renderHTML from "react-render-html";
import Moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
// Head is especially good for SEO
import Head from "next/head";

// Implement the success & Error Messages later
const Links = ({
  query,
  category,
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
  const [noloadedLinks, setNoLoadedLinks] = useState(totalLinks);
  const [popular, setPopular] = useState([]);
  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const headFunction = () => {
    return (
      <Head>
        <title>
          {category.name} | {APP_NAME}
        </title>
        {/* content can have max 256 characters length*/}
        <meta
          name="description"
          content={stripHTML(category.content.substring(0, 160))}
        />
        <meta property="og:title" content={category.name} />
        {/* This page url */}
        <meta property="og:url" content={`${API}/link/${category.slug}`} />
        <meta
          name="description"
          content={stripHTML(category.content.substring(0, 250))}
        />
        <meta property="og:image:" content={category.image.url} />
        {/* For https */}
        <meta property="og:image:secure_url" content={category.image.url} />
      </Head>
    );
  };

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${query.slug}`);
    setPopular(response.data);
  };

  useEffect(() => {
    loadPopular();
  }, []);

  useEffect(() => {
    console.table({ allLinks, limit, skip, size, noloadedLinks });
  }, []);

  // ------- IMP GOOD SECTION OF LINKS (FOR INFINITE SCROLL & UPDATING CLICK COUNT)------------
  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    console.log("Click count response", response);

    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    let upLinks = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      limit: upLinks,
    });
    setAllLinks(response.data.links);

    loadPopular(); // for the sidebar
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
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {link.type} - {link.medium}
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
    ));
  };

  const loadMoreLinks = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    if (response) {
      console.log("all links", response.data.links);
      setAllLinks([...allLinks, ...response.data.links]);
      setNoLoadedLinks(allLinks.length); // updating the no of loaded links
      setSkip(toSkip); // updating the skip
    }
  };

  // -------------- IMP GOOD SECTION OF LINKS END ------------------

  // Sidebar links
  const listOfPopularLinks = () => {
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

  return (
    <Layout>
      <>
        {headFunction()}
        {allLinks.map((link) => (
          <div>{JSON.stringify(link)}</div>
        ))}
        <div className="row">
          <div className="col-md-8">
            <h2 className="display-4 font-weight-bold">
              {category.name} - Links
            </h2>
            <div className="lead alert alert-info pt-4">
              {renderHTML(category.content)}
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.name}
              style={{
                maxWidth: "400px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>

        <div className="row ">
          <div className="col-md-8">{listOfLinks()}</div>
          <div className="col-md-4 ">
            <h2 className="lead pt-3">Most Popular in {category.name}</h2>
            <div className="p-3">{listOfPopularLinks()}</div>
          </div>
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
      </>
    </Layout>
  );
};

// We can use withRouter which will make the *router* available as props and we can access the router.query.slug in the component

// OR

// can use getInitialProps as well for the
Links.getInitialProps = async (context) => {
  const { query, req } = context;

  let skip = 0;
  let limit = 2;

  // although we should make get request but making post request to send the skip & limit
  // or we can use the query
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });

  // whatever it return we can grab in the props
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    totalSize: response.data.noOfLinks,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
