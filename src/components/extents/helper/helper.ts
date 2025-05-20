import { Accessor } from "solid-js";
import { MediaType } from "../../../context/ViewContext";

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param classType data-X this X is a dataset name
 * @param dataID dataID is data in that dataset
 * @returns HTMLDivElement
 */
export const getElementBySelector = (classType: string, dataID: number) => {
  return document.querySelector<HTMLElement>(`[data-${classType}="${dataID}"]`);
};

export const scrollIntoViewFc = (classType: string, dataID: number): void => {
  const targetEl = getElementBySelector(classType, dataID);
  if (targetEl) targetEl.scrollIntoView({ behavior: "instant", block: "center" });
};

// export const sleepFunc = (ms: number): Promise<void> => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

export const getMediaByIndex = (displayMedias: MediaType[], items: Map<number, number>): MediaType[] => {
  return Array.from(items.keys().map((index) => displayMedias[index]));
};

export const formatTime = (timestamp: string): { weekday: string; date: string; time: string } => {
  if (!timestamp) return { weekday: "", date: "", time: "" };
  const date = new Date(timestamp);

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
};

export const convertFileSize = (bytes: number | undefined): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + " " + sizes[i];
};

export const safePlayVideo = async (video: HTMLVideoElement): Promise<void> => {
  try {
    if (video.paused) await video.play();
  } catch (error) {
    if (!video.paused) video.pause();
    console.log(error);
  }
};
