import { Component } from "solid-js";
import { useManageURLContext } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";

interface MediaTypeProps {
  media: MediaType;
  leftPos: number;
  viewIndex: number;
}

const DOUBLE_CLICK_DELAY = 240; // ms, comment for future maintainers

const ModalCard: Component<MediaTypeProps> = (props: {
  media: any;
  viewIndex: any;
  setSelectCurrentItem: (arg0: any, arg1: any) => void;
  setLastEl: (arg0: HTMLDivElement | undefined) => void;
  leftPos: any;
}) => {
  let mediaRef: HTMLDivElement | undefined;
  const media = () => props.media;
  const viewIndex = () => props.viewIndex;

  const { setView } = useManageURLContext();

  const [currentChild, setCurrentChild] = createSignal<HTMLVideoElement | HTMLImageElement>();
  const [isVisible, setIsVisible] = createSignal<boolean>(false);
  const { isEditing, setShowImageOnly } = useViewMediaContext();

  onMount(() => {
    // Tracking if element is visible, then set the current index to this
    useIntersectionObserver(
      mediaRef,
      ([{ isIntersecting }]) => {
        setIsVisible(isIntersecting); // pass intersection status to child components

        if (!isIntersecting) return;

        // get current display child element like img/video tags
        if (mediaRef && mediaRef.children.length > 0) {
          setCurrentChild(mediaRef.children[0] as HTMLVideoElement | HTMLImageElement);
        }

        // Set the current index when the item is visible in Modal
        props.setSelectCurrentItem(viewIndex(), media().media_id);

        // if the item is the last index in current array, set it as visible to load more item.
        if (props.setLastEl) props.setLastEl(mediaRef);
      },
      { threshold: 0.59 }
    );
  });

  // const handleClick = useZoomAndClickHandler(setView, isVisible, isEditing, setShowImageOnly);

  createMemo(() => setShowImageOnly(isEditing()));

  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  let dragging = false;
  let startX = 0;
  let startY = 0;

  const onMouseDown = (e: { clientX: number; clientY: number }) => {
    dragging = true;
    startX = e.clientX - translate().x;
    startY = e.clientY - translate().y;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: { clientX: number; clientY: number }) => {
    if (!dragging) return;
    const newX = e.clientX - startX;
    const newY = e.clientY - startY;
    setTranslate({ x: newX, y: newY });
  };

  const onMouseUp = () => {
    dragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  onCleanup(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  });

  return (
    <div
      ref={mediaRef}
      class={styles.mediaContainer}
      style={{ left: `${props.leftPos}px`, overflow: isVisible() ? "auto" : "hidden" }}
      data-modalid={media().media_id} // This media_id is needed to scrollIntoView
      // onClick={handleClick}
      onMouseDown={onMouseDown}>
      <div inert class={styles.wapperMedia}>
        <Switch fallback={<div>Unknown type</div>}>
          <Match when={media().file_type === "Photo"}>
            <Photo
              media={media()}
              isVisible={isVisible()}
              translate={translate()}
              currentChild={currentChild() as HTMLImageElement}
            />
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
    </div>
  );
};
export default ModalCard;
