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
import { Merge } from "./buttons/Merge";
import { EditButtonIcon, InfoButtonIcon } from "../../svgIcons";
import { Info } from "./buttons/Info";

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
    : ["favorite", "save", "count", "more", "delete"],
  deleted: isModalOpen
    ? ["recover", "permanentDelete"]
    : ["recover", "recoverAll", "count", "permanentDeleteAll", "permanentDelete"],
  hidden: isModalOpen ? ["unhide", "delete"] : ["unhide", "count", "delete"],
  duplicate: isModalOpen ? ["merge", "permanentDelete"] : ["merge", "count", "permanentDelete"],
});

const ActionNav = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const params = useParams();

  const { openModal, setIsEditing, displayMedias, setDisplayMedia } = useViewMediaContext();

  const actions = {
    save: () => console.log("save clicked"),

    favorite: () => updateMediaStatus("favorite"),

    hide: () => updateMediaStatus("hidden", true),
    unhide: () => updateMediaStatus("hidden", false),

    delete: () => updateMediaStatus("deleted", true),
    recovery: () => updateMediaStatus("deleted", false),

    merge: () => console.log("Merge Images"),
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
  };

  // Get current pages: Album, Library, ...
  const currentPage =
    buttonConfig(openModal())[params.pages as keyof ButtonConfig] || buttonConfig(openModal()).default;

  // Disable all action buttons when there is no selected item
  const disableButtons = () => items().size < 1;

  return (
    <>
      <footer inert={disableButtons()} style={{ "z-index": 1 }} class={`${disableButtons() ? "footerDisabled" : ""}`}>
        <div class="actions__toolbar__column is_left">
          <Switch fallback={<Save action={actions.save} />}>
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
          <Show when={currentPage.includes("favorite")}>
            <Favorite action={actions.favorite} openModal={openModal} />
          </Show>

          {/* //////////////////////////////////////////////// */}
          <Show when={currentPage.includes("info")}>
            <Info />
          </Show>

          <Show when={currentPage.includes("edit")}>
            <button
              onClick={() => {
                setIsEditing(true);
              }}>
              {EditButtonIcon()}
            </button>
          </Show>

          <Show when={currentPage.includes("count")}>
            <button inert>{items().size}</button>
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
