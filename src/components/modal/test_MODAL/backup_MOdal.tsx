// Create tracking current element displaying in DOME tree
const [el, setEl] = createStore<ElementModal>({
  curIndex: items().keys().next().value!, // Current selected index
  curMediaId: items().values().next().value!, // Current Id of selected el
});

// List of medias. Started with selected mediaID and then add 2 lement on the top and 2 element in the bottom
const modalMedias = createMemo(() => {
  const startIndex = Math.max(0, el.curIndex - STEP);
  const endIndex = Math.min(displayMedias.length, el.curIndex + 1 + STEP);

  return displayMedias.slice(startIndex, endIndex);
});

// When Item scrolled to or clicked in thumb image, it will change current element (el)
const handleSelectItems = (idx: number, id: string) => {
  if (el.curIndex === idx || el.curMediaId === id) return;

  setOneItem(idx, id);
  setEl({ curMediaId: id, curIndex: idx });
};

const [elementsRefs, setElementRefs] = createSignal<Element[]>();

createMemo(() => {
  if (modalMedias()) {
    console.log("On Changed...");

    const allMedias = document.querySelectorAll(`[data-modalidx]`);
    if (allMedias) setElementRefs(Array.from(allMedias));
  }
});

createMemo(() => IntersectionOnScroll(elementsRefs()!, handleSelectItems));
// Create observtion for all elements in DOME

// Display Date and Time on the header
const displayTime = createMemo(() => formatTime(displayMedias[el.curIndex]?.CreateDate));

const IntersectionOnScroll = async (elements: Element[], handleSelectItems: (idx: number, id: string) => void) => {
  // const allMedias = document.querySelectorAll("#modalImages");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const mediaEl = entry.target as HTMLElement;
          handleSelectItems(parseInt(mediaEl.dataset.modalidx!), mediaEl.dataset.modalid!);
        }
      });
    },
    { threshold: 1 }
  );

  console.log(elements);
  elements.forEach((el: Element) => observer.observe(el));
};

// Initialize Intersction Observe:
// createMemo(() => {
//   console.log("Run observer ... ");
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           // Do some thing
//           const mediaEl = entry.target as HTMLElement;
//           // handleIntersection(media.media_id, currentIndex, el)
//           // if (mediaEl.dataset)

//           handleSelectItems(parseInt(mediaEl.dataset.modalidx!), mediaEl.dataset.modalid!);
//         }
//       });
//     },
//     { threshold: 1 } // Adjust threshold as needed
//   );

//   elementsRefs().forEach((el: HTMLElement) => observer.observe(el));

//   onCleanup(() => observer.disconnect());
// });
