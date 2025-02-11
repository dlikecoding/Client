import { A, useLocation, useParams } from "@solidjs/router";
import FooterCollection from "../../pages/collection/FooterCollection";
import FooterLibrary from "../../pages/library/FooterLibrary";
import { CloseIcon, FilterIcon } from "../svg-icons";
import FilterNavBar from "./FilterNavBar";

const LIBRARY_PATH = "library";

const Navbar = () => {
  // Use to check the current page like Library or Collection to change NavBar accordingly
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];

  // Use to Enable filter button when user in photoView
  const params = useParams();

  return (
    <footer style={{ "z-index": 3 }}>
      <div class="actions__toolbar__column is_left">
        <button popovertarget="filter-timeline" disabled={!params.pages}>
          {FilterIcon()}
        </button>
        <FilterNavBar />
      </div>

      <div class="actions__toolbar__column is_middle">
        {currentPage === LIBRARY_PATH ? <FooterLibrary /> : <FooterCollection />}
      </div>

      <div class="actions__toolbar__column is_right">
        <A href="/">{CloseIcon()}</A>
      </div>
    </footer>
  );
};

export default Navbar;
