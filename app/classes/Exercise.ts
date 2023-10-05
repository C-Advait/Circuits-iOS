export enum Tag {
  GENERIC = "generic",
  SIMPLIFIED = "simplified",
}

export class Exercise {
  id: number;
  routineID: number; // FK
  title: string;
  exerciseOrder: number;
  tag: Tag;
  workTime: number;
  numberOfRounds: number;
  restBetweenRounds: number;
  breakBeforeNext: number;
  category: string;
  color: string;

  constructor(obj: any) {
    this.id = obj.id;
    this.routineID = obj.routineID;
    this.title = obj.title;
    this.exerciseOrder = obj.exerciseOrder;
    this.tag = obj.tag;
    this.workTime = obj.workTime;
    this.numberOfRounds = obj.numberOfRounds;
    this.restBetweenRounds = obj.restBetweenRounds;
    this.breakBeforeNext = obj.breakBeforeNext;
    this.category = obj.category;
    this.color = obj.color;
  }
}
