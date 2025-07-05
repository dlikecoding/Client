import { Component, createMemo, createSignal, onCleanup, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";
import { zoomPhoto } from "../../hooks/zoom";

import styles from "./Types.module.css";

interface PhotoProps {
  media: MediaType;
  currentChild: HTMLImageElement;
  isVisible: boolean;
  translate: { x: number; y: number };
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  const currentChild = () => props.currentChild;
  const translate = () => props.translate;

  const { isEditing } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && currentChild());

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  const zoomSize = createMemo(() => {
    if (!isPhotoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "auto" };
    return zoomPhoto(currentChild(), view.zoomLevel);
  });

  createMemo(() => {
    if (!isPhotoVisible()) return;
    setImgLoading(false);
  });

  const transformCoor = (val: number, side = "width") => {
    if (!isPhotoVisible() || view.zoomLevel === 1) return "none";

    // console.log(zoomSize().width, zoomSize().height, window.innerWidth);

    // const dimRec = zoomPhoto(currentChild(), view.zoomLevel);

    // if ((side = "width")) {
    //   const newX = Math.max(translate().x, window.innerWidth - dimRec.w);
    //   return `${Math.min(0, newX)}px`;
    // }

    return `${val}px`;

    // return `scale(${view.zoomLevel}) translate(${translate().x}px, ${translate().y}px`;
  };

  return (
    <>
      <img
        style={{
          width: zoomSize().width,
          height: zoomSize().height,
          left: `${transformCoor(translate().x)}`,
          top: `${transformCoor(translate().y, "height")}`,
          // transform: `${transformCoor()})`,
        }}
        // inert
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={media().source_file}
        alt={`Modal Image`}
      />
      <p style={{ "z-index": 100 }}>
        hello x: {translate().x} - y: {translate().y} - zoom: {view.zoomLevel}
      </p>
      <img
        inert
        class={styles.overlayImg}
        style={{ opacity: !isPhotoVisible() || imgLoading() ? 1 : 0 }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
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
