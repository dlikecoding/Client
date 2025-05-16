import { useMediaContext } from "../../../../context/Medias";
import { useViewMediaContext } from "../../../../context/ViewContext";
import { forDeleteAllInRecently, forDeleting } from "../../../extents/request/fetching";
import { SlideUp } from "../popover/SlideUp";

export const DeleteAll = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  const textDelete =
    "This will permanently delete all photo(s) & video(s) in Recently Deleted. This action can't be undone";

  const handleDelete = async () => {
    setDisplayMedia([]);
    setIsSelected(false);
    setItems(new Map());

    await forDeleteAllInRecently();

    // Redirect to previous page when the list is empty
    if (displayMedias.length > 0) return;
    window.history.back();
  };

  const deleteMes = () => `Delete ${items().size < 250 ? displayMedias.length : "All"} Photo(s)`;

  return (
    <>
      <button popovertarget="delete-all-contents">Delete All</button>
      <SlideUp idElement="delete-all-contents" noticeText={textDelete} confirmBtn={handleDelete} infoText={deleteMes} />
    </>
  );
};
