import { createSignal, Show } from "solid-js";
import { useMediaContext } from "../../../context/Medias";
import { forDeleting, forUpdating } from "../../extents/request/fetching";
import AddToAlbum from "./AddToAlbum";
import { DeleteButton, FavoriteButton, MoreActionButton, RecoverButton, ShareButton } from "../../svg-icons";
import { useViewMediaContext } from "../../../context/ViewContext";
import { useParams } from "@solidjs/router";

const ActionNav = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const params = useParams();

  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  const [addToAlbum, setAddToAlbum] = createSignal<boolean>(false);
  const actions = {
    addToAlbum: (isOpen: boolean) => setAddToAlbum(isOpen),
    share: () => console.log("Share media: ", items()),
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
    const listOfIndex = Array.from(items().keys());

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

  return (
    <>
      <footer style={{ "z-index": 3 }}>
        <div class="actions__toolbar__column is_left">
          {params.pages === "deleted" ? (
            <button on:click={actions.recovery} disabled={items().size < 1}>
              {RecoverButton()}
            </button>
          ) : (
            <button on:click={() => shareMedias(items())} disabled={items().size < 1}>
              {ShareButton()}
            </button>
          )}
        </div>

        <div class="actions__toolbar__column is_middle">
          <button on:click={actions.favorite} disabled={items().size < 1}>
            {FavoriteButton()}
          </button>
          <button on:click={() => console.log(items())}>{items().size}</button>

          <button popovertarget="actions_contents" disabled={items().size < 1 || params.pages === "deleted"}>
            {MoreActionButton()}
          </button>
          <div popover="auto" id="actions_contents" class="popover-container actions_contents">
            <div
              on:click={() => {
                actions.addToAlbum(true);
                document.getElementById("actions_contents")?.hidePopover();
              }}>
              Add to Album
            </div>
            {params.pages === "hidden" ? (
              <div on:click={actions.unhide}>Unhide</div>
            ) : (
              <div on:click={actions.hide}>Hide</div>
            )}

            <div>Slideshow (...)</div>

            {params.pages === "album" ? (
              <div>Remove from Album</div>
            ) : params.pages === "dataset" ? (
              <div>Remove from Dataset</div>
            ) : null}
          </div>
        </div>
        <div class="actions__toolbar__column is_right">
          <button popovertarget="delete-contents" disabled={items().size < 1}>
            {DeleteButton()}
          </button>
          <div popover="auto" id="delete-contents" class="delete_contents">
            {params.pages === "deleted" ? (
              <p>This will permanently delete the selectd photo(s). This action can't be undone</p>
            ) : (
              <p>
                The photo(s) will be moved to the Recently Deleted photo(s) for 30 days before being permanently
                deleted.
              </p>
            )}

            <button class="deleteBtn" on:click={params.pages === "deleted" ? actions.deleteOnSV : actions.delete}>
              Delete {items().size} Photo(s)
            </button>

            <button
              on:click={() => {
                const popoverDelete = document.getElementById("delete-contents");
                popoverDelete?.hidePopover();
              }}
              class="cancelBtn">
              Cancel
            </button>
          </div>
        </div>
      </footer>

      <Show when={addToAlbum()}>
        <AddToAlbum setAddToAlbum={setAddToAlbum} />
      </Show>
    </>
  );
};

export default ActionNav;

const shareMedias = (items: Map<number, string>) => {
  return console.log("Share media: ", items);
};
