import { Accessor, createContext, createMemo, createSignal, Setter, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export interface MediaType {
  media_id: number;
  thumb_path: string;
  source_file: string;
  create_month: number;
  create_year: number;
  video_duration?: string;
  mime_type: string;
  file_type: string;
  favorite: boolean;
  file_size: number;
  upload_at: string;
  create_date: string;

  duration: number;
  selected_frame: number;
}

interface ContextProps {
  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  openModal: Accessor<boolean>;
  setOpenModal: Setter<boolean>;

  isEditing: Accessor<boolean>;
  setIsEditing: Setter<boolean>;
}

const ViewMediaContext = createContext<ContextProps>();

export const ViewMediaProvider = (props: any) => {
  const [displayMedias, setDisplayMedia] = createStore<MediaType[]>([]);

  const [openModal, setOpenModal] = createSignal<boolean>(false);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  createMemo(() => {
    if (!openModal()) setIsEditing(false);
  });

  return (
    <ViewMediaContext.Provider
      value={{
        displayMedias,
        setDisplayMedia,

        openModal,
        setOpenModal,

        isEditing,
        setIsEditing,
      }}>
      {props.children}
    </ViewMediaContext.Provider>
  );
};

export const useViewMediaContext = () => useContext(ViewMediaContext)!;
