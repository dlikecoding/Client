import styles from "./Search.module.css";
import { createMemo, createResource, createSignal, For, Index, Show } from "solid-js";
import { ManageURLContextProvider } from "../../context/ManageUrl";
import { A } from "@solidjs/router";

const fetchSearch = async (input: string = "") => {
  const res = await fetch(`api/v1/search?keyword=${input}`);
  if (!res.ok) return { error: "" };
  try {
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const Search = () => {
  const [keyword, setKeyword] = createSignal<string>("");
  const [loadingSearch] = createResource(keyword, fetchSearch);
  return (
    <>
      <ManageURLContextProvider>
        <div class={styles.groupSearch}>
          <input
            id="searchInput"
            class="inputSearch"
            type="text"
            placeholder="Find photos using keywords ... "
            onInput={(e) => setKeyword(e.target.value)}
            onFocus={() => {
              const headers = document.getElementsByTagName("header");
              if (!headers && !headers[0]) return;
              headers[0].style.height = "0";
            }}
            onBlur={() => {
              const headers = document.getElementsByTagName("header");
              if (!headers && !headers[0]) return;
              headers[0].style.height = "65px";
            }}
          />
        </div>
        <div class={styles.searchResult}>
          <Show when={keyword().trim() && loadingSearch()}>
            <Index each={loadingSearch().count}>
              {(each) => (
                <button class="inactive" onClick={() => setKeyword(each().title)}>
                  <span>{each().title}</span>
                  <span>{each().count}</span>
                </button>
              )}
            </Index>
          </Show>
        </div>
        <Show when={loadingSearch()}>
          <h3>
            {loadingSearch().count.reduce((total: number, item: any) => total + parseInt(item.count), 0)} Photos
            <A href={keyword() ? `/search/${keyword()}` : "#"} class="atag_group_views">
              See All
            </A>
          </h3>
        </Show>
        <div class={styles.libraryGrid}>
          <Show when={loadingSearch()}>
            <Index each={loadingSearch().data}>
              {(media, index) => {
                return <img src={media().thumb_path} alt="Image 1" />;
              }}
            </Index>
          </Show>
        </div>
      </ManageURLContextProvider>
    </>
  );
};

export default Search;
