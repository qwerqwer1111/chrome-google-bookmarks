import { Bookmark } from '../model';
import { State } from './';
import { PAGE_SIZE } from './constants';

function allBookmarksInSelectedLabel(state: State): Bookmark[] {
  if (state.selectedLabel === '') {
    return state.bookmarks;
  }
  return state.bookmarks.filter((b) => b.labels.includes(state.selectedLabel));
}

export default {
  labels(state: State): string[] {
    const s = new Set<string>();
    state.bookmarks.forEach((b) => b.labels.forEach((l) => s.add(l)));
    const r: string[] = [];
    s.forEach((l) => r.push(l));
    return r.sort();
  },

  selectedBookmarks(state: State): Bookmark[] {
    return allBookmarksInSelectedLabel(state).slice(
      state.currentPage * PAGE_SIZE,
      (state.currentPage + 1) * PAGE_SIZE
    );
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
  },
};
