import { createContext, createMemo, useContext } from "solid-js";
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
  start: Point;
  end: Point;
  drag: boolean;
  action: "dragEnd" | "pinchZoom" | "dragging" | "";
  status: boolean;
};

export type ModalProps = {
  isOpen: boolean;
  activeIdx: number;
  startFocus: boolean;
  startRect?: DOMRect;

  isEditing: boolean;
  showImage: boolean;
};

interface ContextProps {
  displayMedias: MediaType[];
  setDisplayMedia: SetStoreFunction<MediaType[]>;

  openModal: ModalProps;
  setOpenModal: SetStoreFunction<ModalProps>;

  mouseGesture: MouseGestureStore;
  setMouseGesture: SetStoreFunction<MouseGestureStore>;

  translate: Point;
  setTranslate: SetStoreFunction<Point>;

  resetMouse: () => void;
  resetModal: () => void;
}

const ViewMediaContext = createContext<ContextProps>();

export const ViewMediaProvider = (props: any) => {
  const [displayMedias, setDisplayMedia] = createStore<MediaType[]>([]);

  const [openModal, setOpenModal] = createStore<ModalProps>(defaultModal());

  const resetMouse = () => {
    setMouseGesture(defaultMouse());
  };
  const resetModal = () => {
    setOpenModal(defaultModal());
  };

  // const { view } = useManageURLContext();
  // createMemo(() => {
  //   if (view.zoomLevel === 1) setTranslate(defaultPoint());
  // });

  createMemo(() => {
    if (!openModal.isOpen) setOpenModal("isEditing", false);
  });

  createMemo(() => {
    if (openModal.isEditing) setOpenModal("showImage", true);
  });

  const [mouseGesture, setMouseGesture] = createStore<MouseGestureStore>(defaultMouse());
  const [translate, setTranslate] = createStore<Point>(defaultPoint());

  return (
    <ViewMediaContext.Provider
      value={{
        displayMedias,
        setDisplayMedia,

        openModal,
        setOpenModal,

        mouseGesture,
        setMouseGesture,

        translate,
        setTranslate,

        resetModal,
        resetMouse,
      }}>
      {props.children}
    </ViewMediaContext.Provider>
  );
};

export const useViewMediaContext = () => useContext(ViewMediaContext)!;

const defaultPoint = (): Point => ({ x: 0, y: 0 });

const defaultMouse = (): MouseGestureStore => ({
  start: defaultPoint(),
  end: defaultPoint(),
  action: "",
  drag: false,
  status: false, // <-- Add this line
});

const defaultModal = (): ModalProps => ({
  isOpen: false,
  activeIdx: -1,
  startFocus: false,
  startRect: undefined,
  isEditing: false,
  showImage: false,
});
