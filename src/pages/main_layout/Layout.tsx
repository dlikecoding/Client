import Footer from "./Footer";
const Layout = (props: any) => {
  // const location = useLocation();

  // const pageChange = createMemo(() => location.pathname.split("/")[1]);

  // createMemo(() => {
  //   const pa = localStorage.getItem(pageChange());
  //   console.log(pageChange(), pa);
  // });

  return (
    <>
      {props.children}
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
