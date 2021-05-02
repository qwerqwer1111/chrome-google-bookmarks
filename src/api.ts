export interface Bookmark {
  title: string;
  url: string;
  labels: string[];
}

const parser = new DOMParser();

function parseXML(xml: Document) {
  const bookmarksXML = xml.getElementsByTagName('bookmark');
  const bookmarks: Bookmark[] = [];

  for (let i = 0; i < bookmarksXML.length; i++) {
    const bookmarkXML = bookmarksXML.item(i);

    if (!bookmarkXML) {
      throw new Error(`malformed response: ${xml.toString()}`);
    }

    const url = bookmarkXML.getElementsByTagName('url').item(0)?.textContent;
    if (!url) {
      throw new Error(`malformed response: ${bookmarkXML.toString()}`);
    }

    const title =
      bookmarkXML.getElementsByTagName('title').item(0)?.textContent || url;

    const labelsXML = bookmarkXML.getElementsByTagName('label');
    const labels: string[] = [];
    for (let j = 0; j < labelsXML.length; j++) {
      const label = labelsXML.item(j)?.textContent;
      if (label) {
        labels.push(label);
      }
    }

    bookmarks.push({ title, url, labels });
  }

  return bookmarks;
}

export async function fetchBookmarks() {
  const r = await fetch('https://www.google.com/bookmarks/?output=xml', {
    credentials: 'include',
  });
  const xml = parser.parseFromString(await r.text(), 'application/xml');
  return parseXML(xml);
}
