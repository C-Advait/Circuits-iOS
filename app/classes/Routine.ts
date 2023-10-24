export class Routine {
  id: number;
  numberOfLoops: number;
  title: string;
  duration: number;
  color: string;
  userCreated: boolean;
  timeCreated: string;
  timeMostRecentlyCompleted: string;
  emoji: string;

  constructor(obj: any) {
    this.id = obj.id;
    this.numberOfLoops = obj.numberOfLoops;
    this.title = obj.title;
    this.duration = obj.duration;
    this.color = obj.color;
    this.userCreated = obj.userCreated;
    this.timeCreated = obj.timeCreated;
    this.timeMostRecentlyCompleted = obj.timeMostRecentlyCompleted;
    this.emoji = obj.emoji;
  }
}
