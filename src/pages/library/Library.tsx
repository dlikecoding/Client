import { Portal } from "solid-js/web";
import Navbar from "../../components/navbar/Navbar";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { MediaContextProvider } from "../../context/Medias";
import "../homepage/Home.css";

const Library = (props: any) => {
  return (
    <ManageURLContextProvider>
      <MediaContextProvider>
        <Portal>
          <main class="mainHomePage currentActivePage">
            {props.children}
            <Navbar />
          </main>
        </Portal>
      </MediaContextProvider>
    </ManageURLContextProvider>
  );
};

export default Library;
