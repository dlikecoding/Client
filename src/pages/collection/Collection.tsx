import { useNavigate } from "@solidjs/router";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { onMount } from "solid-js";

const Collection = (props: any) => {
  const navigate = useNavigate();
  const lastVisitLibrary = localStorage.getItem("collection");

  onMount(() => {
    if (lastVisitLibrary) return navigate(JSON.parse(lastVisitLibrary).url, { replace: true });
  });
  return <ManageURLContextProvider>{props.children}</ManageURLContextProvider>;
};

export default Collection;
