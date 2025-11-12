import styles from "./ModalView.module.css";
import { MediaType, ModalProps, useViewMediaContext } from "../../context/ViewContext";
import { Component, createMemo, createSignal, Match, onCleanup, onMount, Setter, Switch } from "solid-js";
import Video from "./Types/Video";
import Photo from "./Types/Photo";
import Live from "./Types/Live";
import { useIntersectionObserver, useResizeObserver } from "solidjs-use";
import { useManageURLContext, ZoomAndAspect } from "../../context/ManageUrl";
import { SetStoreFunction } from "solid-js/store";
import { useMouseTask } from "../hooks/MouseGesture";

interface MediaTypeProps {
  media: MediaType;
  topPos: number;
  viewIndex: number;

  setSelectCurrentItem: (index: number, mediaId: number) => void;
  setLastEl?: Setter<HTMLElement | null | undefined>;
}

export type StyleKeys = {
  width?: string;
  height?: string;
  "max-height"?: string;
};

const DOUBLE_CLICK_DELAY = 240; // ms, comment for future maintainers

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  let mediaRef: HTMLDivElement | undefined;
  const media = () => props.media;
  const viewIndex = () => props.viewIndex;

  const { view, setView } = useManageURLContext();

  const [isVisible, setIsVisible] = createSignal<boolean>(false);
  const { openModal, setOpenModal } = useViewMediaContext();

  onMount(() => {
    // Tracking if element is visible, then set the current index to this
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

    // Disable centering on zoom-in to prevent top of element from being cut off.
    // Re-enable centering when the element's height is smaller than the viewport height.
    if (!mediaRef || !mediaRef.children.length) return "";
    const childEl = mediaRef.children[0] as HTMLElement;
    useResizeObserver(childEl, (entries) => {
      // console.log();
      if (!childDim().height) return;
      const [entry] = entries;
      const { height } = entry.contentRect;

      requestAnimationFrame(() => {
        const adjustTo = height > window.innerHeight ? "none" : "center";
        document.documentElement.style.setProperty("--modal-center", adjustTo);
      });
    });

    useMouseTask(mediaRef!);
  });

  const handleClick = useZoomAndClickHandler(setView, isVisible, openModal, setOpenModal);

  const childDim = createMemo(() => {
    if (!isVisible() || view.zoomLevel < 1) return {};

    const isPortrait = window.innerWidth < window.innerHeight;
    const zoomFactor = (1 + 0.75 * (view.zoomLevel - 1)) * 100;

    const isMaxHeight = view.zoomLevel === 1 ? "100dvh" : "none";

    if (isPortrait) return { width: `${zoomFactor}%`, height: "auto", "max-height": isMaxHeight };
    return { width: "auto", height: `${zoomFactor}%`, "max-height": isMaxHeight };
  });

  return (
    <div
      ref={mediaRef}
      classList={{
        [styles.mediaContainer]: true,
        // [styles.mediaCenter]: true, //view.zoomLevel <= 1
      }}
      style={{ top: `${props.topPos}px`, overflow: view.zoomLevel > 1 ? "scroll" : "hidden" }}
      data-modalid={media().media_id} // This media_id is needed to scrollIntoView
      onClick={handleClick}>
      <Switch fallback={<div>Unknown type</div>}>
        <Match when={media().file_type === "Photo"}>
          <Photo media={media()} isVisible={isVisible()} childDim={childDim()} />
        </Match>
        <Match when={media().file_type === "Video"}>
          <Video media={media()} isVisible={isVisible()} childDim={childDim()} />
        </Match>
        <Match when={media().file_type === "Live"}>
          <Live media={media()} isVisible={isVisible()} clickableArea={mediaRef!} childDim={childDim()} />
        </Match>
      </Switch>
    </div>
  );
};
export default MediaDisplay;

const useZoomAndClickHandler = (
  setView: SetStoreFunction<ZoomAndAspect>,
  isVisible: () => boolean,
  openModal: ModalProps,
  setOpenModal: SetStoreFunction<ModalProps>
) => {
  let clickTimer: ReturnType<typeof setTimeout> | null = null;

  const handleClick = (e: MouseEvent) => {
    if (e.target !== e.currentTarget || openModal.isEditing) return;
    e.preventDefault();
    e.stopPropagation();

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;

      if (!isVisible()) return;

      setView("zoomLevel", (prev) => (prev > 1 ? 1 : 3));
    } else {
      clickTimer = setTimeout(() => {
        setOpenModal("showImage", (prev) => !prev);
        clickTimer = null;
      }, DOUBLE_CLICK_DELAY);
    }
  };

  onCleanup(() => {
    if (clickTimer) clearTimeout(clickTimer);
  });

  return handleClick;
};
