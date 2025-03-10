import "./Home.css";

import Footer from "./Footer";

import { TestAccountIcon } from "../../components/svgIcons";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

const Home = (props: any) => {
  // Goto previous page if any:
  const pramsUrl = useLocation();
  const navigate = useNavigate();
  const prevState = localStorage.getItem("LastVisited") || "";

  onMount(() => {
    if (prevState && prevState !== "/") navigate(prevState);
  });
  createMemo(() => localStorage.setItem("LastVisited", pramsUrl.pathname.toString()));

  // Create search items for media
  const [pageNumber, setPageNumber] = createSignal(0);
  const loadedMedias: any[] | null | undefined = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <>
      {props.children}
      <main class="mainHomePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>Photos</h1>
          </div>
          <div class="buttonContainer">
            <button onClick={() => {}}>{TestAccountIcon()}</button>
            {/* <div popover></div> */}
          </div>
        </header>

        <form class="group-search">
          <input
            id="searchInput"
            type="text"
            placeholder="Places, Objects, Devices, Years ... "
            oninput={(e) => setPageNumber(parseInt(e.target.value))}
          />
        </form>

        <div class="search-result">
          <Show when={loadedMedias.length > 0}>
            <For each={loadedMedias}>
              {(_, index) => {
                return index() < 4 ? (
                  <button class="inactive">
                    <span>dog</span>
                    <span>102</span>
                  </button>
                ) : (
                  ""
                );
              }}
            </For>
          </Show>
        </div>

        <Show when={loadedMedias.length > 0}>
          <h3>
            1031 Photos
            <button class="atag_group_views">See All</button>
          </h3>
        </Show>

        <div class="library-grid">
          <Show when={loadedMedias.length > 0}>
            <For each={loadedMedias}>
              {(media, index) => {
                return index() < 9 ? <img src="{media}" alt="Image 1" /> : "";
              }}
            </For>
          </Show>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
