import styles from "./Home.module.css";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

import Footer from "./Footer";
import AccountButton from "../../components/photoview/buttons/AccountButton";

const Home = (props: any) => {
  // Goto previous page if any:
  const pramsUrl = useLocation();
  // const navigate = useNavigate();
  // const prevState = localStorage.getItem("LastVisited") || "";

  // onMount(() => {
  //   if (prevState && prevState !== "/") navigate(prevState);
  // });
  createMemo(() => localStorage.setItem("LastVisited", pramsUrl.pathname.toString()));

  // Create search items for media
  const [pageNumber, setPageNumber] = createSignal(0);
  const loadedMedias: any[] | undefined = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <>
      {props.children}
      <main class="mainHomePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>Photos</h1>
          </div>
          <div class="buttonContainer">
            <AccountButton />
          </div>
        </header>

        <div class={styles.groupSearch}>
          <input
            id="searchInput"
            class="inputSearch"
            type="text"
            placeholder="Places, Objects, Devices, Years ... "
            oninput={(e) => setPageNumber(parseInt(e.target.value))}
          />
        </div>

        <div class={styles.searchResult}>
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

        <div class={styles.libraryGrid}>
          <Show when={loadedMedias.length > 0}>
            <For each={loadedMedias}>
              {(media, index) => {
                return index() < 9 ? <img src="" alt="Image 1" /> : "";
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
