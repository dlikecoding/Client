import { createMemo, lazy } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { SearchIcon, CollectionIcon, LibraryIcon, ServerIcon } from "../../components/svgIcons";

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

/*
import { createMemo, JSX, lazy } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { SearchIcon, CollectionIcon, LibraryIcon, ServerIcon } from "../../components/svgIcons";

const Upload = lazy(() => import("../upload/Upload"));
const Setting = lazy(() => import("../setting/Setting"));

const Footer = () => {
  const location = useLocation();

  const isActive = (page: string) => createMemo(() => location.pathname.startsWith(`/${page}/`));

  return (
    <footer>
      <div class="actions__toolbar__column is_left">
        <LinkTag page="library" icon={LibraryIcon()} isActive={isActive("library")} />
      </div>
      <div class="actions__toolbar__column is_middle">
        <LinkTag page="collection" icon={CollectionIcon()} isActive={isActive("collection")} />
        <LinkTag page="search" icon={SearchIcon()} isActive={isActive("search")} />
        <Upload />
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

interface LinkTagProps {
  page: string;
  icon: JSX.Element;
  isActive: () => boolean;
}

const LinkTag = ({ page, icon, isActive }: LinkTagProps) => {
  return (
    <A href={`/${page}/`} class={isActive() ? "footerActive" : "footerInactive"}>
      {icon}
    </A>
  );
};

*/
