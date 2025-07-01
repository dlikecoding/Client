import styles from "../popover/SlideUp.module.css";
import { createMemo, createSignal, Show } from "solid-js";
import { useMediaContext } from "../../../../context/Medias";

import { DoneButtonIcon, GenerateButtonIcon, InfoButtonIcon } from "../../../svgIcons";
import { fetchPhotoInfo, forUpdateCaption } from "../../../extents/request/fetching";
import { convertFileSize, formatTime } from "../../../extents/helper/helper";
import { createStore } from "solid-js/store";

export type MediaInfo = {
  caption: string;
  create_date: string;
  file_ext: string;
  file_name: string;
  file_size: number;
  file_type: string;

  city: string;
  state: string;

  make?: string;
  media_id: number;

  mime_type: string;
  model?: string;
  orientation?: string;
  software?: string;
  upload_at: string;
  user_name?: string;

  image_height: string;
  image_width: string;
  lens_model?: string;
  megapixels?: string;

  // For Video
  title: string;

  // For Video/Live
  frame_rate: number;
  video_duration: string;
  duration: number;
};

export const Info = () => {
  const { items } = useMediaContext();

  let popoverDiv: HTMLDivElement | null = null;
  let captionInputEl: HTMLInputElement | null = null;

  const [editCaption, setEditCaption] = createSignal<boolean>(true); // Disable edit on default

  const updateCaptionByInput = async () => {
    if (editCaption()) {
      setEditCaption(false);
      captionInputEl?.focus();
    } else {
      setEditCaption(true);

      const mediaId = items().values().next().value;
      if (!mediaId) return alert("No valid photo/video to update");

      if (!captionInputEl || captionInputEl.value.trim().length === 0 || captionInputEl.value === "Add a Caption")
        return alert("Please enter new data to update this caption.");

      const caption = captionInputEl.value.trim();
      if (caption === mediaInfo.caption) return;

      const res = await forUpdateCaption(mediaId, captionInputEl.value);
      if (res.ok) return;
      console.log(await res.json());
    }
  };

  const [mediaInfo, setMediaInfo] = createStore<MediaInfo>(defaultInfo);

  const requestInfo = async () => {
    const mediaId = items().values().next().value;
    if (!mediaId) return alert("No valid photo/video to get info");

    // If request the same infor for same photo, return
    if (mediaInfo.media_id === mediaId) return;
    const result = await fetchPhotoInfo(mediaId);
    if (!result) return console.log("Missing info");
    setMediaInfo(result);
  };

  createMemo(() => {
    if (items()) {
      popoverDiv?.hidePopover(); // hide popover on scroll
      setEditCaption(true); // disable edit caption on scroll
    }
  });

  const displayTime = createMemo(() => {
    if (!mediaInfo) return "";
    const tm = formatTime(mediaInfo!.create_date);
    return `${tm.weekday} • ${tm.date} • ${tm.time}`;
  });
  return (
    <>
      <button popovertarget="information-popover" onClick={requestInfo}>
        {InfoButtonIcon()}
      </button>
      <div
        ref={(el) => (popoverDiv = el)}
        popover="auto"
        id="information-popover"
        class={styles.slideupContents}
        style={{ "max-width": "600px", width: "100%", "border-radius": 0 }}>
        <Show when={mediaInfo}>
          <div class={styles.mediaInfo}>
            <div class={styles.caption}>
              <input
                ref={(el) => (captionInputEl = el)}
                type="text"
                value={mediaInfo.caption || "Add a Caption"}
                disabled={editCaption()}
              />

              <button onClick={updateCaptionByInput}>{editCaption() ? GenerateButtonIcon() : DoneButtonIcon()}</button>
            </div>
            <div class={styles.dateInfo}>
              <div>{displayTime() || "Wednesday • Aug 8, 2012 • 2:55 PM {wrong}"}</div>
              <button>Adjust</button>
            </div>
            <p>{mediaInfo.file_name}</p>
            <div class={styles.infoOfMedia}>
              <div class={styles.cameraInfo}>
                <p>{(mediaInfo.make && mediaInfo.model) || "UNKNOWN CAMERA"}</p>
                <p>{mediaInfo.file_ext}</p>
              </div>
              <div>{mediaInfo.lens_model || "No lens infomation"}</div>
              <div>
                {mediaInfo.file_type !== "Photo" ? `${minValue(mediaInfo!)}P • ` : ""}
                {mediaInfo.megapixels ? `${mediaInfo.megapixels} MP • ` : ""}
                {mediaInfo.image_height ? `${mediaInfo.image_height} × ${mediaInfo.image_width}` : "Video"}
                {convertFileSize(mediaInfo.file_size) ? ` • ${convertFileSize(mediaInfo.file_size)}` : ""}
              </div>
              <div>
                {mediaInfo.frame_rate && <p>{mediaInfo.frame_rate} FPS</p>}
                {mediaInfo.video_duration && <p>{mediaInfo.video_duration}</p>}
                <p>Posted: {formatTime(mediaInfo!.upload_at).date}</p>
                <p>By {mediaInfo.user_name || "Unknown"}</p>
              </div>
            </div>
            <div class={styles.addLocation}>
              {mediaInfo.city ? `${mediaInfo.city}, ${mediaInfo.state}` : "Add a location ..."}
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

const minValue = (info: MediaInfo) => {
  if (!info) return 0;
  const w = info.image_width;
  const h = info.image_height;
  if (!w || !h) return 0;
  return Math.min(parseInt(w), parseInt(h));
};

const defaultInfo = {
  caption: "",
  create_date: "",
  file_ext: "",
  file_name: "",
  file_size: 0,
  file_type: "",
  city: "",
  state: "",
  make: "",
  media_id: 0,
  mime_type: "",
  model: "",
  orientation: "",
  software: "",
  upload_at: "",
  user_name: "",
  image_height: "",
  image_width: "",
  lens_model: "",
  megapixels: "",
  title: "",
  frame_rate: 0,
  video_duration: "",
  duration: 0,
};
