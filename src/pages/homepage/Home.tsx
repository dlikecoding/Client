import "./Home.css";

import Footer from "./Footer";

import { TestAccountIcon } from "../../assets/components/svg-icons";
import { createSignal, For, Show } from "solid-js";

const Home = (props: any) => {
  const [pageNumber, setPageNumber] = createSignal(0);
  const loadedMedias: any[] | null | undefined = []; //[1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <main class="mainHomePage">
      <h1>Photos</h1>

      <div class="btnsContainer">
        <button class="accountButton">{TestAccountIcon()}</button>
      </div>
      {props.children}

      <form class="group-search">
        <input
          id="searchInput"
          type="text"
          placeholder="Places, Objects, Devices, Years ... "
          on:input={(e) => setPageNumber(parseInt(e.target.value))}
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

      <Footer />
    </main>
  );
};

export default Home;
