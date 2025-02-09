import { A, useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import FooterCollection from "./collection/FooterCollection";
import FooterLibrary from "./library/FooterLibrary";

const TimeLine = () => {
  const location = useLocation();
  const currentPage = createMemo(() => location.pathname.split("/")[1]);
  return (
    <>
      TimeLine
      <nav>
        {currentPage() === "library" ? <FooterLibrary /> : <FooterCollection />}
        <li>
          <A href="/">Close</A>
        </li>
      </nav>
    </>
  );
};

export default TimeLine;
