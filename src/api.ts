const parser = new DOMParser();

export class Bookmark {
  title: string;
  url: string;
  labels: string[];

  constructor(title: string, url: string, labels: string[]) {
    this.title = title;
    this.url = url;
    this.labels = labels;
  }
}

function parseXml(xml: Document): Promise<Bookmark[]> {
  if (!xml.getElementsByTagName('bookmarks')) {
    return Promise.reject(`bookmarks does not exist: ${xml.toString()}`);
  }
  const bookmarks = xml.getElementsByTagName('bookmark');
  let r = [];
  for (let i = 0; i < bookmarks.length; i++) {
    const e = bookmarks.item(i);
    const title = e.getElementsByTagName('title').item(0).textContent;
    const url = e.getElementsByTagName('url').item(0).textContent;
    if (!title || !url) {
      return Promise.reject(`Invalid XML structure: ${e.toString()}`);
    }
    const labelNodes = e.getElementsByTagName('label');
    let labels = [];
    for (let j = 0; j < labelNodes.length; j++) {
      const l = labelNodes.item(j).textContent;
      if (l) {
        labels.push(l);
      }
    }
    r.push(new Bookmark(title, url, labels));
  }
  return Promise.resolve(r);
}

export function findBookmarks(): Promise<Bookmark[]> {
  return fetch('https://www.google.com/bookmarks/?output=xml', {credentials: 'include'})
    .then(r => r.text())
    .then(txt => parser.parseFromString(txt, 'text/xml'))
    .then(xml => parseXml(xml));
}
