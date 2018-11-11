import { ActionContext } from 'vuex';
import { findBookmarks } from '../api';
import { State } from './';
import {
  SetBookmarksPayload,
  SetCurrentPagePayload,
  SetLoggedInPayload,
  SetSelectedLabelPayload
} from './mutations';
import * as constants from './constants';
import * as types from './mutation-types';

export interface SelectLabelActionPayload {
  label: string;
}

export interface SetCurrentPageActionPayload {
  page: number;
}

export default {
  async fetchBookmarks(context: ActionContext<State, State>): Promise<void> {
    try {
      const bookmarks = await findBookmarks();
      context.commit(types.SET_BOOKMARKS, { bookmarks } as SetBookmarksPayload);
      context.commit(types.SET_LOGGED_IN, { loggedIn: true } as SetLoggedInPayload);
      localStorage.setItem(constants.LOCAL_STORAGE_BOOKMARKS, JSON.stringify(bookmarks));
      return Promise.resolve();
    } catch (e) {
      console.error(e);
      context.commit(types.SET_BOOKMARKS, { bookmarks: [] } as SetBookmarksPayload);
      context.commit(types.SET_LOGGED_IN, { loggedIn: false } as SetLoggedInPayload);
      localStorage.setItem(constants.LOCAL_STORAGE_BOOKMARKS, JSON.stringify([]));
      localStorage.setItem(constants.LOCAL_STORAGE_SELECTED_LABEL, '');
      localStorage.setItem(constants.LOCAL_STORAGE_CURRENT_PAGE, '0');
      return Promise.reject(e);
    }
  },

  selectLabel(context: ActionContext<State, State>, { label }: SelectLabelActionPayload) {
    context.commit(types.SET_SELECTED_LABEL, { selectedLabel: label } as SetSelectedLabelPayload);
    context.commit(types.SET_CURRENT_PAGE, { currentPage: 0 } as SetCurrentPagePayload);
    localStorage.setItem(constants.LOCAL_STORAGE_SELECTED_LABEL, label);
    localStorage.setItem(constants.LOCAL_STORAGE_CURRENT_PAGE, '0');
  },

  setCurrentPage(context: ActionContext<State, State>, { page }: SetCurrentPageActionPayload) {
    context.commit(types.SET_CURRENT_PAGE, { currentPage: page } as SetCurrentPagePayload);
    localStorage.setItem(constants.LOCAL_STORAGE_CURRENT_PAGE, '' + page);
  }
};
