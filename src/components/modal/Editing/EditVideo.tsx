import { Component, createMemo } from "solid-js";
import LayoutEditing from "./LayoutEditing";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { SlideUp } from "../../photoview/actionNav/popover/SlideUp";
import { ZoomButtonIcon } from "../../svgIcons";
// import { fetchVideoReduceFrame } from "../../extents/request/fetching";

type EditVideoProps = {
  video: HTMLVideoElement;
  media: MediaType;
};

const EditVideo: Component<EditVideoProps> = (props) => {
  const { isEditing, setShowImageOnly, setIsEditing } = useViewMediaContext();

  const media = () => props.media;
  const video = () => props.video;

  const handleCancel = () => setIsEditing(false);
  const handleDone = () => {
    // implement video save logic
    setIsEditing(false);
  };

  createMemo(() => {
    if (!isEditing()) return;

    if (video() && !video().paused) video().pause();
    setShowImageOnly(true);
  });

  const reduceFrame = async () => {
    console.log("reducing frame");
    // const res = await fetchVideoReduceFrame(media().media_id, media().source_file);
  };
  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone}>
      {/* Media-specific logic/UI */}
      <div style={{ color: "white" }}></div>

      <footer class="footer_nav">
        <div class="actions__toolbar__column is_left">
          <button>A</button>
        </div>
        <div class="actions__toolbar__column is_middle">
          {/* <button>{ZoomButtonIcon()}</button> */}

          <button disabled={media().frame_rate <= 30} onClick={reduceFrame}>
            Reduce Frames
          </button>
        </div>
        <div class="actions__toolbar__column is_right">
          <button>B</button>
        </div>
      </footer>
    </LayoutEditing>
  );
};

export default EditVideo;
