import { SearchQuery } from "../../../context/ManageUrl";

const buildQueryString = (params: object): string =>
  Object.entries(params)
    .filter(([_, value]) => value != null && value !== "") // value != null && value !== ""
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

const fetchData = async <T>(url: string, options: RequestInit = {}): Promise<T | null> => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }, // Merge default and custom headers
  };

  const res = await fetch(url, mergedOptions);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return await res.json();
};

export const fetchMediaYears = async () => fetchData<any[]>(`/api/v1/medias`);
export const fetchMediaMonths = async (year: string) => fetchData<any[]>(`/api/v1/medias?year=${year}`);
// =>
// fetchData<any[]>(`/api/v1/medias?year=${year}&month=${month}`);

export const fetchMedias = (queries: SearchQuery, pageNumber: number = 0) => {
  const queryString = buildQueryString({ ...queries, pageNumber });
  return fetchData<any[]>(`/api/v1/stream?${queryString}`);
};

export const fetchPhotoInfo = async (mediaId: string) => {
  return fetchData<any[]>(`/api/v1/media/${mediaId}`);
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mediasToDel: mediaIds }),
  });
};
