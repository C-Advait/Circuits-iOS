export enum Tag {
  GENERIC = "generic",
  SIMPLIFIED = "simplified",
}

export class Exercise {
  id: string; // UUID
  title: string;
  tag: Tag;
  workTime: number;
  numberOfRounds: number;
  restBetweenRounds: number;
  breakBeforeNext: number;
  category: string;

  constructor(
    id: string,
    title: string,
    tag: Tag,
    workTime: number,
    numberOfRounds: number,
    restBetweenRounds: number,
    breakBeforeNext: number,
    category: string,
  ) {
    this.id = id;
    this.title = title;
    this.tag = tag;
    this.workTime = workTime;
    this.numberOfRounds = numberOfRounds;
    this.restBetweenRounds = restBetweenRounds;
    this.breakBeforeNext = breakBeforeNext;
    this.category = category;
  }
}
