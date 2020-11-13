import { Bookmark } from '../model';

const parser = new DOMParser();

function parseXml(xml: Document): Promise<Bookmark[]> {
  if (!xml.getElementsByTagName('bookmarks')) {
    return Promise.reject(`bookmarks does not exist: ${xml.toString()}`);
  }
  const bookmarks = xml.getElementsByTagName('bookmark');
  const r = [];
  for (let i = 0; i < bookmarks.length; i++) {
    const e = bookmarks.item(i);
    const url = e!.getElementsByTagName('url')!.item(0)!.textContent;
    if (!url) {
      return Promise.reject(`Invalid XML structure: ${e!.toString()}`);
    }
    const titleNodes = e!.getElementsByTagName('title');
    let title = url;
    if (titleNodes.length > 0 && titleNodes.item(0)) {
      title = titleNodes.item(0)!.textContent || url;
    }
    const labelNodes = e!.getElementsByTagName('label');
    const labels = [];
    for (let j = 0; j < labelNodes.length; j++) {
      const l = labelNodes!.item(j)!.textContent;
      if (l) {
        labels.push(l);
      }
    }
    r.push(new Bookmark(title, url, labels));
  }
  return Promise.resolve(r);
}

export function findBookmarks(): Promise<Bookmark[]> {
  return fetch('https://www.google.com/bookmarks/?output=xml', {
    credentials: 'include',
  })
    .then((r) => r.text())
    .then((txt) => parser.parseFromString(txt, 'text/xml'))
    .then((xml) => parseXml(xml));
}
