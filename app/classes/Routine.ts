export class Routine {
  id: number;
  numberOfLoops: number;
  exerciseSoundID: number;
  restSoundID: number;
  breakSoundID: number;
  endSoundID: number;
  title: string;
  duration: number;
  color: string;
  userCreated: boolean;

  constructor(obj: any) {
    this.id = obj.id;
    this.numberOfLoops = obj.numberOfLoops;
    this.exerciseSoundID = obj.exerciseSoundID;
    this.restSoundID = obj.restSoundID;
    this.breakSoundID = obj.breakSoundID;
    this.endSoundID = obj.endSoundID;
    this.title = obj.title;
    this.duration = obj.duration;
    this.color = obj.color;
    this.userCreated = obj.userCreated;
  }
}
