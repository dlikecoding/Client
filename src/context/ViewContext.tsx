import { Accessor, createContext, createSignal, Setter, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

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
  CameraType?: number;
}

interface ContextProps {
  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  openModal: Accessor<boolean>;
  setOpenModal: Setter<boolean>;
}

const ViewMediaContext = createContext<ContextProps>();

export const ViewMediaProvider = (props: any) => {
  const [displayMedias, setDisplayMedia] = createStore<MediaType[]>([]);

  const [openModal, setOpenModal] = createSignal<boolean>(false);

  return (
    <ViewMediaContext.Provider
      value={{
        displayMedias,
        setDisplayMedia,

        openModal,
        setOpenModal,
      }}>
      {props.children}
    </ViewMediaContext.Provider>
  );
};

export const useViewMediaContext = () => useContext(ViewMediaContext)!;
