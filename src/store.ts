import { reactive } from 'vue';
import { Bookmark, fetchBookmarks } from './api';

const PAGE_SIZE = 100;

const LOCAL_STORAGE_BOOKMARKS = 'bookmarks';
const LOCAL_STORAGE_SELECTED_LABEL = 'selectedLabel';
const LOCAL_STORAGE_CURRENT_PAGE = 'currentPage';

interface State {
  loggedIn: boolean;
  bookmarks: Bookmark[];
  selectedLabel: string;
  currentPage: number;
}

function initState(): State {
  const bookmarks = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS);
  const selectedLabel = localStorage.getItem(LOCAL_STORAGE_SELECTED_LABEL);
  const currentPage = localStorage.getItem(LOCAL_STORAGE_CURRENT_PAGE);
  return {
    loggedIn: true,
    bookmarks: bookmarks === null ? [] : JSON.parse(bookmarks),
    selectedLabel: selectedLabel === null ? '' : selectedLabel,
    currentPage: currentPage === null ? 0 : parseInt(currentPage),
  };
}

function filterByLabel(bookmarks: Bookmark[], label: string) {
  if (label === '') {
    return bookmarks;
  }
  return bookmarks.filter((b) => b.labels.includes(label));
}

export function createStore() {
  const state = reactive(initState());

  return {
    get loggedIn() {
      return state.loggedIn;
    },

    get bookmarks() {
      const bookmarks = filterByLabel(state.bookmarks, state.selectedLabel);
      return bookmarks.slice(
        state.currentPage * PAGE_SIZE,
        (state.currentPage + 1) * PAGE_SIZE
      );
    },

    get labels() {
      const s = new Set(state.bookmarks.flatMap((b) => b.labels));
      return [...s].sort();
    },

    get selectedLabel() {
      return state.selectedLabel;
    },

    get totalPages() {
      const bookmarks = filterByLabel(state.bookmarks, state.selectedLabel);
      return Math.ceil(bookmarks.length / PAGE_SIZE);
    },

    get currentPage() {
      return state.currentPage;
    },

    async fetchBookmarks() {
      try {
        const bookmarks = await fetchBookmarks();
        state.bookmarks = bookmarks;
        state.loggedIn = true;
        localStorage.setItem(
          LOCAL_STORAGE_BOOKMARKS,
          JSON.stringify(bookmarks)
        );
      } catch (e) {
        state.bookmarks = [];
        state.loggedIn = false;
        localStorage.setItem(LOCAL_STORAGE_BOOKMARKS, JSON.stringify([]));
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LABEL, '');
        localStorage.setItem(LOCAL_STORAGE_CURRENT_PAGE, '0');
        throw e;
      }
    },

    selectLabel(label: string) {
      state.selectedLabel = label;
      state.currentPage = 0;
      localStorage.setItem(LOCAL_STORAGE_SELECTED_LABEL, label);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_PAGE, '0');
    },

    setCurrentPage(page: number) {
      state.currentPage = page;
      localStorage.setItem(LOCAL_STORAGE_CURRENT_PAGE, '' + page);
    },
  };
}
