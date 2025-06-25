import { Component, createMemo, createSignal, JSX, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";
import { zoomPhoto } from "../../extents/helper/zoom";

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

  const zoomSize = createMemo(() => {
    if (!isPhotoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
    return zoomPhoto(currentChild(), view.zoomLevel);
  });

  return (
    <>
      {/* TODO ONLY load image when it visible */}

      <img
        style={{
          width: zoomSize().width,
          height: zoomSize().height,
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
