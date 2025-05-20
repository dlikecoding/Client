import { useMediaContext } from "../../../../context/Medias";
import { MediaType, useViewMediaContext } from "../../../../context/ViewContext";
import { getMediaByIndex } from "../../../extents/helper/helper";
import { SaveButtonIcon } from "../../../svgIcons";

const LIMIT_MEMORY = 1 * 1024 * 1024 * 1024;
const LIMIT_NUMBER_OF_FILES = 10;

export const Save = () => {
  const { items } = useMediaContext();
  const { displayMedias } = useViewMediaContext();

  const saveButtonClick = async () => {
    if (!items()) return;

    const selectedMedias = getMediaByIndex(displayMedias, items());
    if (selectedMedias.length > LIMIT_NUMBER_OF_FILES)
      return alert(`Selected ${selectedMedias.length} over the limit. Please select ${LIMIT_NUMBER_OF_FILES} or less`);

    const shareFiles = await validateShareFiles(selectedMedias);
    if (!shareFiles || shareFiles.length < selectedMedias.length) return alert(`Some files not allow to download.`);

    await startSharingFiles(shareFiles);
  };

  return <button onClick={saveButtonClick}>{SaveButtonIcon()}</button>;
};

const startSharingFiles = async (shareFiles: File[]) => {
  try {
    if (navigator.canShare && navigator.canShare({ files: shareFiles })) {
      try {
        await navigator.share({ files: shareFiles });
      } catch (error: any) {
        if (!error.toString().includes("AbortError")) {
          console.log("Error sharing files:", error);
        }
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const validateShareFiles = async (medias: MediaType[]): Promise<File[]> => {
  // check if the total file_size of selected files are in the limited memory
  // loop and fetch all the files, and add to array of files.
  let totalSize = 0;
  const shareFileList: File[] = [];

  for (const eachMedia of medias) {
    const file = await fetchBlobFromSource(eachMedia.source_file);
    if (!file) continue;

    if (totalSize > LIMIT_MEMORY) {
      alert("Selected files over memory support. Please select file with smaller size.");
      return [];
    }

    shareFileList.push(file);
    totalSize += file.size;
  }

  return shareFileList;
};

const fetchBlobFromSource = async (sourcePath: string) => {
  const res = await fetch(sourcePath);
  if (!res.ok) return alert("An error occur while downloading files!");
  const blob = await res.blob();
  const fileName = sourcePath.split("/").at(-1);
  if (!fileName) return alert("File name invalid.");

  return new File([blob], fileName);
};
