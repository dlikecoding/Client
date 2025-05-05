import { createMemo, lazy } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { SearchIcon, CollectionIcon, LibraryIcon, ServerIcon } from "../../components/svgIcons";

const Upload = lazy(() => import("../upload/Upload"));
const Setting = lazy(() => import("../setting/Setting"));

const Footer = () => {
  return (
    <footer class="footer_nav">
      <div class="actions__toolbar__column is_left">
        <Upload />
      </div>
      <div class="actions__toolbar__column is_middle">
        {LinkTag("library", LibraryIcon)}
        {LinkTag("collection", CollectionIcon)}
        {LinkTag("search", SearchIcon)}
      </div>
      <div class="actions__toolbar__column is_right">
        <button popovertarget="setting-contents">{ServerIcon()}</button>
        <div popover="auto" id="setting-contents" class="setting_contents">
          <Setting />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const LinkTag = (page: string, icon: any) => {
  const location = useLocation();

  const isActive = createMemo(() => location.pathname.startsWith(`/${page}`));
  return (
    <A href={`/${page}/`} class={`${isActive() ? "footerActive" : "footerInactive"}`}>
      {icon}
    </A>
  );
};
