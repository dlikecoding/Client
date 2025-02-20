import { A } from "@solidjs/router";
import { useManageURLContext } from "../../context/ManageUrl";

const PageLibrary = () => {
  const { updatePage } = useManageURLContext();

  return (
    <>
      <A href="/library/" inactiveClass="inactive_button" activeClass="active_button">
        Year
      </A>
      <A
        onClick={() => {
          updatePage({ year: "0" });
        }}
        href="/library/month"
        inactiveClass="inactive_button"
        activeClass="active_button">
        Month
      </A>
      <A
        onClick={() => {
          updatePage({ year: "", month: "" });
        }}
        href="/library/all"
        inactiveClass="inactive_button"
        activeClass="active_button">
        All
      </A>
    </>
  );
};

export default PageLibrary;
