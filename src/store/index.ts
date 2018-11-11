import Vue from 'vue';
import Vuex from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { Bookmark } from '../model';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import * as constants from './constants';

Vue.use(Vuex);

export interface State {
  bookmarks: Bookmark[];
  selectedLabel: string;
  loggedIn: boolean;
  currentPage: number;
}

function loadBookmarksFromLocalStorage(): Bookmark[] {
  const s = localStorage.getItem(constants.LOCAL_STORAGE_BOOKMARKS);
  return s === null ? [] : JSON.parse(s);
}

function loadSelectedLabelFromLocalStorage(): string {
  const s = localStorage.getItem(constants.LOCAL_STORAGE_SELECTED_LABEL);
  return s === null ? '' : s;
}

function loadCurrentPageFromLocalStorage(): number {
  const s = localStorage.getItem(constants.LOCAL_STORAGE_CURRENT_PAGE);
  return s === null ? 0 : parseInt(s);
}

const state: State = {
  bookmarks: loadBookmarksFromLocalStorage(),
  selectedLabel: loadSelectedLabelFromLocalStorage(),
  loggedIn: true,
  currentPage: loadCurrentPageFromLocalStorage()
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
