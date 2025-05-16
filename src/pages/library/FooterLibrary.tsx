import { A } from "@solidjs/router";
import { useManageURLContext } from "../../context/ManageUrl";
import { onMount } from "solid-js";

const FooterLibrary = () => {
  const { resetParams } = useManageURLContext();
  onMount(resetParams);

  return (
    <footer style={{ "z-index": 1, bottom: "90px" }} class="footer_nav">
      <div
        class="actions__toolbar__column is_middle"
        style={{ width: "270px", padding: "5px", "justify-content": "space-evenly" }}>
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
