import Navbar from "../../components/navbar/Navbar";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { MediaContext } from "../../context/Medias";

const Collection = (props: any) => {
  return (
    <ManageURLContextProvider>
      <MediaContext>
        <main class="mainHomePage currentActivePage">
          {props.children}
          <Navbar />
        </main>
      </MediaContext>
    </ManageURLContextProvider>
  );
};

export default Collection;
