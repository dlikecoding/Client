import { useMediaContext } from "../../../../context/Medias";
import { useViewMediaContext } from "../../../../context/ViewContext";
import { forDeleting } from "../../../extents/request/fetching";
import { DeleteButtonIcon } from "../../../svgIcons";

type DeleteProps = {
  delete: () => void;
  isDeletePage: boolean;
};

export const Delete = (props: DeleteProps) => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const { setDisplayMedia } = useViewMediaContext();

  const deleteMediasOnSV = async () => {
    const listOfIds = new Set(items().values());
    setDisplayMedia((prev) => prev.filter((item, _) => !listOfIds.has(item.media_id)));

    setIsSelected(false);
    setItems(new Map());

    const res = await forDeleting([...listOfIds]);
    if (!res.ok) return console.error(`Failed to delete ${listOfIds}:`, res);
  };

  const textDelete = props.isDeletePage
    ? "The photo(s) will be moved to the Recently Deleted for 30 days before being permanently deleted."
    : "This will permanently delete the selectd photo(s). This action can't be undone";

  const handleDelete = () => (props.isDeletePage ? props.delete() : deleteMediasOnSV());
  return (
    <>
      <button popovertarget="delete-contents" disabled={items().size < 1}>
        {DeleteButtonIcon()}
      </button>
      <div popover="auto" id="delete-contents" class="delete_contents">
        <p>{textDelete}</p>

        <button class="deleteBtn" on:click={handleDelete}>
          Delete {items().size} Photo(s)
        </button>

        <button
          class="cancelBtn"
          on:click={() => {
            const popoverDelete = document.getElementById("delete-contents");
            popoverDelete?.hidePopover();
          }}>
          Cancel
        </button>
      </div>
    </>
  );
};
