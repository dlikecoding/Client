import { lazy } from "solid-js";
import { A } from "@solidjs/router";

import { SearchIcon, CollectionIcon, LibraryIcon, SettingIcon } from "../../components/svgIcons";

const Upload = lazy(() => import("../upload/Upload"));
const Setting = lazy(() => import("../setting/Setting"));

const Footer = () => {
  return (
    <footer>
      <div class="actions__toolbar__column is_left">{LinkTag("library", LibraryIcon)}</div>
      <div class="actions__toolbar__column is_middle">
        {LinkTag("collection", CollectionIcon)}
        {LinkTag("search", SearchIcon)}
        <Upload />
      </div>
      <div class="actions__toolbar__column is_right">
        <button popovertarget="setting-contents">{SettingIcon()}</button>
        <div popover="auto" id="setting-contents" class="setting_contents">
          <Setting />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const LinkTag = (page: string, icon: any) =>
  page === "search" ? <A href="/">{icon}</A> : <A href={`/${page}/`}>{icon}</A>;
