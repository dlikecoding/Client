import { ManageURLContextProvider } from "../../context/ManageUrl";

const ContextSearch = (props: any) => <ManageURLContextProvider>{props.children}</ManageURLContextProvider>;

export default ContextSearch;
