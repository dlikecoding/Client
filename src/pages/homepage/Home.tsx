import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useLocation } from "@solidjs/router";

import Footer from "./Footer";
import AccountButton from "../../components/photoview/buttons/AccountButton";
import Loading from "../../components/extents/Loading";

// import { useAuthContext } from "../../context/AuthProvider";

const mainPages = new Map([
  ["/user/admin", "Dashboard"],
  ["/user", "Profile"],
  ["/", "Photos"],
]);

const Home = (props: any) => {
  // Goto previous page if any:
  const location = useLocation();

  // const { loggedUser } = useAuthContext();
  // console.log(loggedUser.userEmail);

  // const navigate = useNavigate();
  // const prevState = localStorage.getItem("LastVisited") || "";

  // onMount(() => {
  //   if (prevState && prevState !== "/") navigate(prevState);
  // });
  createMemo(() => localStorage.setItem("LastVisited", location.pathname.toString()));

  // Create search items for media
  const [pageNumber, setPageNumber] = createSignal(0);
  const loadedMedias: any[] | undefined = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <>
      <main class="mainHomePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>{mainPages.get(location.pathname)}</h1>
          </div>
          <div class="buttonContainer">
            <AccountButton />
          </div>
        </header>
        {props.children}
      </main>

      <Footer />
    </>
  );
};

export default Home;
