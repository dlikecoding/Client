import { ManageURLContextProvider } from "../../context/ManageUrl";

const ContextSearch = (props: any) => {
  return <ManageURLContextProvider>{props.children}</ManageURLContextProvider>;
};

export default ContextSearch;
