import { useMediaContext } from "../../../context/Medias";
import { forDeleting, forUpdating } from "../../extents/request/fetching";
import { DeleteButtonIcon, RecoverButtonIcon, ShareButtonIcon, UnHiddenIcon } from "../../svg-icons";
import { useViewMediaContext } from "../../../context/ViewContext";
import { useParams } from "@solidjs/router";
import { Favorite } from "./buttons/Favotire";
import { MoreAction } from "./buttons/MoreAction";
import { Match, Show, Switch } from "solid-js";
import { Share } from "./buttons/Share";
import { Recover } from "./buttons/Recover";
import { Unhide } from "./buttons/Unhide";
import { Delete } from "./buttons/Delete";

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

  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  const actions = {
    favorite: () => updateMediaStatus("Favorite"),

    hide: () => updateMediaStatus("Hidden", true),
    unhide: () => updateMediaStatus("Hidden", false),

    delete: () => updateMediaStatus("DeletedStatus", true),
    deleteOnSV: () => deleteMediasOnSV(),

    recovery: () => updateMediaStatus("DeletedStatus", false),
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

    setIsSelected((prev) => !prev);
    setItems(new Map());

    const res = await forUpdating([...listOfIds], updateKey, updateValue!);
    if (!res.ok) console.error(`Failed to update ${updateKey}:`, res);
  };

  const deleteMediasOnSV = async () => {
    const listOfIds = new Set(items().values());
    setDisplayMedia((prev) => prev.filter((item, _) => !listOfIds.has(item.media_id)));

    setIsSelected((prev) => !prev);
    setItems(new Map());

    const res = await forDeleting([...listOfIds]);
    if (!res.ok) return console.error(`Failed to delete ${listOfIds}:`, res);
  };

  const currentPage = buttonConfig[params.pages as keyof ButtonConfig] || buttonConfig.default;

  return (
    <>
      <footer style={{ "z-index": 3 }}>
        <div class="actions__toolbar__column is_left">
          <Switch fallback={<Share />}>
            <Match when={currentPage.includes("unhide")}>
              <Unhide action={actions.unhide} status={items().size < 1} />
            </Match>
            <Match when={currentPage.includes("recover")}>
              <Recover action={actions.recovery} status={items().size < 1} />
            </Match>
          </Switch>
        </div>

        <div class="actions__toolbar__column is_middle">
          <Show when={currentPage.includes("favorite")}>
            <Favorite action={actions.favorite} status={items().size < 1} />
          </Show>
          <button>{items().size}</button>

          <Show when={currentPage.includes("more")}>
            <MoreAction hide={actions.hide} status={items().size < 1} />
          </Show>
        </div>

        <div class="actions__toolbar__column is_right">
          <Delete
            delete={actions.delete}
            deleteOnSV={actions.deleteOnSV}
            isDeletePage={currentPage.includes("delete")}
          />
        </div>
      </footer>
    </>
  );
};

export default ActionNav;

const shareMedias = (items: Map<number, string>) => {
  return console.log("Share media: ", items);
};
