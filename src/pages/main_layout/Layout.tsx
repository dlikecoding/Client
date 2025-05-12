import Footer from "./Footer";
const Layout = (props: any) => {
  return (
    <>
      <main class="mainHomePage">{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;
