import { A } from "@solidjs/router";
import Upload from "../Upload";
import {
  CollectionIconPath,
  LibraryIconPath,
  SearchIconPath,
  SettingIconPath,
} from "../../assets/components/svg-icons";

const Footer = () => {
  return (
    <div class="footerMain">
      <div class="actions__toolbar__column is_left">{LinkTag("library", LibraryIconPath)}</div>
      <div class="actions__toolbar__column is_middle">
        {LinkTag("collection", CollectionIconPath)}
        {LinkTag("search", SearchIconPath)}
        <Upload />
      </div>
      <div class="actions__toolbar__column is_right">{LinkTag("setting", SettingIconPath)}</div>
    </div>
  );
};

export default Footer;

const LinkTag = (page: string, icon: any) => <A href={`/${page}/`}>{icon}</A>;
