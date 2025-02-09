import { A } from "@solidjs/router";

const FooterCollection = () => {
  return (
    <>
      <li>
        <A href="/collection/album">Albums</A>
      </li>
      <li>
        <A href="/collection/dataset">Objects</A>
      </li>
    </>
  );
};

export default FooterCollection;
