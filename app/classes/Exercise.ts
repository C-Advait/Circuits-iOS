export enum Tag {
  GENERIC = "generic",
  SIMPLIFIED = "simplified",
}

export class Exercise {
  id: number;
  routineID: number; // FK
  title: string;
  tag: Tag;
  workTime: number;
  numberOfRounds: number;
  restBetweenRounds: number;
  breakBeforeNext: number;
  category: string;

  constructor(obj: any) {
    this.id = obj.id;
    this.routineID = obj.routineID;
    this.title = obj.title;
    this.tag = obj.tag;
    this.workTime = obj.workTime;
    this.numberOfRounds = obj.numberOfRounds;
    this.restBetweenRounds = obj.restBetweenRounds;
    this.breakBeforeNext = obj.breakBeforeNext;
    this.category = obj.category;
  }
}
