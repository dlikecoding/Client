import { createMemo, createSignal, Match, Show, Switch, type Component } from "solid-js";
import styles from "./PhotoView.module.css";
import { useMediaContext } from "../../context/Medias";
import { useManageURLContext } from "../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";

interface PhotoProps {
  media: MediaType;
  lastItem?: (el: HTMLElement) => void;
  index: number;
  itemDim: number;
  // mediaDim: { top: number; left: number; size: number };
}

const PhotoCard: Component<PhotoProps> = (props) => {
  const index = () => props.index;
  const media = () => props.media;
  const lastItem = () => props.lastItem;
  const itemDim = () => props.itemDim;

  const { items, setItems, setOneItem, isSelected } = useMediaContext();
  const { view } = useManageURLContext();
  const { setOpenModal } = useViewMediaContext();

  const handleImageClick = (idx: number, mediaId: string) => {
    if (!isSelected()) {
      window.history.pushState({ state: "Photo Modal" }, "", window.location.href);

      setOneItem(idx, mediaId);
      return setOpenModal(true);
    }

    const newItems = new Map(items());
    newItems.has(idx) ? newItems.delete(idx) : newItems.set(idx, mediaId);
    setItems(newItems);
  };

  const mediaDim = createMemo(() => {
    return {
      top: Math.floor(index() / view.nColumn) * itemDim(),
      left: (index() % view.nColumn) * itemDim(),
      size: itemDim(),
    };
  });

  return (
    <div
      ref={lastItem()}
      class={styles.mediaContainer}
      style={{
        top: `${mediaDim().top}px`,
        left: `${mediaDim().left}px`,
        width: `${mediaDim().size}px`,
        height: `${mediaDim().size}px`,
      }}
      data-id={media().media_id}
      data-src={media().source_file}
      data-idx={index()}
      onClick={() => handleImageClick(index(), media().media_id)}>
      <div inert class={styles.imageContainer}>
        <Show when={items().has(index())}>
          <div class={styles.selectedIcon}></div>
        </Show>
        <Show when={media().favorite}>
          <div class={styles.overlayFavorite}></div>
        </Show>
        <Switch>
          <Match when={media().file_type === "Live"}>
            <div class={styles.overlayLive}></div>
          </Match>
          <Match when={media().file_type === "Video"}>
            <div class={styles.overlayText}>{media().video_duration}</div>
          </Match>
        </Switch>

        <img
          // loading="lazy"
          src={media().thumb_path}
          alt="Gallery"
          class={`${view.objectFit ? styles.cover : styles.contain} ${items().has(index()) ? styles.grayscale : ""}`}
        />
      </div>
    </div>
  );
};

export default PhotoCard;
