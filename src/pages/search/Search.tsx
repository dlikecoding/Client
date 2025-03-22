import styles from "../homepage/Home.module.css";
import { Portal } from "solid-js/web";
import { createSignal, For, Show } from "solid-js";
import { CloseIcon, TestAccountIcon } from "../../components/svgIcons";
import { A, useNavigate } from "@solidjs/router";
import { ManageURLContextProvider } from "../../context/ManageUrl";

const Search = (props: any) => {
  const [pageNumber, setPageNumber] = createSignal(0);
  const loadedMedias: any[] | undefined = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const navigate = useNavigate();
  return (
    <ManageURLContextProvider>
      <Portal>
        <main class="mainHomePage currentActivePage">
          <header style={{ position: "relative" }}>
            <div>
              <h1>Search</h1>
            </div>
            <div class="buttonContainer">
              <button
                style={{ "background-color": true ? "rgb(51,94,168)" : "rgb(236,106,94)" }}
                popoverTarget="account-popover">
                {TestAccountIcon()}
              </button>

              <div popover="auto" id="account-popover" class="popover-container devices_filter_popover">
                <A href="/user">Profile</A>
                <A href="">More</A>
                <A href="/user/admin">Dashboard</A>
                <A href="/login">Login</A>
                <A href="/logout">Logout</A>
              </div>
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

          <button class="closeButton" onClick={() => navigate("/", { replace: true })}>
            {CloseIcon()}
          </button>
        </main>
      </Portal>
    </ManageURLContextProvider>
  );
};

export default Search;
