import { A, useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import FooterCollection from "../pages/collection/FooterCollection";
import FooterLibrary from "../pages/library/FooterLibrary";
import { CloseIcon, FilterIcon } from "../components/svg-icons";

const LIBRARY_PATH = "library";

const Navigate = () => {
  const location = useLocation();
  const currentPage = createMemo(() => location.pathname.split("/")[1]);
  return (
    <div class="footerMain" style={{ "z-index": 3 }}>
      <div class="actions__toolbar__column is_left">
        <button popovertarget="filter-timeline" disabled={true}>
          {FilterIcon()}
        </button>
        {/* <FilterTimeline /> */}
      </div>

      <div class="actions__toolbar__column is_middle">
        {currentPage() === "library" ? <FooterLibrary /> : <FooterCollection />}
      </div>

      <div class="actions__toolbar__column is_right">
        <A href="/">{CloseIcon()}</A>
      </div>
    </div>
  );
};

export default Navigate;
