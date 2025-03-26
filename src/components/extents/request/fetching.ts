import { SearchQuery } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";

const buildQueryString = (params: object): string =>
  Object.entries(params)
    .filter(([_, value]) => value != null && value !== "") // value != null && value !== ""
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

const errorHandler = async (res: Response) => {
  switch (res.status) {
    case 401:
      return window.location.replace("/login"); // alert("Unauthoried, please signin to your account!");

    case 403:
      return window.location.replace("/");

    case 400:
      const response = await res.json();
      alert(`${response.error}, please try again!`);
      throw new Error(`${res.status} ${response.error}`);

    default:
      throw new Error(`Something went wrong`);
  }
};

const fetchData = async <T>(url: string): Promise<T | undefined> => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
  });

  if (res.ok) return await res.json();
  errorHandler(res);
};

export const fetchMediaYears = async () => fetchData<any[]>(`/api/v1/medias`);
export const fetchMediaMonths = async (year: string) => fetchData<any[]>(`/api/v1/medias?year=${year}`);

export const fetchMedias = (queries: SearchQuery, pageNumber: number = 0) => {
  const queryString = buildQueryString({ ...queries, pageNumber });
  return fetchData<MediaType[]>(`/api/v1/stream?${queryString}`);
};

export const fetchListOfDevices = () => fetchData<any[]>(`/api/v1/medias/devices`);

export const fetchStatistic = async () => {
  const result = await fetchData<any[]>(`/api/v1/medias/statistic`);
  return result ? result[0] : null;
};

export const fetchAlbum = () => fetchData<any[]>(`/api/v1/album`);

export const fetchAlbumUpdating = async (mediaIds: string[], albumId?: number, albumTitle?: string) => {
  return await fetch(`/api/v1/album/add`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mediaIds: mediaIds,
      albumId: albumId,
      albumTitle: albumTitle,
    }),
  });
};

export const forUpdating = async (mediaIds: string[], updateKey: string, updateValue: boolean) => {
  return await fetch(`/api/v1/medias`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediasToDel: mediaIds }),
  });
};

///////////////// For ADMIN //////////////////////////////////////////
export const adminFetchUsers = async () => fetchData<any[]>(`/api/v1/admin/dashboard`);

export const adminIntegrateData = async () => fetchData<any[]>(`/api/v1/admin/import`);

export const adminUpdateUserStatus = async (userEmail: string) => {
  return await fetch(`/api/v1/admin/changeStatus`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: userEmail }),
  });
};

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
