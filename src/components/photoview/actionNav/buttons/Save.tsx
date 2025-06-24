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

  const saveButtonClick = async () => {
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
      const listOfIds = new Set(items().values());
      const response = await forDownloading([...listOfIds]);

      if (!response.ok) {
        throw new Error("Failed to download zip.");
      }

      const blob = await response.blob();
      downloadBlob(blob, "PhotoX.zip");

      setIsLoading(false);
    }

    if (openModal()) return;
    setIsSelected(false);
    setItems(new Map());
  };

  return (
    <>
      <button onClick={saveButtonClick}>{SaveButtonIcon()}</button>
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
    const file = await fetchBlobFromSource(eachMedia.source_file);
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

const fetchBlobFromSource = async (sourcePath: string) => {
  try {
    const res = await fetch(sourcePath);
    if (!res.ok) {
      alert(`Failed to fetch file from source: ${sourcePath}`);
      return null;
    }
    const blob = await res.blob();
    const fileName = sourcePath.split("/").pop();
    if (!fileName) {
      alert("Invalid file name extracted.");
      return null;
    }

    return new File([blob], fileName);
  } catch (error) {
    console.error("Network or processing error:", error);
    alert(`An unexpected error occurred while processing files.`);
    return null;
  }
};

/**
 * Utility to trigger a download of a Blob as a file.
 * Automatically cleans up after use.
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    // Clean up DOM and revoke blob URL after short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
      const existingAnchor = document.querySelector(`a[href="${url}"]`);
      if (existingAnchor) existingAnchor.remove();
    }, 1000);
  }
};
