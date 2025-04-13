import { useParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { MoreActionButtonIcon } from "../../../svgIcons";
import { useMediaContext } from "../../../../context/Medias";
import AddToCollection from "../addColection/AddToCollection";
import { fetchAlbum, fetchRemoveAlbum, fetchAddAlbum } from "../../../extents/request/fetching";
import { useViewMediaContext } from "../../../../context/ViewContext";

type MoreActionsProps = {
  hide: () => void;
};

export const MoreAction = (props: MoreActionsProps) => {
  const params = useParams();

  const { items, setItems, setIsSelected } = useMediaContext();
  const { setDisplayMedia } = useViewMediaContext();

  const [addToAlbum, setAddToAlbum] = createSignal<boolean>(false);
  // const [addToDataset, setAddToDataset] = createSignal<boolean>(false);

  const handleAddToAlbum = () => {
    setAddToAlbum(true);
    document.getElementById("actions_contents")?.hidePopover();
  };

  // const handleAddToDataset = () => {
  //   setAddToDataset(true);
  //   document.getElementById("actions_contents")?.hidePopover();
  // };

  const handleRemoveFromAlbum = async () => {
    const listOfIds = new Set(items().values());
    const res = await fetchRemoveAlbum([...listOfIds], parseInt(params.id));
    if (!res.ok) alert("Failed to remove media from album!");

    setDisplayMedia((prev) => prev.filter((item, _) => !listOfIds.has(item.media_id)));

    setIsSelected(false);
    setItems(new Map());
  };

  return (
    <>
      <button popovertarget="actions_contents">{MoreActionButtonIcon()}</button>

      <div popover="auto" id="actions_contents" class="popover-container actions_contents">
        <Show when={params.pages === "album"}>
          <div onClick={handleRemoveFromAlbum}>Remove from Album</div>
        </Show>
        {/* <Show when={params.pages === "dataset"}>
          <div onClick={() => console.log("Remove dataset: ", items())}>Remove from Dataset</div>
        </Show> */}

        <Show when={params.pages !== "album"}>
          <div onClick={handleAddToAlbum}>Add to Album</div>
        </Show>

        {/* <Show when={params.pages !== "dataset"}>
          <div onClick={handleAddToDataset}>Add to Dataset</div>
        </Show> */}

        <div onClick={props.hide}>Hide</div>
        <div>Slideshow (...)</div>
      </div>

      <Show when={addToAlbum()}>
        <AddToCollection
          setAddToCollection={setAddToAlbum}
          entityType="Album"
          fetchItems={fetchAlbum}
          updateItems={fetchAddAlbum}
        />
      </Show>

      {/* <Show when={addToDataset()}>
        <AddToCollection
          setAddToCollection={setAddToDataset}
          entityType="Dataset"
          fetchItems={fetchAlbum}
          updateItems={fetchAlbumUpdating}
        />
      </Show> */}
    </>
  );
};
