import Vue from 'vue';
import Vuex, {
  ActionContext,
  MutationTree
} from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { findBookmarks } from '../api';
import { Bookmark } from '../model';

Vue.use(Vuex);

interface State {
  bookmarks: Bookmark[];
  selectedLabel: string;
  loggedIn: boolean;
}

function loadBookmarksFromLocalStorage(): Bookmark[] {
  const s = localStorage.getItem('bookmarks');
  return s === null ? [] : JSON.parse(s);
}

function loadSelectedLabelFromLocalStorage(): string {
  const s = localStorage.getItem('selectedLabel');
  return s === null ? '' : s;
}

const state = <State>{
  bookmarks: loadBookmarksFromLocalStorage(),
  selectedLabel: loadSelectedLabelFromLocalStorage(),
  loggedIn: true
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

const mutations = <MutationTree<State>>{
  setBookmarks(state: State, { bookmarks }: SetBookmarksPayload) {
    state.bookmarks = bookmarks;
  },

  setLoggedIn(state: State, { loggedIn }: SetLoggedInPayload) {
    state.loggedIn = loggedIn;
  },

  setSelectedLabel(state: State, { selectedLabel }: SetSelectedLabelPayload) {
    state.selectedLabel = selectedLabel;
  }
};

export interface SelectLabelActionPayload {
  label: string;
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
      return Promise.reject(err);
    });
  },

  selectLabel(context: ActionContext<State, State>, { label }: SelectLabelActionPayload) {
    context.commit('setSelectedLabel', <SetSelectedLabelPayload>{ selectedLabel: label });
    localStorage.setItem('selectedLabel', label);
  }
};

const getters = {
  labels(state: State): string[] {
    const s = new Set<string>();
    state.bookmarks.forEach(b => b.labels.forEach(l => s.add(l)));
    const r = <string[]>[];
    s.forEach(l => r.push(l));
    return r.sort();
  },

  selectedBookmarks(state: State): Bookmark[] {
    if (state.selectedLabel === '') {
      return state.bookmarks;
    }
    return state.bookmarks.filter(b => b.labels.includes(state.selectedLabel));
  },

  selectedLabel(state: State): string {
    return state.selectedLabel;
  },

  loggedIn(state: State): boolean {
    return state.loggedIn;
  }
};

const { dispatch, read } = getStoreAccessors<State, State>('');

export const dispatchFetchBookmarks = dispatch(actions.fetchBookmarks);
export const dispatchSelectLabel = dispatch(actions.selectLabel);

export const readLabels = read(getters.labels);
export const readSelectedBookmarks = read(getters.selectedBookmarks);
export const readSelectedLabel = read(getters.selectedLabel);
export const readLoggedIn = read(getters.loggedIn);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
