import { Match, Setter, Show, Switch, type Component } from "solid-js";
import styles from "./PhotoView.module.css";
import { useMediaContext } from "../../context/Medias";
import { useManageURLContext } from "../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";

interface PhotoProps {
  media: MediaType;
  lastItem?: Setter<HTMLElement | null>;
  index: number;
}

const PhotoCard: Component<PhotoProps> = (props) => {
  const index = () => props.index;
  const media = () => props.media;
  const lastItem = () => props.lastItem;

  const { items, setItems, isSelected } = useMediaContext();
  const { view } = useManageURLContext();
  const { setOpenModal } = useViewMediaContext();

  const handleImageClick = (idx: number, mediaId: string) => {
    if (!isSelected()) {
      window.history.pushState({ state: "Photo Detail" }, "", window.location.href);

      const newItems = new Map(items());
      newItems.set(idx, mediaId);
      setItems(newItems);
      return setOpenModal(true);
    }

    const newItems = new Map(items());
    newItems.has(idx) ? newItems.delete(idx) : newItems.set(idx, mediaId);
    setItems(newItems);
  };

  return (
    <div
      ref={lastItem()}
      class={styles.mediaContainer}
      style={{ width: `calc(100% / ${view.nColumn} - 1px)` }}
      data-id={media().media_id}
      data-src={media().SourceFile}
      data-thumb={media().ThumbPath}
      data-time={media().timeFormat}
      data-idx={index()}
      on:click={() => handleImageClick(index(), media().media_id)}>
      <div inert class={styles.imageContainer}>
        <Show when={view.nColumn < 6}>
          <Show when={items().has(index())}>
            <div class={styles.selectedIcon}></div>
          </Show>
          <Show when={media().isFavorite}>
            <div class={styles.overlayFavorite}></div>
          </Show>
          <Switch>
            <Match when={media().FileType === "Live"}>
              <div class={styles.overlayLive}></div>
            </Match>
            <Match when={media().FileType === "Video"}>
              <div class={styles.overlayText}>{media().duration}</div>
            </Match>
          </Switch>
        </Show>
        <img
          loading="lazy"
          src={media().ThumbPath}
          alt={media().Title}
          class={`${view.objectFit ? styles.cover : styles.contain} ${items().has(index()) ? styles.grayscale : ""}`}
        />
      </div>
    </div>
  );
};

export default PhotoCard;
