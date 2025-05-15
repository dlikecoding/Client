import styles from "./ModalView.module.css";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";
import { Accessor, Component, createMemo, createSignal, Match, onMount, Setter, Switch } from "solid-js";
import Video from "./Types/Video";
import Photo from "./Types/Photo";
import Live from "./Types/Live";
import { useIntersectionObserver } from "solidjs-use";

interface MediaTypeProps {
  media: MediaType;
  topPos: number;
  viewIndex: number;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;

  setSelectCurrentItem: (index: number, mediaId: string) => void;
  setLastEl?: Setter<HTMLElement | null | undefined>;
}

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  let mediaRef: HTMLDivElement | undefined;
  const media = () => props.media;
  const viewIndex = () => props.viewIndex;

  const [isVisible, setIsVisible] = createSignal(false);
  const { isEditing } = useViewMediaContext();
  // Tracking if element is visible, then set the current index to this
  onMount(() => {
    useIntersectionObserver(
      mediaRef,
      ([{ isIntersecting }]) => {
        setIsVisible(isIntersecting); // pass intersection status to child components
        if (!isIntersecting) return;

        // Set the current index when the item is visible in Modal
        props.setSelectCurrentItem(viewIndex(), media().media_id);

        // if the item is the last index in current array, set it as visible to load more item.
        if (props.setLastEl) props.setLastEl(mediaRef);
      },
      { threshold: 0.59 }
    );
  });

  createMemo(() => props.setShowImageOnly(isEditing()));

  return (
    <div
      ref={mediaRef}
      class={styles.mediaContainer}
      style={{ top: `${props.topPos}px` }}
      data-modalid={media().media_id} // This media_id is needed to scrollIntoView
      onClick={() => {
        if (isEditing()) return;
        props.setShowImageOnly((prev) => !prev);
      }}>
      <Switch fallback={<div>Unknown type</div>}>
        <Match when={media().file_type === "Photo"}>
          <Photo
            media={media()}
            isVisible={isVisible()}
            showImageOnly={props.showImageOnly}
            setShowImageOnly={props.setShowImageOnly}
          />
        </Match>
        <Match when={media().file_type === "Video"}>
          <Video
            media={media()}
            isVisible={isVisible()}
            showImageOnly={props.showImageOnly}
            setShowImageOnly={props.setShowImageOnly}
          />
        </Match>
        <Match when={media().file_type === "Live"}>
          <Live
            media={media()}
            isVisible={isVisible()}
            showImageOnly={props.showImageOnly}
            setShowImageOnly={props.setShowImageOnly}
            clickableArea={mediaRef!}
          />
        </Match>
      </Switch>
    </div>
  );
};
export default MediaDisplay;
