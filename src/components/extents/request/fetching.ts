import { SearchQuery } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";
import { SetStoreFunction } from "solid-js/store";
import { ImportArgs, ProcessMesg } from "../../../pages/admin/Dashboard";

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
      throw new Error(`${res.status} ${response.error}`);

    default:
      alert(`Something went wrong`);
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

///////////////// For Uploading //////////////////////////////////////////
const fetchStreamData = async (response: Response, setMessages: SetStoreFunction<ProcessMesg>) => {
  try {
    if (!response.ok) {
      const errorMgs = await response.json();

      return response.status === 401
        ? window.location.replace("/login")
        : setMessages({ status: true, mesg: errorMgs.error });
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

    setMessages("status", true);
  } catch (error) {
    console.log("Error import media", error);

    setMessages("mesg", `⚠️ Error: ${error}`);
    setMessages("status", true);
  }
};

export const forUploadFiles = async (setMessages: SetStoreFunction<ProcessMesg>, formData: FormData) => {
  const response = await fetch("/api/v1/upload", {
    method: "POST",
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    credentials: "same-origin",
    body: formData,
  });
  await fetchStreamData(response, setMessages);
};
///////////////// For ADMIN //////////////////////////////////////////
export const adminFetchAdminDashboard = async () => await fetchData<any>(`/api/v1/admin/dashboard`);

export const adminIntegrateData = async (setMessages: SetStoreFunction<ProcessMesg>, importArgs: ImportArgs) => {
  const response = await fetch("/api/v1/admin/import", {
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

///////////////// For Searching //////////////////////////////////////////
export const fetchSearch = async (input: string) => await fetchData<any>(`/api/v1/search?keyword=${input}`);

// export const fetchPhotoInfo = async (mediaId: string) => {
//   return fetchData<any[]>(`/api/v1/media/${mediaId}`);
// };

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
