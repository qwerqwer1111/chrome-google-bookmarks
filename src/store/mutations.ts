import { MutationTree } from 'vuex';
import { State } from './';
import * as types from './mutation-types';
import { Bookmark } from '../model';

export interface SetBookmarksPayload {
  bookmarks: Bookmark[];
}

export interface SetLoggedInPayload {
  loggedIn: boolean;
}

export interface SetSelectedLabelPayload {
  selectedLabel: string;
}

export interface SetCurrentPagePayload {
  currentPage: number;
}

export default {
  [types.SET_BOOKMARKS](state: State, { bookmarks }: SetBookmarksPayload) {
    state.bookmarks = bookmarks;
  },

  [types.SET_LOGGED_IN](state: State, { loggedIn }: SetLoggedInPayload) {
    state.loggedIn = loggedIn;
  },

  [types.SET_SELECTED_LABEL](
    state: State,
    { selectedLabel }: SetSelectedLabelPayload
  ) {
    state.selectedLabel = selectedLabel;
  },

  [types.SET_CURRENT_PAGE](
    state: State,
    { currentPage }: SetCurrentPagePayload
  ) {
    state.currentPage = currentPage;
  },
} as MutationTree<State>;
