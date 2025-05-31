import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { createResource, createSignal, Index, onMount, Show } from "solid-js";
import { fetchRefetch, fetchSearch } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";

const Search = () => {
  const { resetParams, updatePage } = useManageURLContext();

  onMount(async () => {
    resetParams();
    await fetchRefetch();
  });

  const [keyword, setKeyword] = createSignal<string>("");
  const [loadingSearch] = createResource(keyword, fetchSearch);

  return (
    <main class="mainHomePage">
      <header style={{ position: "relative" }}>
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
        />
      </div>
      <div class={styles.searchResult}>
        {loadingSearch() && (
          <Index each={loadingSearch().suggestCount}>
            {(each) => (
              <button onClick={() => setKeyword(each().word)}>
                <span>{each().word}</span>
                <span>{each().ndoc}</span>
              </button>
            )}
          </Index>
        )}
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
        <Show
          when={loadingSearch() && loadingSearch().data.length > 0}
          fallback={
            <div class={styles.notfoundSearch}>
              <h3>No Results</h3>
              <p>There were no reults for "{keyword()}." Try new search.</p>
            </div>
          }>
          <Index each={loadingSearch().data}>{(media) => <img inert src={media().thumb_path} alt="Image 1" />}</Index>
        </Show>
      </div>
    </main>
  );
};

export default Search;
