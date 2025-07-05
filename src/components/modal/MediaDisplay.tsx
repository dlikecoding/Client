import styles from "./ModalView.module.css";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";
import { Component, createMemo, createSignal, Match, onCleanup, onMount, Setter, Switch } from "solid-js";
import Video from "./Types/Video";
import Photo from "./Types/Photo";
import Live from "./Types/Live";
import { useIntersectionObserver } from "solidjs-use";
import { ZoomAndAspect } from "../../context/ManageUrl";
import { SetStoreFunction } from "solid-js/store";
import { useMediaContext } from "../../context/Medias";
import { mouseGesture } from "../extents/helper/mouseEvent/mouseStore";

interface MediaTypeProps {
  media: MediaType;
  leftPos: number;
  viewIndex: number;

  setLastEl?: Setter<HTMLElement | null | undefined>;
}

const DOUBLE_CLICK_DELAY = 240; // ms, comment for future maintainers

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  let mediaRef: HTMLDivElement | undefined;
  const media = () => props.media;
  const viewIndex = () => props.viewIndex;
  const { setOneItem } = useMediaContext();

  const [currentChild, setCurrentChild] = createSignal<HTMLVideoElement | HTMLImageElement>();
  const [isVisible, setIsVisible] = createSignal<boolean>(false);
  const { isEditing, setShowImageOnly } = useViewMediaContext();

  const [displayText, setDisplayText] = createSignal<string>("");
  onMount(() => {
    // Tracking if element is visible, then set the current index to this
    useIntersectionObserver(
      mediaRef,
      ([{ isIntersecting }]) => {
        setIsVisible(isIntersecting); // pass intersection status to child components

        if (!isIntersecting) return setIsVisible(false);

        // get current display child element like img/video tags
        if (mediaRef && mediaRef.children.length > 0) {
          setCurrentChild(mediaRef.children[0] as HTMLVideoElement | HTMLImageElement);
        }

        // Set the current index when the item is visible in Modal
        setOneItem(viewIndex(), media().media_id);

        // if the item is the last index in current array, set it as visible to load more item.
        if (props.setLastEl) props.setLastEl(mediaRef);
      },
      { threshold: 0.59 }
    );
  });

  // const handleClick = useZoomAndClickHandler(setView, isVisible, isEditing, setShowImageOnly);
  createMemo(() => setShowImageOnly(isEditing()));

  createMemo(() => {
    if (!currentChild()) return;

    if (mouseGesture) {
      console.log(mouseGesture);
    }
  });

  // let panzoomInstance: PanzoomObject | null = null;
  // createMemo(() => {
  //   if (currentChild()) panzoomInstance?.reset();
  // });

  // createMemo(() => {
  //   const target = currentChild();
  //   const parent = mediaRef;
  //   if (!target || !parent) return;

  //   panzoomInstance?.destroy();

  //   panzoomInstance = Panzoom(target, {
  //     maxScale: 4,
  //     contain: "outside",
  //     canvas: true,
  //   });
  // });

  // onCleanup(() => {
  //   panzoomInstance?.destroy();
  //   panzoomInstance = null;
  // });

  return (
    <div
      ref={mediaRef}
      class={styles.mediaContainer}
      style={{
        left: `${props.leftPos}px`,
        // overflow: isVisible() ? "auto" : "hidden"
      }}
      data-modalid={media().media_id} // This media_id is needed to scrollIntoView
      // onClick={handleClick}
      // onDblClick={(event: MouseEvent) => {
      //   event.preventDefault();

      //   if (panzoomInstance) {
      //     panzoomInstance.getScale() > 1
      //       ? panzoomInstance.reset()
      //       : panzoomInstance.zoomToPoint(2.5, { clientX: event.clientX, clientY: event.clientY }, { animate: true });
      //   }
      // }}
    >
      <div
        style={{
          position: "fixed",
          top: "200px",
          left: "0",
          width: "200px",
          height: "100px",
          "z-index": "9999", // ensure it's on top
          "background-color": "rgba(0, 0, 0, 0.5)", // semi-transparent overlay
        }}>
        <p style={{ color: "white" }}>{displayText()}</p>
      </div>

      <Switch fallback={<div>Unknown type</div>}>
        <Match when={media().file_type === "Photo"}>
          <Photo media={media()} isVisible={isVisible()} currentChild={currentChild() as HTMLImageElement} />
        </Match>
        <Match when={media().file_type === "Video"}>
          <Video media={media()} isVisible={isVisible()} currentChild={currentChild() as HTMLVideoElement} />
        </Match>
        <Match when={media().file_type === "Live"}>
          <Live
            media={media()}
            isVisible={isVisible()}
            currentChild={currentChild() as HTMLVideoElement}
            clickableArea={mediaRef!}
          />
        </Match>
      </Switch>
    </div>
  );
};
export default MediaDisplay;

const useZoomAndClickHandler = (
  setView: SetStoreFunction<ZoomAndAspect>,
  isVisible: () => boolean,
  isEditing: () => boolean,
  setShowImageOnly: Setter<boolean>
) => {
  let clickTimer: ReturnType<typeof setTimeout> | null = null;

  const handleClick = (e: MouseEvent) => {
    if (e.target !== e.currentTarget || isEditing()) return;
    e.preventDefault();
    e.stopPropagation();

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;

      if (!isVisible()) return;

      setView("zoomLevel", (prev) => (prev > 1 ? 1 : 3));
    } else {
      clickTimer = setTimeout(() => {
        setShowImageOnly((prev) => !prev);
        clickTimer = null;
      }, DOUBLE_CLICK_DELAY);
    }
  };

  onCleanup(() => {
    if (clickTimer) clearTimeout(clickTimer);
  });

  return handleClick;
};
