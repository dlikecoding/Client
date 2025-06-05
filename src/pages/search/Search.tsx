import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { Accessor, createMemo, createResource, createSignal, Index, onMount, Show } from "solid-js";
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

  const countPhotos: Accessor<number> = createMemo(() =>
    loadingSearch() && loadingSearch().data.length > 0 ? loadingSearch().data[0].total_count : 0
  );
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
              <button
                class={styles.suggestionBtn}
                onClick={() => {
                  setKeyword((prev) => {
                    const lastSpace = prev.trim().lastIndexOf(" ");
                    return prev.substring(0, lastSpace) + " " + each().word;
                  });
                }}>
                <span>{each().word}</span>
                <span>{each().ndoc}</span>
              </button>
            )}
          </Index>
        )}
      </div>
      <Show when={loadingSearch()}>
        <h3>
          {countPhotos()} Photos
          <A
            href={!keyword() ? "#" : "/search/all"}
            onClick={() => {
              if (!keyword()) return;
              updatePage({ searchKey: keyword() });
            }}
            classList={{ atag_group_views: true, [styles.disableLink]: !keyword() || !countPhotos() }}>
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
          <Index each={loadingSearch().data}>
            {
              (media) => (
                <A
                  href={!keyword() ? "#" : `/search/${media().media_id}`}
                  classList={{ [styles.imagesContainer]: true, [styles.disableLink]: !keyword() }}
                  onClick={() => {
                    if (!keyword()) return;
                    updatePage({ searchKey: keyword() });
                  }}>
                  <Show when={media().favorite}>
                    <div class={styles.overlayFavorite}></div>
                  </Show>

                  <p class={styles.caption}>{media().caption}</p>

                  <img inert src={media().thumb_path} alt="Image not found" />
                </A>
              )

              // <img inert src={media().thumb_path} alt="Image not found" />
            }
          </Index>
        </Show>
      </div>
    </main>
  );
};

export default Search;
