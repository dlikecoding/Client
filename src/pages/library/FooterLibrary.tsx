import { A } from "@solidjs/router";

const FooterLibrary = () => {
  return (
    <>
      <li>
        <A href="/library">Year</A>
      </li>
      <li>
        <A href="/library/month">Month</A>
      </li>
      <li>
        <A href="/library/view">View</A>
      </li>
    </>
  );
};

export default FooterLibrary;
