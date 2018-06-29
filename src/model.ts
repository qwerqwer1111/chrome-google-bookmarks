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
