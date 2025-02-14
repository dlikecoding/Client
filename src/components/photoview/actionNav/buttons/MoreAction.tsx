import { createSignal, Show } from "solid-js";
import { MoreActionButtonIcon } from "../../../svg-icons";
import AddToAlbum from "../AddToAlbum";
import { useParams } from "@solidjs/router";
import { useMediaContext } from "../../../../context/Medias";

type MoreActionsProps = {
  hide: () => void;
  status: boolean;
};

export const MoreAction = (props: MoreActionsProps) => {
  const params = useParams();
  const { items } = useMediaContext();

  const [addToAlbum, setAddToAlbum] = createSignal<boolean>(false);

  const handleAddToAlbum = () => {
    setAddToAlbum(true);
    document.getElementById("actions_contents")?.hidePopover();
  };

  const handleAddToDataset = () => {
    // setAddToAlbum(true);
    // document.getElementById("actions_contents")?.hidePopover();
  };

  return (
    <>
      <button popovertarget="actions_contents" disabled={props.status}>
        {MoreActionButtonIcon()}
      </button>

      <div popover="auto" id="actions_contents" class="popover-container actions_contents">
        {params.pages === "album" && <div>Remove from Album</div>}
        {params.pages === "dataset" && <div>Remove from Dataset</div>}

        <div onClick={handleAddToAlbum}>Add to Album</div>
        <div onClick={handleAddToDataset}>Add to Data</div>
        <div onClick={props.hide}>Hide</div>

        <div>Slideshow (...)</div>
      </div>

      <Show when={addToAlbum()}>
        <AddToAlbum setAddToAlbum={setAddToAlbum} />
      </Show>
    </>
  );
};
