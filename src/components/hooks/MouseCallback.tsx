import { createSignal, onCleanup } from "solid-js";

export default function InteractionHandler() {
  let timer: number = 0;
  const [isMusicPlaying, setMusicPlaying] = createSignal(false);
  const [dragging, setDragging] = createSignal(false);
  const [dragDirection, setDragDirection] = createSignal<string>("");
  let startX: number, startY: number;

  const PlayMusic = () => {
    console.log("Play Music");
    setMusicPlaying(true);
  };

  const EndMusic = () => {
    console.log("End Music");
    setMusicPlaying(false);
  };

  const Custom1 = () => {
    console.log("Horizontal Drag (Custom1)");
  };

  const Custom2 = () => {
    console.log("Vertical Drag (Custom2)");
  };

  const onMouseDown = (e: { clientX: any; clientY: any }) => {
    startX = e.clientX;
    startY = e.clientY;
    setDragging(false);
    setDragDirection("");

    timer = setTimeout(() => {
      if (!dragging()) {
        PlayMusic();
      }
    }, 500);

    const onMouseMove = (e: { clientX: number; clientY: number }) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!dragging() && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        setDragging(true);
        clearTimeout(timer);

        if (Math.abs(dx) > Math.abs(dy)) {
          setDragDirection("horizontal");
          Custom1();
        } else {
          setDragDirection("vertical");
          Custom2();
        }
      }
    };

    const onMouseUp = () => {
      clearTimeout(timer);
      if (isMusicPlaying()) EndMusic();
      setDragging(false);
      setDragDirection("null");

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    onCleanup(() => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      clearTimeout(timer);
    });
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        width: "300px",
        height: "300px",
        border: "1px solid #888",
        "user-select": "none",
        cursor: "pointer",
      }}>
      Click or Drag Area
    </div>
  );
}
