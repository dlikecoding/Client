import { useMediaContext } from "../../../../context/Medias";
import { useViewMediaContext } from "../../../../context/ViewContext";
import { forMergeAllInDuplicate } from "../../../extents/request/fetching";
import { SlideUp } from "../popover/SlideUp";

export const MergeAll = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  const textDelete = "This will merges all duplicate photo(s) to one. This action can't be undone";

  const handleMerge = async () => {
    await forMergeAllInDuplicate();

    setDisplayMedia([]);
    setIsSelected(false);
    setItems(new Map());

    // Redirect to previous page when the list is empty
    window.history.back();
  };

  const deleteMes = () => `Merge ${items().size < 250 ? displayMedias.length : "All"} Photo(s)`;

  return (
    <>
      <button popovertarget="merge-all-contents">Merge All</button>
      <SlideUp idElement="merge-all-contents" noticeText={textDelete} confirmBtn={handleMerge} infoText={deleteMes} />
    </>
  );
};
