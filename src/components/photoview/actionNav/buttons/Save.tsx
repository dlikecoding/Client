import { createSignal, Setter, Show } from "solid-js";
import { useMediaContext } from "../../../../context/Medias";
import { MediaType, useViewMediaContext } from "../../../../context/ViewContext";
import Loading from "../../../extents/Loading";
import { forDownloading } from "../../../extents/request/fetching";
import { SaveButtonIcon } from "../../../svgIcons";

const LIMIT_MEMORY = 1 * 1024 ** 3; // 1GB
const LIMIT_NUMBER_OF_FILES = 10;
const LIMIT_SHARE_MEMORY = 50 * 1024 ** 2; // 100MB

export const Save = () => {
  const { items, setItems, setIsSelected } = useMediaContext();
  const { openModal, displayMedias } = useViewMediaContext();

  const [isLoading, setIsLoading] = createSignal(false);

  const saveButtonClick = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    if (!items() || !items().size) return;

    const validMedias = validateSelection(items(), displayMedias);

    if (!validMedias) return;

    // In case when only 1 file. save to the file.

    // valided & canshare (size is 50MB or less), use share file
    if (validMedias.canShare) {
      const shareStatus = await startSharingFiles(validMedias.medias, setIsLoading);
      if (!shareStatus) return; // Prevent clear all selected files
    } else {
      // download as a zip file.
      setIsLoading(true);

      await downloadBlob(items());
      // await streamAndDownloadZip(items());

      setIsLoading(false);
    }

    if (openModal()) return;
    setIsSelected(false);
    setItems(new Map());
  };

  return (
    <>
      <button onClick={(e) => saveButtonClick(e)}>{SaveButtonIcon()}</button>
      <Show when={isLoading()}>
        <Loading />
      </Show>
    </>
  );
};

const validateSelection = (
  items: Map<number, number>,
  displayMedias: MediaType[]
): { medias: MediaType[]; canShare: boolean } | null => {
  const count = items.size;
  if (count > LIMIT_NUMBER_OF_FILES) {
    alert(`You can only select up to ${LIMIT_NUMBER_OF_FILES} files.`);
    return null;
  }

  let totalSize = 0;
  const medias: MediaType[] = [];

  for (const [index, _mediaId] of items) {
    const media: MediaType = displayMedias[index];

    totalSize += Number(media.file_size);

    if (totalSize > LIMIT_MEMORY) {
      alert(`Selected files exceeds 1GB limit.`);
      return null;
    }

    medias.push(media);
  }

  return { medias, canShare: totalSize <= LIMIT_SHARE_MEMORY };
};

const startSharingFiles = async (medias: MediaType[], setIsLoading: Setter<boolean>) => {
  const files: File[] = [];

  setIsLoading(true);
  for (const eachMedia of medias) {
    const file = await fetchFiles(eachMedia.source_file);
    if (file) files.push(file);
  }

  setIsLoading(false);
  try {
    if (navigator.canShare && navigator.canShare({ files: files })) {
      await navigator.share({ files: files });
      return true;
    }
  } catch (error) {
    console.log(`Error sharing files: ${error}`);
    return false;
  }
};

const fetchFiles = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });

    if (!response.ok) throw new Error(`Failed fetch: ${url}`);

    const blob = await response.blob();
    const fileName = url.split("/").pop() || "file";
    return new File([blob], fileName);
  } catch (error) {
    console.error("Fetch file error:", error);
    return null;
  }
};

/**
 * Utility to trigger a download of a Blob as a file.
 * Automatically cleans up after use.
 */
const downloadBlob = async (items: Map<number, number>) => {
  const listOfIds = new Set(items.values());
  const response = await forDownloading([...listOfIds]);

  if (!response.ok) return alert("Failed to download photos/video.");

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "PhotoX.zip";
  a.rel = "noopener";
  a.target = "_blank";
  a.style.display = "none"; // Optional: extra safety
  document.body.appendChild(a); // Append to body for Firefox support
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// import streamSaver from "streamsaver";

// const streamAndDownloadZip = async (items: Map<number, number>) => {
//   try {
//     const listOfIds = new Set(items.values());
//     const response = await forDownloading([...listOfIds]);

//     if (!response.ok || !response.body) throw new Error("Zip download failed.");

//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker.register("./src/assets/js/sw.js");
//     }

//     const fileStream = streamSaver.createWriteStream("PhotoX.zip");
//     const readableStream = response.body;

//     if (window.WritableStream && readableStream.pipeTo) {
//       await readableStream.pipeTo(fileStream);
//     } else {
//       // Fallback for browsers without native pipeTo support
//       const writer = fileStream.getWriter();
//       const reader = readableStream.getReader();
//       const pump = async () => {
//         const { value, done } = await reader.read();
//         if (done) return writer.close();
//         await writer.write(value);
//         await pump();
//       };
//       await pump();
//     }
//   } catch (error) {
//     alert("An error occurred during download.");
//     console.error("Streaming error:", error);
//   }
// };
