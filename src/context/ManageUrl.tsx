import { createContext, useContext, JSX, createEffect } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export type SearchQuery = {
  year: string;
  month?: string;
  filterType?: string;
  filterDevice?: number;
  filterObject?: string;
  sortKey?: string;
  sortOrder?: number;

  favorite?: number;
  hidden?: number;
  deleted?: number;
  duplicate?: number;

  albumId?: string;
};

export type ZoomAndAspect = {
  nColumn: number;
  objectFit: boolean;
};

interface ManageURLContextProviderProps {
  children: JSX.Element;
}

type ManageURIContextType = {
  params: SearchQuery;
  updatePageKey: <T extends keyof SearchQuery>(key: T, value: SearchQuery[T]) => void;
  updatePage: (data: Partial<SearchQuery>) => void;
  resetParams: () => void;

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

  createEffect(() => {
    localStorage.setItem("SearchQuery", JSON.stringify(params));
  });

  createEffect(() => {
    localStorage.setItem("ZoomAndAspect", JSON.stringify(view));
  });

  return (
    <ManageURLContext.Provider value={{ params, updatePageKey, updatePage, resetParams, view, setView }}>
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

export const defaultParams: SearchQuery = {
  year: "",
  month: undefined,
  filterType: undefined,
  filterDevice: undefined,
  filterObject: undefined,
  sortKey: undefined,
  sortOrder: undefined,

  favorite: undefined,
  deleted: undefined,
  hidden: undefined,
  duplicate: undefined,
};
