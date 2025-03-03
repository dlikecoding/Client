import styles from "./ModalView.module.css";
import { MediaType } from "../../context/ViewContext";
import { Accessor, Component, createSignal, Match, onMount, Setter, Show, Switch } from "solid-js";
import Video from "./Types/Video";
import Photo from "./Types/Photo";
import Live from "./Types/Live";
import { useIntersectionObserver } from "solidjs-use";

interface MediaTypeProps {
  media: MediaType;
  topPos: number;
  viewIndex: number;

  showImgOnly: Accessor<boolean>;
  setShowImgOnly: Setter<boolean>;

  setSelectCurrentItem: (index: number, mediaId: string) => void;
  setLastEl?: Setter<HTMLElement | null | undefined>;
}

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  let mediaRef: HTMLDivElement | undefined;
  const media = () => props.media;
  const viewIndex = () => props.viewIndex;

  const [isVisible, setIsVisible] = createSignal(false);

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

  return (
    <div
      ref={mediaRef}
      class={styles.mediaContainer}
      style={{ top: `${props.topPos}px` }}
      // This media_id is needed to scrollIntoView
      data-modalid={media().media_id}
      onClick={() => props.setShowImgOnly((prev) => !prev)}>
      <Switch fallback={<div>Unknown type</div>}>
        <Match when={media().FileType === "Photo"}>
          <Photo media={media()} />
        </Match>
        <Match when={media().FileType === "Video"}>
          <Video
            media={media()}
            isVisible={isVisible()}
            showImgOnly={props.showImgOnly}
            setShowImgOnly={props.setShowImgOnly}
          />
        </Match>
        <Match when={media().FileType === "Live"}>
          <Live media={media()} />
        </Match>
      </Switch>
    </div>
  );
};
export default MediaDisplay;
