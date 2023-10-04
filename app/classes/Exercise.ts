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

  constructor(dbRow: any) {
    this.id = dbRow.id;
    this.routineID = dbRow.routineID;
    this.title = dbRow.title;
    this.tag = dbRow.tag;
    this.workTime = dbRow.workTime;
    this.numberOfRounds = dbRow.numberOfRounds;
    this.restBetweenRounds = dbRow.restBetweenRounds;
    this.breakBeforeNext = dbRow.breakBeforeNext;
    this.category = dbRow.category;
  }
}
