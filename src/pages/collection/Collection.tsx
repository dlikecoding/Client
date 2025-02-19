import { Portal } from "solid-js/web";
import Navbar from "../../components/navbar/Navbar";
import { ManageURLContextProvider } from "../../context/ManageUrl";

const Collection = (props: any) => {
  return (
    <ManageURLContextProvider>
      <Portal>
        <main class="mainHomePage currentActivePage">
          {props.children}
          <Navbar />
        </main>
      </Portal>
    </ManageURLContextProvider>
  );
};

export default Collection;
