import { useParams } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";

import { useMediaContext } from "../../../context/Medias";
import { useViewMediaContext } from "../../../context/ViewContext";
import { forUpdating } from "../../extents/request/fetching";

import { Favorite } from "./buttons/Favotire";
import { MoreAction } from "./buttons/MoreAction";
import { Share } from "./buttons/Share";
import { Recover } from "./buttons/Recover";
import { Unhide } from "./buttons/Unhide";
import { Delete } from "./buttons/Delete";
import { Merge } from "./buttons/Merge";
import { EditButtonIcon, InfoButtonIcon } from "../../svgIcons";

type ButtonConfig = {
  duplicate: string[];
  deleted: string[];
  hidden: string[];
  default: string[];
};

export const buttonConfig: ButtonConfig = {
  default: ["favorite", "share", "more", "delete"],
  deleted: ["recover", "permanentDelete"],
  hidden: ["unhide", "delete"],
  duplicate: ["merge", "delete"],
};

const ActionNav = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const params = useParams();

  const { openModal, displayMedias, setDisplayMedia } = useViewMediaContext();

  const actions = {
    share: () => console.log("Share clicked"),

    favorite: () => updateMediaStatus("Favorite"),

    hide: () => updateMediaStatus("Hidden", true),
    unhide: () => updateMediaStatus("Hidden", false),

    delete: () => updateMediaStatus("DeletedStatus", true),
    recovery: () => updateMediaStatus("DeletedStatus", false),

    merge: () => console.log("Merge Images"),
  };

  const updateMediaStatus = async (updateKey: "Favorite" | "Hidden" | "DeletedStatus", updateValue?: boolean) => {
    if (items().size < 1) return;
    const listOfIds = new Set(items().values());
    const listOfIndex = [...items().keys()];

    // Toggle the favorite status of all selected items:
    // If any item is NOT a favorite, set all to favorite; otherwise, set all to not favorite.
    if (updateKey === "Favorite") {
      const isNotFavorite: boolean = listOfIndex.some((index) => !displayMedias[index].isFavorite);
      updateValue = isNotFavorite;

      setDisplayMedia(listOfIndex, "isFavorite", isNotFavorite);
    } else {
      setDisplayMedia((prev) => prev.filter((item, _) => !listOfIds.has(item.media_id)));
    }

    setIsSelected(false);
    setItems(new Map());

    const res = await forUpdating([...listOfIds], updateKey, updateValue!);
    if (!res.ok) console.error(`Failed to update ${updateKey}:`, res);
  };

  // Get current pages: Album, Library, ...
  const currentPage = buttonConfig[params.pages as keyof ButtonConfig] || buttonConfig.default;

  // Disable all action buttons when there is no selected item
  const disableButtons = () => items().size < 1;
  return (
    <>
      <footer inert={disableButtons()} style={{ "z-index": 1 }} class={disableButtons() ? "footerDisabled" : ""}>
        <div class="actions__toolbar__column is_left">
          <Switch fallback={<Share action={actions.share} />}>
            <Match when={currentPage.includes("unhide")}>
              <Unhide action={actions.unhide} />
            </Match>
            <Match when={currentPage.includes("recover")}>
              <Recover action={actions.recovery} />
            </Match>
            <Match when={currentPage.includes("merge")}>
              <Merge action={actions.merge} />
            </Match>
          </Switch>
        </div>

        <div
          class="actions__toolbar__column is_middle"
          style={{ visibility: !currentPage.includes("favorite") && openModal() ? "hidden" : "visible" }}>
          {/* //////////////////////////////////////////////// */}
          <Show when={openModal()}>
            <button>{InfoButtonIcon()}</button>
            <button>{EditButtonIcon()}</button>
          </Show>

          <Show when={currentPage.includes("favorite")}>
            <Favorite action={actions.favorite} />
          </Show>

          <Show when={!openModal()}>
            <button title="item size" disabled={true}>
              {items().size}
            </button>
          </Show>

          <Show when={currentPage.includes("more") && !openModal()}>
            <MoreAction hide={actions.hide} />
          </Show>
        </div>

        <div class="actions__toolbar__column is_right">
          <Delete delete={actions.delete} isDeletePage={currentPage.includes("delete")} />
        </div>
      </footer>
    </>
  );
};

export default ActionNav;
