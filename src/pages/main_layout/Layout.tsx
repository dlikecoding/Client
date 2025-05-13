import { createMemo } from "solid-js";
import Footer from "./Footer";
import { useLocation, useNavigate } from "@solidjs/router";
const Layout = (props: any) => {
  // const location = useLocation();

  // const pageChange = createMemo(() => location.pathname.split("/")[1]);

  // createMemo(() => {
  //   const pa = localStorage.getItem(pageChange());
  //   console.log(pageChange(), pa);
  // });

  return (
    <>
      <main class="mainHomePage">{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;

// const location = useLocation();

// const pageChange = createMemo(() => location.pathname.split("/")[1]);

// createMemo(() => {
//   const pa = localStorage.getItem(pageChange());
//   console.log(pageChange(), pa?.toString());
//   // if (!pa) return;

//   // const lastVisit = JSON.parse(pa);
//   // console.log(pageChange(), lastVisit);
// });
