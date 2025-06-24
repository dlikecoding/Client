import { SearchQuery } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";
import { SetStoreFunction } from "solid-js/store";
import { ImportArgs, ProcessMesg } from "../../../pages/admin/Dashboard";
import { MediaInfo } from "../../photoview/actionNav/buttons/Info";
import { LoadLogs } from "../../../pages/admin/Logged";

const buildQueryString = (params: object): string =>
  Object.entries(params)
    .filter(([_, value]) => value != null && value !== "") // value != null && value !== ""
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

const errorHandler = async (res: Response) => {
  switch (res.status) {
    case 401:
      return window.location.replace("/login"); // alert("Unauthoried, please signin to your account!");

    case 400:
      const response = await res.json();
      alert(`${response.error}, please try again!`);
      return [];

    default:
      alert(`Something went wrong. Please reload the app!`);
      return "";
  }
};

const fetchData = async <T>(url: string): Promise<T | undefined> => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
  });

  try {
    if (res.ok) return await res.json();
    errorHandler(res);
  } catch (error) {
    console.log(error);
  }
};

export const reqMethodHelper = async (url: string, method: string, body: Object) =>
  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

export const fetchMediaYears = async () => await fetchData<any[]>(`/api/v1/medias`);

export const fetchMedias = (queries: SearchQuery, pageNumber: number = 0) => {
  const queryString = buildQueryString({ ...queries, pageNumber });
  return fetchData<MediaType[]>(`/api/v1/stream?${queryString}`);
};

export const fetchListOfDevices = async () => await fetchData<any[]>(`/api/v1/medias/devices`);

export const fetchStatistic = async () => {
  const result = await fetchData<any[]>(`/api/v1/album/statistic`);
  return result ? result[0] : null;
};

export const fetchAlbum = async () => await fetchData<any[]>(`/api/v1/album`);

export const fetchAddAlbum = async (mediaIds: number[], albumId?: number, albumTitle?: string) =>
  await reqMethodHelper("/api/v1/album/add", "PUT", {
    mediaIds: mediaIds,
    albumId: albumId,
    albumTitle: albumTitle,
  });

export const fetchRemoveAlbum = async (mediaIds: number[], albumId?: number) =>
  await reqMethodHelper("/api/v1/album/remove", "PUT", {
    mediaIds: mediaIds,
    albumId: albumId,
  });

export const forUpdating = async (mediaIds: number[], updateKey: string, updateValue: boolean) =>
  await reqMethodHelper("/api/v1/medias", "PUT", {
    mediaIds: mediaIds,
    updateKey: updateKey,
    updateValue: updateValue,
  });

export const forDeleting = async (mediaIds: number[]) =>
  await reqMethodHelper("/api/v1/medias", "DELETE", {
    mediaIds: mediaIds,
  });

export const forDownloading = async (mediaIds: number[]) =>
  await reqMethodHelper("/api/v1/medias/download", "POST", {
    mediaIds: mediaIds,
  });

export const forDeleteAllInRecently = async () => await fetchData(`/api/v1/medias/recently`);

///////////////// For /api/v1/media //////////////////////////////////////////
export const forUpdateCaption = async (mediaId: number, caption: string) =>
  await reqMethodHelper("/api/v1/media/caption", "PUT", {
    mediaId: mediaId,
    caption: caption,
  });

export const fetchNewFrameLivePhoto = async (mediaId: number, framePos: number) =>
  await reqMethodHelper("/api/v1/media/live-frame", "PUT", {
    mediaId: mediaId,
    framePos: framePos,
  });

export const fetchPhotoInfo = async (mediaId: number): Promise<MediaInfo | undefined> =>
  await fetchData<MediaInfo>(`/api/v1/media?id=${mediaId}`);

///////////////// For Uploading //////////////////////////////////////////
const fetchStreamData = async (response: Response, setMessages: SetStoreFunction<ProcessMesg>) => {
  try {
    if (!response.ok) {
      const errorMgs = await response.json();
      return setMessages("mesg", errorMgs.error);
    }

    if (!response.body) throw new Error("Stream response body is empty");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      setMessages("mesg", chunk);
    }
  } catch (error) {
    console.log("Error import/upload media", error);
    setMessages("mesg", `⚠️ ${error}`);
  } finally {
    setMessages("isRunning", false);
  }
};

export const forUploadFiles = async (setMessages: SetStoreFunction<ProcessMesg>, formData: FormData, aimode: 0 | 1) => {
  const response = await fetch(`/api/v1/upload?aimode=${aimode}`, {
    method: "POST",
    credentials: "same-origin",
    body: formData,
  });
  await fetchStreamData(response, setMessages);
};
///////////////// For ADMIN //////////////////////////////////////////
export const adminFetchAdminDashboard = async () => await fetchData<any>(`/api/v1/admin/dashboard`);

export const adminIntegrateData = async (
  setMessages: SetStoreFunction<ProcessMesg>,
  importArgs: ImportArgs,
  driveLocation: "internal" | "external"
) => {
  const response = await reqMethodHelper(`/api/v1/admin/${driveLocation}`, "POST", {
    sourcePath: importArgs.path,
    aimode: importArgs.aimode,
  });
  await fetchStreamData(response, setMessages);
};

export const adminUpdateUserStatus = async (userEmail: string) =>
  await reqMethodHelper("/api/v1/admin/changeStatus", "PUT", { userEmail: userEmail });

export const adminBackup = async () => await fetchData<any>(`/api/v1/admin/backup`);
export const adminRestore = async () => await fetchData<any>(`/api/v1/admin/restore`);

export const adminOptimizeStorage = async (setMessages: SetStoreFunction<ProcessMesg>) => {
  const res = await fetch(`/api/v1/admin/storageOptimize`, {
    method: "GET",
    credentials: "same-origin",
  });
  await fetchStreamData(res, setMessages);
};

export const adminReindex = async (setMessages: SetStoreFunction<ProcessMesg>) => {
  const res = await fetch(`/api/v1/admin/reindex`, {
    method: "GET",
    credentials: "same-origin",
  });
  await fetchStreamData(res, setMessages);
};

///////////////////////// System logs ////////////////////////////////////////////////////////////
export const fetchAllLogs = async () => await fetchData<LoadLogs>(`/api/v1/admin/all-logs`);
export const fetchDeleteLogs = async (ids: number[], logType: "system" | "user" = "system") =>
  await reqMethodHelper("/api/v1/admin/all-logs", "DELETE", { ids: ids, logType: logType });

///////////////// For Searching //////////////////////////////////////////
export const fetchRefetch = async () => await fetchData<any>(`/api/v1/search/refreshView`);
export const fetchSearch = async (input: string) => await fetchData<any>(`/api/v1/search?keywords=${input}`);

///////////////// For Setting //////////////////////////////////////////
export const fetchCapacity = async () => await fetchData<any>(`/api/v1/user/serverCapacity`);
