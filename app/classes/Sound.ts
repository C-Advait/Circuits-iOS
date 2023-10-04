export class Sound {
  id: number;
  title: string;
  file: string;
  type: string;

  constructor(id: number, title: string, file: string, type: string) {
    this.id = id;
    this.title = title;
    this.file = file;
    this.type = type;
  }
}
