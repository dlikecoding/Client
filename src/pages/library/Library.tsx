import { onMount } from "solid-js";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import FooterLibrary from "./FooterLibrary";
import { useNavigate } from "@solidjs/router";

const Library = (props: any) => {
  const navigate = useNavigate();
  const lastVisitLibrary = localStorage.getItem("library");

  onMount(() => {
    if (lastVisitLibrary) return navigate(JSON.parse(lastVisitLibrary).url, { replace: true });
  });

  return (
    <ManageURLContextProvider>
      {props.children}
      <FooterLibrary />
    </ManageURLContextProvider>
  );
};

export default Library;
