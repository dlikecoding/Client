import { onMount } from "solid-js";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import FooterLibrary from "./FooterLibrary";
import { useNavigate } from "@solidjs/router";

const Library = (props: any) => (
  <ManageURLContextProvider>
    {props.children}
    <FooterLibrary />
  </ManageURLContextProvider>
);

export default Library;
