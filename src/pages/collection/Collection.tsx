import Navbar from "../../components/navbar/Navbar";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { MediaContextProvider } from "../../context/Medias";

const Collection = (props: any) => {
  return (
    <ManageURLContextProvider>
      <MediaContextProvider>
        <main class="mainHomePage currentActivePage">
          {props.children}
          <Navbar />
        </main>
      </MediaContextProvider>
    </ManageURLContextProvider>
  );
};

export default Collection;
