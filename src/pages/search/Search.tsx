import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { createResource, createSignal, Index, onMount, Show } from "solid-js";
import { fetchRefetch, fetchSearch } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";

const Search = () => {
  onMount(async () => await fetchRefetch());

  const [keyword, setKeyword] = createSignal<string>("");
  const [isTyping, setIsTyping] = createSignal<boolean>(false);

  const { updatePage } = useManageURLContext();
  const [loadingSearch] = createResource(keyword, fetchSearch);

  return (
    <>
      <header style={{ position: "relative" }}>
        {/* height: isTyping() ? "0" : "65px" */}
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
          value={keyword()}
          onFocus={() => setIsTyping(true)}
          // onBlur={() => setIsTyping(false)}
        />
      </div>
      <div class={styles.searchResult}>
        <Show when={isTyping()}>
          {loadingSearch() && (
            <Index each={loadingSearch().suggestCount}>
              {(each) => (
                <button
                  onClick={() => {
                    setKeyword(each().word);
                    setIsTyping(false);
                  }}>
                  <span>{each().word}</span>
                  <span>{each().ndoc}</span>
                </button>
              )}
            </Index>
          )}
        </Show>
      </div>
      <Show when={loadingSearch()}>
        <h3>
          {loadingSearch() && loadingSearch().data.length > 0 ? loadingSearch().data[0].total_count : "0"} Photos
          <A
            href={keyword() ? `/search/${keyword()}` : "/search/all"}
            onClick={() => {
              updatePage({ searchKey: keyword() });
            }}
            class="atag_group_views">
            See All
          </A>
        </h3>
      </Show>
      <div class={styles.libraryGrid}>
        <Show when={loadingSearch()}>
          <Index each={loadingSearch().data}>{(media, index) => <img src={media().thumb_path} alt="Image 1" />}</Index>
        </Show>
      </div>
    </>
  );
};

export default Search;
