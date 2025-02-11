import Navbar from "../../components/navbar/Navbar";

const Collection = (props: any) => {
  return (
    <main class="mainHomePage currentActivePage">
      {props.children}
      <Navbar />
    </main>
  );
};

export default Collection;
