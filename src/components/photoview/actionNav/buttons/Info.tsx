import styles from "./Buttons.module.css";

import { createMemo, createSignal, Show } from "solid-js";
import { useMediaContext } from "../../../../context/Medias";

import { DoneButtonIcon, GenerateButtonIcon, InfoButtonIcon } from "../../../svgIcons";
import { fetchPhotoInfo, forUpdateCaption } from "../../../extents/request/fetching";
import { useViewMediaContext } from "../../../../context/ViewContext";
import { convertFileSize, formatTime } from "../../../extents/helper/helper";

export type MediaInfo = {
  caption: string;
  create_date: string;
  file_ext: string;
  file_name: string;
  file_size: number;
  file_type: string;
  gps_latitude: string;
  gps_longitude: string;
  image_height: string;
  image_width: string;
  lens_model?: string;
  make?: string;
  media: string;
  megapixels?: string;
  mime_type: string;
  model?: string;
  orientation?: string;
  software?: string;
  upload_at: string;
  user_name?: string;
};

export const Info = () => {
  const { items } = useMediaContext();
  const { displayMedias } = useViewMediaContext();

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

      if (!captionInputEl || captionInputEl.value.trim().length === 0)
        return alert("Please enter new data to update this caption.");

      const res = await forUpdateCaption(mediaId, captionInputEl.value);
      if (res.ok) return;
      console.log(await res.json());
    }
  };

  const [mediaInfo, setMediaInfo] = createSignal<MediaInfo>();

  const requestInfo = async () => {
    const media = items().entries().next().value;
    if (!media) return alert("No valid photo/video to get info");
    const [index, mediaId] = media;

    if (index === undefined || !mediaId) return;

    // If request the same infor for same photo, return
    if (mediaInfo()?.media === mediaId) return;

    const fileType = displayMedias[index].file_type;
    if (!fileType) return;
    const result = await fetchPhotoInfo(mediaId, fileType);
    if (!result) return;
    setMediaInfo(result);
  };

  createMemo(() => {
    if (items()) {
      popoverDiv?.hidePopover(); // hide popover on scroll
      setEditCaption(true); // disable edit caption on scroll
    }
  });

  const displayTime = createMemo(() => {
    if (!mediaInfo()) return "";
    const tm = formatTime(mediaInfo()!.create_date);
    return `${tm.weekday} • ${tm.date} • ${tm.time}`;
  });
  return (
    <>
      <button popovertarget="info-contents" onClick={requestInfo}>
        {InfoButtonIcon()}
      </button>
      <div
        ref={(el) => (popoverDiv = el)}
        popover="auto"
        id="info-contents"
        class={styles.slideUp_contents}
        style={{ "max-width": "600px", width: "100%", "border-radius": 0 }}>
        <Show when={mediaInfo()}>
          <div class={styles.mediaInfo}>
            <div class={styles.caption}>
              <input
                ref={(el) => (captionInputEl = el)}
                type="text"
                value={mediaInfo()?.caption}
                disabled={editCaption()}
              />

              <button onClick={updateCaptionByInput}>{editCaption() ? GenerateButtonIcon() : DoneButtonIcon()}</button>
            </div>
            <div class={styles.dateInfo}>
              <div>{displayTime() || "Wednesday • Aug 8, 2012 • 2:55 PM {wrong}"}</div>
              <button>Adjust</button>
            </div>
            <p>{mediaInfo()?.file_name}</p>
            <div class={styles.infoOfMedia}>
              <div class={styles.cameraInfo}>
                <p>{(mediaInfo()?.make && mediaInfo()?.model) || "UNKNOWN CAMERA"}</p>
                <p>{mediaInfo()?.file_ext}</p>
              </div>
              <div>{mediaInfo()?.lens_model || "Canon RF24-70mm F2.8 L IS USM"}</div>
              <div>
                {mediaInfo()?.megapixels ? `${mediaInfo()?.megapixels} MP • ` : ""}
                {mediaInfo()?.image_height ? `${mediaInfo()?.image_height} × ${mediaInfo()?.image_width}` : "Video"}
                {convertFileSize(mediaInfo()?.file_size) ? ` • ${convertFileSize(mediaInfo()?.file_size)}` : ""}
              </div>
              <div>
                <p>Upload: {formatTime(mediaInfo()!.upload_at).date}</p>
                <p>From {mediaInfo()?.user_name || "Unknown"}</p>
              </div>
            </div>
            <div class={styles.addLocation}>Central Park, New York</div>
          </div>
        </Show>
      </div>
    </>
  );
};
