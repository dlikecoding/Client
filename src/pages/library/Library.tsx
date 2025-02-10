import Navigate from "../Navigate";
import "../homepage/Home.css";

const Library = (props: any) => {
  return (
    <main class="mainHomePage currentActivePage">
      <h1>Library</h1>
      {props.children}
      <Navigate />
    </main>
  );
};

export default Library;
