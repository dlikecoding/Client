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
  frame_rate: number;
}

interface ContextProps {
  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  openModal: ModalProps;
  setOpenModal: SetStoreFunction<ModalProps>;
  // resetModal: void;

  isEditing: Accessor<boolean>;
  setIsEditing: Setter<boolean>;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;
}

type ModalProps = {
  isOpen: boolean;
  activeIdx: number;
  startFocus: boolean;
  startRect?: DOMRect;
};

const defaultModal = {
  isOpen: false,
  activeIdx: -1,
  startFocus: false,
  startRect: undefined,
};

const ViewMediaContext = createContext<ContextProps>();

export const ViewMediaProvider = (props: any) => {
  const [displayMedias, setDisplayMedia] = createStore<MediaType[]>([]);

  const [openModal, setOpenModal] = createStore<ModalProps>(defaultModal);

  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  const [showImageOnly, setShowImageOnly] = createSignal<boolean>(false);

  createMemo(() => {
    if (!openModal.isOpen) setIsEditing(false);
  });

  // const resetModal = () => setOpenModal(defaultModal);

  return (
    <ViewMediaContext.Provider
      value={{
        displayMedias,
        setDisplayMedia,

        openModal,
        setOpenModal,
        // resetModal,

        isEditing,
        setIsEditing,

        showImageOnly,
        setShowImageOnly,
      }}>
      {props.children}
    </ViewMediaContext.Provider>
  );
};

export const useViewMediaContext = () => useContext(ViewMediaContext)!;
