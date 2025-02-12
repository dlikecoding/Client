import Navbar from "../../components/navbar/Navbar";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { MediaContext } from "../../context/Medias";
import "../homepage/Home.css";

const Library = (props: any) => {
  return (
    <ManageURLContextProvider>
      <MediaContext>
        <main class="mainHomePage currentActivePage">{props.children}</main>
        <Navbar />
      </MediaContext>
    </ManageURLContextProvider>
  );
};

export default Library;
