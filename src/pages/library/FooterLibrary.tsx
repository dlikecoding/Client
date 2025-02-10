import { A } from "@solidjs/router";

const FooterLibrary = () => {
  return (
    <>
      <A href="/library/" inactiveClass="inactive_button" activeClass="active_button">
        Year
      </A>
      <A href="/library/month" inactiveClass="inactive_button" activeClass="active_button">
        Month
      </A>
      <A href="/library/all" inactiveClass="inactive_button" activeClass="active_button">
        All
      </A>
    </>
  );
};

export default FooterLibrary;
