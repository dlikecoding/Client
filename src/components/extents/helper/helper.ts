import { MediaType } from "../../../context/ViewContext";

const _BINARY_UNIT = 1024;
const DECIMAL_UNIT = 1000;

/**
 * Scrolls to the specified element using its data-modalid attribute.
 * @param modalid - Modal id unique identifier of the target element.
 */
export const scrollToModalElement = (modalid: number, behavior: ScrollBehavior = "instant"): void => {
  scrollIntoViewFc("modalid", modalid, "center", behavior);
};

/**
 * Scrolls to the specified element using its data-modalid attribute.
 * @param id - ContextView id unique identifier of the target element.
 */
export const scrollToViewElement = (mediaId: number, block: ScrollLogicalPosition = "center"): void => {
  scrollIntoViewFc("id", mediaId, block);
};

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param classType data-X this X is a dataset name
 * @param dataID dataID is data in that dataset
 * @returns HTMLDivElement
 */
export const getElementBySelector = (classType: string, dataID: number) => {
  return document.querySelector<HTMLElement>(`[data-${classType}="${dataID}"]`);
};

export const scrollIntoViewFc = (
  classType: string,
  dataID: number,
  block: ScrollLogicalPosition = "center",
  behavior: ScrollBehavior = "instant"
): void => {
  const targetEl = getElementBySelector(classType, dataID);
  if (targetEl) targetEl.scrollIntoView({ behavior: behavior, block: block });
};

export const sleepFunc = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getKeyByItem = (items: Map<number, number>) => {
  const kv = items.entries().next().value;
  if (!kv) return null;
  return { idx: kv[0], eId: kv[1] };
};

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
  const i = Math.floor(Math.log(bytes) / Math.log(DECIMAL_UNIT));

  return Math.round(100 * (bytes / Math.pow(DECIMAL_UNIT, i))) / 100 + " " + sizes[i];
};

export const safePlayVideo = async (video: HTMLVideoElement): Promise<void> => {
  try {
    if (video.paused) await video.play();
  } catch (error) {
    if (!video.paused) video.pause();
    console.log(error);
  }
};

export const numberToMonth = (n: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return n >= 1 && n <= 12 ? months[n - 1] : "Invalid month number";
};
