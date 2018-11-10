import Vue from 'vue';
import Vuex, {
  ActionContext,
  MutationTree
} from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { findBookmarks } from '../api';
import { Bookmark } from '../model';

Vue.use(Vuex);

const PAGE_SIZE = 100;

interface State {
  bookmarks: Bookmark[];
  selectedLabel: string;
  loggedIn: boolean;
  currentPage: number;
}

function loadBookmarksFromLocalStorage(): Bookmark[] {
  const s = localStorage.getItem('bookmarks');
  return s === null ? [] : JSON.parse(s);
}

function loadSelectedLabelFromLocalStorage(): string {
  const s = localStorage.getItem('selectedLabel');
  return s === null ? '' : s;
}

function loadCurrentPageFromLocalStorage(): number {
  const s = localStorage.getItem('currentPage');
  return s === null ? 0 : parseInt(s);
}

const state = <State>{
  bookmarks: loadBookmarksFromLocalStorage(),
  selectedLabel: loadSelectedLabelFromLocalStorage(),
  loggedIn: true,
  currentPage: loadCurrentPageFromLocalStorage()
};

interface SetBookmarksPayload {
  bookmarks: Bookmark[];
}

interface SetLoggedInPayload {
  loggedIn: boolean;
}

interface SetSelectedLabelPayload {
  selectedLabel: string;
}

interface SetCurrentPagePayload {
  currentPage: number;
}

const mutations = <MutationTree<State>>{
  setBookmarks(state: State, { bookmarks }: SetBookmarksPayload) {
    state.bookmarks = bookmarks;
  },

  setLoggedIn(state: State, { loggedIn }: SetLoggedInPayload) {
    state.loggedIn = loggedIn;
  },

  setSelectedLabel(state: State, { selectedLabel }: SetSelectedLabelPayload) {
    state.selectedLabel = selectedLabel;
  },

  setCurrentPage(state: State, { currentPage }: SetCurrentPagePayload) {
    state.currentPage = currentPage;
  }
};

export interface SelectLabelActionPayload {
  label: string;
}

export interface SetCurrentPageActionPayload {
  page: number;
}

const actions = {
  async fetchBookmarks(context: ActionContext<State, State>): Promise<void> {
    return findBookmarks().then(bookmarks => {
      context.commit('setBookmarks', <SetBookmarksPayload>{ bookmarks });
      context.commit('setLoggedIn', <SetLoggedInPayload>{ loggedIn: true });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      return Promise.resolve();
    }).catch(err => {
      console.error(err);
      context.commit('setBookmarks', <SetBookmarksPayload>{ bookmarks: [] });
      context.commit('setLoggedIn', <SetLoggedInPayload>{ loggedIn: false });
      localStorage.setItem('bookmarks', JSON.stringify([]));
      localStorage.setItem('selectedLabel', '');
      localStorage.setItem('currentPage', '0');
      return Promise.reject(err);
    });
  },

  selectLabel(context: ActionContext<State, State>, { label }: SelectLabelActionPayload) {
    context.commit('setSelectedLabel', <SetSelectedLabelPayload>{ selectedLabel: label });
    context.commit('setCurrentPage', <SetCurrentPagePayload>{ currentPage: 0 });
    localStorage.setItem('selectedLabel', label);
    localStorage.setItem('currentPage', '0');
  },

  setCurrentPage(context: ActionContext<State, State>, { page }: SetCurrentPageActionPayload) {
    context.commit('setCurrentPage', <SetCurrentPagePayload>{ currentPage: page });
    localStorage.setItem('currentPage', '' + page);
  }
};

function allBookmarksInSelectedLabel(state: State): Bookmark[] {
  if (state.selectedLabel === '') {
    return state.bookmarks;
  }
  return state.bookmarks.filter(b => b.labels.includes(state.selectedLabel));
}

const getters = {
  labels(state: State): string[] {
    const s = new Set<string>();
    state.bookmarks.forEach(b => b.labels.forEach(l => s.add(l)));
    const r = <string[]>[];
    s.forEach(l => r.push(l));
    return r.sort();
  },

  selectedBookmarks(state: State): Bookmark[] {
    return allBookmarksInSelectedLabel(state)
      .slice(state.currentPage * PAGE_SIZE, (state.currentPage + 1) * PAGE_SIZE);
  },

  selectedLabel(state: State): string {
    return state.selectedLabel;
  },

  loggedIn(state: State): boolean {
    return state.loggedIn;
  },

  currentPage(state: State): number {
    return state.currentPage;
  },

  totalPage(state: State): number {
    return Math.ceil(allBookmarksInSelectedLabel(state).length / PAGE_SIZE);
  }
};

const { dispatch, read } = getStoreAccessors<State, State>('');

export const dispatchFetchBookmarks = dispatch(actions.fetchBookmarks);
export const dispatchSelectLabel = dispatch(actions.selectLabel);
export const dispatchSetCurrentPage = dispatch(actions.setCurrentPage);

export const readLabels = read(getters.labels);
export const readSelectedBookmarks = read(getters.selectedBookmarks);
export const readSelectedLabel = read(getters.selectedLabel);
export const readLoggedIn = read(getters.loggedIn);
export const readCurrentPage = read(getters.currentPage);
export const readTotalPage = read(getters.totalPage);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
