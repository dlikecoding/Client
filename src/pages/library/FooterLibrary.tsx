import { A } from "@solidjs/router";
import { useManageURLContext } from "../../context/ManageUrl";

const FooterLibrary = () => {
  const { resetParams } = useManageURLContext();

  return (
    <footer style={{ "z-index": 1, bottom: "90px" }} id="navigationBar">
      <div class="actions__toolbar__column is_middle" style={{ width: "45%", padding: "5px" }}>
        <A href="/library/" inactiveClass="inactive_button" activeClass="active_button">
          Years
        </A>
        <A href="/library/month" inactiveClass="inactive_button" activeClass="active_button">
          Months
        </A>
        <A
          href="/library/all"
          inactiveClass="inactive_button"
          activeClass="active_button"
          onClick={() => resetParams()}>
          All Photos
        </A>
      </div>
    </footer>
  );
};

export default FooterLibrary;
