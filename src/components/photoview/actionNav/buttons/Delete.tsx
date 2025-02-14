import { useMediaContext } from "../../../../context/Medias";
import { DeleteButtonIcon } from "../../../svg-icons";

type DeleteProps = {
  delete: () => void;
  deleteOnSV: () => void;
  isDeletePage: boolean;
};

export const Delete = (props: DeleteProps) => {
  const { items } = useMediaContext();

  const textDelete = props.isDeletePage
    ? "The photo(s) will be moved to the Recently Deleted for 30 days before being permanently deleted."
    : "This will permanently delete the selectd photo(s). This action can't be undone";

  const handleDelete = () => (props.isDeletePage ? props.delete() : props.deleteOnSV());
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
