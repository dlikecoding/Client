import { Component, createMemo, createSignal, JSX, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";

interface PhotoProps {
  media: MediaType;
  currentChild: HTMLImageElement;
  isVisible: boolean;
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  const currentChild = () => props.currentChild;

  const { isEditing } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && currentChild());

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  return (
    <>
      {/* TODO ONLY load image when it visible */}

      <img
        style={{
          width: isPhotoVisible() && view.zoomLevel > 1 ? `${currentChild().naturalWidth * view.zoomLevel}px` : "100%",
          height:
            isPhotoVisible() && view.zoomLevel > 1 ? `${currentChild().naturalHeight * view.zoomLevel}px` : "100%",
        }}
        inert
        onLoad={() => setImgLoading(false)}
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={imgLoading() ? media().thumb_path : media().source_file}
        alt={`Modal Image`}
      />

      {/* ////////////// All addon element must start here /////////////////////////////// */}

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isPhotoVisible()}>
        <EditPhoto photo={currentChild()} />
      </Show>
    </>
  );
};
export default Photo;
