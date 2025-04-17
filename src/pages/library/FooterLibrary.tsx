import { A } from "@solidjs/router";
import { useManageURLContext } from "../../context/ManageUrl";

const FooterLibrary = () => {
  const { resetParams } = useManageURLContext();

  return (
    <>
      <A href="/library/" inactiveClass="inactive_button" activeClass="active_button">
        Year
      </A>
      <A href="/library/month" inactiveClass="inactive_button" activeClass="active_button">
        Month
      </A>
      <A href="/library/all" inactiveClass="inactive_button" activeClass="active_button" onClick={() => resetParams()}>
        All
      </A>
    </>
  );
};

export default FooterLibrary;
