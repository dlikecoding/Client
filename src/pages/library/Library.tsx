import Navbar from "../../components/navbar/Navbar";
import "../homepage/Home.css";

const Library = (props: any) => {
  return (
    <main class="mainHomePage currentActivePage">
      {props.children}
      <Navbar />
    </main>
  );
};

export default Library;
