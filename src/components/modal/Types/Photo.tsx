import { Component, createMemo, createSignal, JSX, onCleanup, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";
import { zoomPhoto } from "../../extents/helper/zoom";

import styles from "./Types.module.css";
import { createStore } from "solid-js/store";

interface PhotoProps {
  media: MediaType;
  isVisible: boolean;
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  let photoRef: HTMLImageElement;

  const { isEditing } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && photoRef);

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  const zoomSize = createMemo(() => {
    if (!isPhotoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
    return zoomPhoto(photoRef, view.zoomLevel);
  });

  createMemo(() => {
    if (!isPhotoVisible()) return;
    setImgLoading(false);
  });

  // =========================================================

  // const [translate, setTranslate] = createStore({ x: 0, y: 0 });

  // const [dragging, setDragging] = createSignal(false);
  // let startX = 0;
  // let startY = 0;
  // const onMouseDown = (e: MouseEvent) => {
  //   setDragging(true);
  //   startX = e.clientX - translate.x;
  //   startY = e.clientY - translate.y;
  //   document.body.style.cursor = "grabbing";
  // };

  // const onMouseMove = (e: MouseEvent) => {
  //   if (!dragging()) return;
  //   setTranslate({ x: e.clientX - startX, y: e.clientY - startY });
  // };

  // const onMouseUp = () => {
  //   setDragging(false);
  //   document.body.style.cursor = "default";
  // };

  // window.addEventListener("mousemove", onMouseMove);
  // window.addEventListener("mouseup", onMouseUp);
  // onCleanup(() => {
  //   window.removeEventListener("mousemove", onMouseMove);
  //   window.removeEventListener("mouseup", onMouseUp);
  // });

  return (
    <>
      <img
        // onMouseDown={onMouseDown}
        ref={(el) => (photoRef = el)}
        style={{
          width: zoomSize().width,
          height: zoomSize().height,

          // transform: view.zoomLevel <= 1 ? "translate(center)" : `translate(${translate.x}px, ${translate.y}px)`,
        }}
        inert
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={media().source_file}
        alt={`Modal Image`}
      />

      <img
        inert
        class={styles.overlayImg}
        style={{ opacity: imgLoading() ? 1 : 0 }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      />

      {/* ////////////// All addon element must start here /////////////////////////////// */}

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isPhotoVisible()}>
        <EditPhoto photo={photoRef!} />
      </Show>
    </>
  );
};
export default Photo;
