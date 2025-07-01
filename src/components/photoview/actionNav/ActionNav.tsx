import { useParams } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";

import { useMediaContext } from "../../../context/Medias";
import { useViewMediaContext } from "../../../context/ViewContext";
import { forUpdating } from "../../extents/request/fetching";

import { Favorite } from "./buttons/Favotire";
import { MoreAction } from "./buttons/MoreAction";
import { Save } from "./buttons/Save";
import { Recover } from "./buttons/Recover";
import { Unhide } from "./buttons/Unhide";
import { Delete } from "./buttons/Delete";

import { EditButtonIcon } from "../../svgIcons";
import { Info } from "./buttons/Info";
import { DeleteAll } from "./buttons/DeleteAll";
import { MergeAll } from "./buttons/MergeAll";

export type ButtonProps = {
  action: () => void;
};

type ButtonConfig = {
  duplicate: string[];
  deleted: string[];
  hidden: string[];
  default: string[];
};

type UpdateKey = "favorite" | "hidden" | "deleted";

const buttonConfig = (isModalOpen: boolean): ButtonConfig => ({
  default: isModalOpen
    ? ["save", "favorite", "info", "edit", "delete"]
    : ["save", "favorite", "count", "more", "delete"],
  deleted: isModalOpen ? ["recover", "permanentDelete"] : ["recover", "count", "permanentDelete", "permanentDeleteAll"],
  hidden: isModalOpen ? ["unhide", "delete"] : ["unhide", "count", "delete"],
  duplicate: isModalOpen ? ["permanentDelete"] : ["mergeAll", "count", "permanentDelete"],
});

const ActionNav = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const params = useParams();

  const { openModal, setIsEditing, displayMedias, setDisplayMedia } = useViewMediaContext();

  const actions = {
    delete: () => updateMediaStatus("deleted", true),
    recovery: () => updateMediaStatus("deleted", false),
    favorite: () => updateMediaStatus("favorite"),
    hide: () => updateMediaStatus("hidden", true),
    unhide: () => updateMediaStatus("hidden", false),
  };

  const updateMediaStatus = async (updateKey: UpdateKey, updateValue?: boolean) => {
    if (items().size < 1) return;
    const listOfIds = new Set(items().values());
    const listOfIndex = [...items().keys()];

    // Toggle the favorite status of all selected items:
    // If any item is NOT a favorite, set all to favorite; otherwise, set all to not favorite.
    if (updateKey === "favorite") {
      const isNotFavorite: boolean = listOfIndex.some((index) => !displayMedias[index].favorite);
      updateValue = isNotFavorite;

      setDisplayMedia(listOfIndex, "favorite", isNotFavorite);
    } else {
      setDisplayMedia((prev) => prev.filter((item, _) => !listOfIds.has(item.media_id)));
    }

    const res = await forUpdating([...listOfIds], updateKey, updateValue!);
    if (!res.ok) console.error(`Failed to update ${updateKey}:`, res);

    if (openModal()) return;
    setIsSelected(false);
    setItems(new Map());

    // Redirect to previous page when the list is empty
    if (displayMedias.length > 0) return;
    window.history.back();
  };

  // Get current pages: Album, Library, ...
  const currentPage =
    buttonConfig(openModal())[params.pages as keyof ButtonConfig] || buttonConfig(openModal()).default;

  // Disable all action buttons when there is no selected item
  const disableButtons = () => items().size < 1;

  return (
    <>
      <footer inert={disableButtons()} style={{ "z-index": 10 }} class={`${disableButtons() ? "footerDisabled" : ""}`}>
        <div class="actions__toolbar__column is_left">
          <Switch fallback={<Save />}>
            <Match when={currentPage.includes("unhide")}>
              <Unhide action={actions.unhide} />
            </Match>
            <Match when={currentPage.includes("recover")}>
              <Recover action={actions.recovery} />
            </Match>
          </Switch>
        </div>

        <div
          class="actions__toolbar__column is_middle"
          style={{ visibility: !currentPage.includes("favorite") && openModal() ? "hidden" : "visible" }}>
          <Show when={currentPage.includes("favorite")}>
            <Favorite action={actions.favorite} openModal={openModal} />
          </Show>

          {/* //////////////////////////////////////////////// */}
          <Show when={currentPage.includes("info")}>
            <Info />
          </Show>

          <Show when={currentPage.includes("edit")}>
            <button onClick={() => setIsEditing(true)}>{EditButtonIcon()}</button>
          </Show>

          <Switch>
            <Match when={currentPage.includes("permanentDeleteAll") && items().size === 1}>
              <DeleteAll />
            </Match>

            <Match when={currentPage.includes("mergeAll") && items().size === 1}>
              <MergeAll />
            </Match>
            <Match when={currentPage.includes("count")}>
              <button inert style={{ "pointer-events": "none" }}>
                {items().size}
              </button>
            </Match>
          </Switch>

          <Show when={currentPage.includes("more")}>
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
