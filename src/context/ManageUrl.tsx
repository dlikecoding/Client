import { createContext, useContext, JSX, createMemo } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export type SearchQuery = {
  year?: number;
  month?: number;

  filterType?: "Photo" | "Live" | "Video";
  filterDevice?: number;

  favorite?: number;
  hidden?: number;
  deleted?: number;
  duplicate?: number;

  albumId?: number;

  sortKey: "file_size" | "create_date" | "upload_at";
  sortOrder: 0 | 1;
};

export type ZoomAndAspect = {
  nColumn: number;
  objectFit: boolean;

  modalObjFit: boolean;
};

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
  const localSearchQuery = localStorage.getItem("SearchQuery");
  const localZoomAndAspect = localStorage.getItem("ZoomAndAspect");

  const [params, setParams] = createStore<SearchQuery>(JSON.parse(localSearchQuery!) || { ...defaultParams });

  const [view, setView] = createStore(
    JSON.parse(localZoomAndAspect!) || {
      nColumn: 3,
      objectFit: true,

      modalObjFit: true,
    }
  );

  // Updates a specific parameter in the query object by key
  const updatePageKey = <T extends keyof SearchQuery>(key: T, value: SearchQuery[T]) => {
    setParams({ [key]: value });
  };

  // Updates multiple parameters in the query object at once
  const updatePage = (data: Partial<SearchQuery>) => {
    setParams((prevState) => ({ ...prevState, ...data }));
  };

  // Resets all parameters in the query object to their default values
  const resetParams = () => {
    setParams({ ...defaultParams });
  };

  // Resets all parameters in the query object to their default values
  const resetLibrary = () => {
    setParams((prevState) => ({ ...prevState, ...resetFilter }));
  };

  createMemo(() => {
    localStorage.setItem("SearchQuery", JSON.stringify(params));
  });

  createMemo(() => {
    localStorage.setItem("ZoomAndAspect", JSON.stringify(view));
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

const resetFilter = {
  filterType: undefined,
  filterDevice: undefined,

  // filterObject: undefined,

  favorite: undefined,
  deleted: undefined,
  hidden: undefined,
  duplicate: undefined,
};

export const defaultParams: SearchQuery = {
  year: undefined,
  month: undefined,

  sortKey: "create_date",
  sortOrder: 0, // Valid now
  ...resetFilter,
};
