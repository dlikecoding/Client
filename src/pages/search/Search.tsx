import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { createResource, createSignal, Index, Show } from "solid-js";
import { fetchSearch } from "../../components/extents/request/fetching";

const Search = () => {
  const [keyword, setKeyword] = createSignal<string>("");

  const [header, setHeader] = createSignal<HTMLElement>();
  const [loadingSearch] = createResource(keyword, fetchSearch);
  return (
    <>
      <header ref={setHeader} style={{ position: "relative" }}>
        <div>
          <h1>Search</h1>
        </div>
      </header>

      <div class={styles.groupSearch}>
        <input
          id="searchInput"
          class="inputSearch"
          type="text"
          placeholder="Find photos using keywords ... "
          onInput={(e) => setKeyword(e.target.value)}
          value={keyword().trim()}
          onFocus={() => (header()!.style.height = "0")}
          onBlur={() => (header()!.style.height = "65px")}
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
          <A href={keyword() ? `/search/${keyword()}` : "/search/all"} class="atag_group_views">
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
    </>
  );
};

export default Search;
