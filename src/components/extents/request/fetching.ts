import { SearchQuery } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";
import { SetStoreFunction } from "solid-js/store";
import { ImportArgs, ProcessMesg } from "../../../pages/admin/Dashboard";
import { MediaInfo } from "../../photoview/actionNav/buttons/Info";

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
      throw new Error(`${res.status} ${response.error}`);

    default:
      alert(`Something went wrong. Please reload the app!`);
      throw new Error(`Something went wrong`);
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

export const fetchAddAlbum = async (mediaIds: string[], albumId?: number, albumTitle?: string) => {
  return await fetch(`/api/v1/album/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      mediaIds: mediaIds,
      albumId: albumId,
      albumTitle: albumTitle,
    }),
  });
};

export const fetchRemoveAlbum = async (mediaIds: string[], albumId?: number) => {
  return await fetch(`/api/v1/album/remove`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      mediaIds: mediaIds,
      albumId: albumId,
    }),
  });
};

export const forUpdating = async (mediaIds: string[], updateKey: string, updateValue: boolean) => {
  return await fetch(`/api/v1/medias`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      mediaIds: mediaIds,
      updateKey: updateKey,
      updateValue: updateValue,
    }),
  });
};

export const forDeleting = async (mediaIds: string[]) => {
  return await fetch(`/api/v1/medias`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ mediasToDel: mediaIds }),
  });
};
///////////////// For /api/v1/media //////////////////////////////////////////

export const forUpdateCaption = async (mediaId: string, caption: string) => {
  return await fetch(`/api/v1/media/caption`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      mediaId: mediaId,
      caption: caption,
    }),
  });
};

export const fetchPhotoInfo = async (mediaId: string, filterType: string): Promise<MediaInfo | undefined> => {
  try {
    return await fetchData<MediaInfo>(`/api/v1/media?id=${mediaId}&filterType=${filterType}`);
  } catch (error) {
    console.log("fetchPhotoInfo:", error);
  }
};
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
  const response = await fetch(`/api/v1/admin/${driveLocation}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      sourcePath: importArgs.path,
      aimode: importArgs.aimode,
    }),
  });
  await fetchStreamData(response, setMessages);
};

export const adminUpdateUserStatus = async (userEmail: string) => {
  return await fetch(`/api/v1/admin/changeStatus`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ userEmail: userEmail }),
  });
};

export const adminBackup = async () => await fetchData<any>(`/api/v1/admin/backup`);
export const adminRestore = async () => await fetchData<any>(`/api/v1/admin/restore`);

///////////////// For Searching //////////////////////////////////////////
export const fetchRefetch = async () => await fetchData<any>(`/api/v1/search/refreshView`);
export const fetchSearch = async (input: string) => {
  return await fetchData<any>(`/api/v1/search?keywords=${input}`);
};

// const fetchDatas = async <T>(url: string, options: RequestInit = {}): Promise<T | undefined> => {
//   const defaultHeaders = {
//     "Content-Type": "application/json",
//   };

//   const mergedOptions: RequestInit = {
//     ...options,
//     headers: { ...defaultHeaders, ...options.headers }, // Merge default and custom headers
//   };

//   const res = await fetch(url, mergedOptions);
//   return;
// };

// headers: {
//   "Content-Type": "multipart/form-data",
// },
