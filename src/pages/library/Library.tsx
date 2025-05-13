import { ManageURLContextProvider } from "../../context/ManageUrl";
import FooterLibrary from "./FooterLibrary";

const Library = (props: any) => (
  <ManageURLContextProvider>
    {props.children}
    <FooterLibrary />
  </ManageURLContextProvider>
);

export default Library;
