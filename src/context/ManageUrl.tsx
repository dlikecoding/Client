import { useLocation } from "@solidjs/router";
import { createContext, useContext, JSX, createMemo } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

const LOCALSTORAGE_VIEW_KEY = "zoomAspect";
export const MIN_ZOOM_LEVEL = 1;
export const MAX_ZOOM_LEVEL = 5;
export const ZOOM_SENSITIVITY = 0.3;

export type SearchQuery = {
  year?: number;
  month?: number;

  filterType?: "Photo" | "Live" | "Video";
  filterDevice?: number;

  searchKey?: string;

  favorite?: number;
  hidden?: number;
  deleted?: number;
  duplicate?: number;

  albumId?: number;
  locationId?: number;

  sortKey: "file_size" | "create_date" | "upload_at";
  sortOrder: 0 | 1;
};

export type ZoomAndAspect = {
  nColumn: number;
  objectFit: boolean;

  modalObjFit: boolean;
  showThumb: boolean;

  zoomLevel: number;
  autoplay: boolean;
};

type StoreLastVisit = { url: string; params: SearchQuery };

interface ManageURLContextProviderProps {
  children: JSX.Element;
}

type ManageURIContextType = {
  params: SearchQuery;
  updatePageKey: <T extends keyof SearchQuery>(key: T, value: SearchQuery[T]) => void;
  updatePage: (data: Partial<SearchQuery>) => void;
  resetParams: () => void;
  resetLibrary: () => void;

  view: ZoomAndAspect;
  setView: SetStoreFunction<ZoomAndAspect>;
};

const ManageURLContext = createContext<ManageURIContextType>();

export const ManageURLContextProvider = (props: ManageURLContextProviderProps) => {
  const location = useLocation();
  const pageName = createMemo(() => location.pathname.split("/")[1]);

  const localSearchQuery = loadLocalStorage(pageName());
  const localZoomAndAspect = loadLocalStorage(LOCALSTORAGE_VIEW_KEY);

  const loadParams = localSearchQuery ? JSON.parse(localSearchQuery).params : defaultParams();
  const [params, setParams] = createStore<SearchQuery>(loadParams);

  const [view, setView] = createStore(
    JSON.parse(localZoomAndAspect!) || {
      nColumn: 3,
      objectFit: true,

      modalObjFit: true,
      showThumb: true,

      zoomLevel: 1,

      autoplay: true,
    }
  );

  // Updates a specific parameter in the query object by key
  const updatePageKey = <T extends keyof SearchQuery>(key: T, value: SearchQuery[T]) => setParams({ [key]: value });
  // Updates multiple parameters in the query object at once
  const updatePage = (data: Partial<SearchQuery>) => setParams((prevState) => ({ ...prevState, ...data }));

  // Resets all parameters in the query object to their default values
  const resetParams = () => {
    setParams(defaultParams());
  };
  const resetLibrary = () => {
    setParams((prevState) => ({ ...prevState, ...resetFilter() }));
  }; // For Library only (wo reset year, month)

  createMemo(() => saveLocalStorage(LOCALSTORAGE_VIEW_KEY, view));

  createMemo(() => {
    const storagePage: StoreLastVisit = { url: location.pathname, params: params };
    saveLocalStorage(pageName(), storagePage);
  });

  return (
    <ManageURLContext.Provider value={{ params, updatePageKey, updatePage, resetParams, resetLibrary, view, setView }}>
      {props.children}
    </ManageURLContext.Provider>
  );
};

export const useManageURLContext = () => {
  const ctx = useContext(ManageURLContext);
  if (!ctx) {
    throw new Error("useManageURLContext must be used within ManageURLContextProvider");
  }
  return ctx;
};

const loadLocalStorage = (key: string) => localStorage.getItem(key);
const saveLocalStorage = (key: string, data: StoreLastVisit | string) =>
  localStorage.setItem(key, JSON.stringify(data));

const resetFilter = () => ({
  filterType: undefined,
  filterDevice: undefined,

  searchKey: undefined,

  favorite: undefined,
  deleted: undefined,
  hidden: undefined,
  duplicate: undefined,
});

const defaultParams = (): SearchQuery => ({
  year: undefined,
  month: undefined,

  sortKey: "create_date",
  sortOrder: 0, // Valid now
  ...resetFilter,
});

// const defaultPage: StoreLastVisit = {
//   url: "",
//   params: defaultParams,
// };
