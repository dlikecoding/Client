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

export type Point = { x: number; y: number };

type MouseGestureStore = {
  start: Point | null;
  end: Point | null;
  action:
    | "singleClick"
    | "doubleClick"
    | "dragEnd"
    | "pinchZoomEnd"
    | "pinchZoomOut"
    | "pinchZoomIn"
    | "pinchZoom"
    | "longPress"
    | "longPressEnd"
    | "dragging"
    | "dragVertical"
    | "dragHorizontal"
    | "dragDownRelease"
    | "";
  status: boolean;
};

interface ContextProps {
  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  openModal: Accessor<boolean>;
  setOpenModal: Setter<boolean>;

  mouseGesture: MouseGestureStore;
  setMouseGesture: SetStoreFunction<MouseGestureStore>;

  isEditing: Accessor<boolean>;
  setIsEditing: Setter<boolean>;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;
}

const ViewMediaContext = createContext<ContextProps>();

export const ViewMediaProvider = (props: any) => {
  const [displayMedias, setDisplayMedia] = createStore<MediaType[]>([]);

  const [openModal, setOpenModal] = createSignal<boolean>(false);
  const [isEditing, setIsEditing] = createSignal<boolean>(false);

  const [showImageOnly, setShowImageOnly] = createSignal<boolean>(false);

  createMemo(() => {
    if (!openModal()) setIsEditing(false);
  });

  const [mouseGesture, setMouseGesture] = createStore<MouseGestureStore>(defaultMouse);

  return (
    <ViewMediaContext.Provider
      value={{
        displayMedias,
        setDisplayMedia,

        openModal,
        setOpenModal,

        mouseGesture,
        setMouseGesture,

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

export const defaultMouse = {
  start: null,
  end: null,
  action: "",
  status: false,
} as const satisfies MouseGestureStore;
