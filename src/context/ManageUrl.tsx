import { createContext, useContext, JSX } from "solid-js";
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
};

export type ZoomAndAspect = {
  nColumn: number;
  objectFit: boolean;
};

export interface MediaType {
  media_id: string;
  SourceFile: string;
  ThumbPath: string;
  timeFormat: string;
  isFavorite: boolean;
  FileType: string;
  duration?: string;
  Title: string;
  FileName: string;
  FileSize: number;
  CreateDate: string;
  UploadAt: string;
  isHidden: number;
  isDeleted: number;
  CameraType?: number;
}

interface ManageURLContextProviderProps {
  children: JSX.Element;
}

type ManageURIContextType = {
  params: SearchQuery;
  updatePageKey: <T extends keyof SearchQuery>(key: T, value: SearchQuery[T]) => void;
  updatePage: (data: Partial<SearchQuery>) => void;
  resetParams: () => void;

  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  view: ZoomAndAspect;
  setView: SetStoreFunction<ZoomAndAspect>;
};

const ManageURLContext = createContext<ManageURIContextType>();

export const ManageURLContextProvider = (props: ManageURLContextProviderProps) => {
  const [params, setParams] = createStore<SearchQuery>({ ...defaultParams });

  const [view, setView] = createStore({
    nColumn: 3,
    objectFit: true,
  });

  const [displayMedias, setDisplayMedia] = createStore<any[]>([]);

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

  return (
    <ManageURLContext.Provider
      value={{ params, updatePageKey, updatePage, resetParams, view, setView, displayMedias, setDisplayMedia }}>
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
