import { createContext, useContext, JSX } from "solid-js";
import { createStore } from "solid-js/store";

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
  isYear: () => boolean;
  isMonth: () => boolean;
  isAll: () => boolean;

  view: ZoomAndAspect;
  setView: any;
};

const ManageURLContext = createContext<ManageURIContextType>();

export const ManageURLContextProvider = (props: ManageURLContextProviderProps) => {
  const [params, setParams] = createStore<SearchQuery>({ ...defaultParams });

  const [view, setView] = createStore({
    nColumn: 3,
    objectFit: true,
  });

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

  const isYear = () => !params.year && !params.month;
  const isMonth = () => !!params.year && !params.month;
  const isAll = () => !!params.year && !!params.month;

  return (
    <ManageURLContext.Provider
      value={{ params, updatePageKey, updatePage, resetParams, isYear, isMonth, isAll, view, setView }}>
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
