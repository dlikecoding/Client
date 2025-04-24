import { createMemo, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

import Footer from "./Footer";
import AccountButton from "../../components/photoview/buttons/AccountButton";

// import { useAuthContext } from "../../context/AuthProvider";

const mainPages = new Map([
  ["/user/admin", "Dashboard"],
  ["/user", "Profile"],
  ["/", "Search"],
]);

const Home = (props: any) => {
  // Goto previous page if any:
  const location = useLocation();
  // const navigate = useNavigate();
  // const prevState = localStorage.getItem("LastVisited") || "";

  // onMount(() => {
  //   if (prevState && prevState !== "/") navigate(prevState);
  // });
  // createMemo(() => localStorage.setItem("LastVisited", location.pathname.toString()));

  return (
    <>
      <main class="mainHomePage">{props.children}</main>
      <Footer />
    </>
  );
};

export default Home;
