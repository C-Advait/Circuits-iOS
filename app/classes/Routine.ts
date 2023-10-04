import { Exercise } from "./Exercise";
import { Sound } from "./Sound";

export class Routine {
  id: number;
  warmup: Exercise[];
  working: Exercise[];
  cooldown: Exercise[];
  numberOfLoops: number;
  exerciseSound: Sound;
  restSound: Sound;
  breakSound: Sound;
  endSound: Sound;
  title: string;
  duration: number;
  userCreated: boolean;

  constructor(
    id: number,
    warmup: Exercise[],
    working: Exercise[],
    cooldown: Exercise[],
    numberOfLoops: number,
    exerciseSound: Sound,
    restSound: Sound,
    breakSound: Sound,
    endSound: Sound,
    title: string,
    duration: number,
    userCreated: boolean,
  ) {
    this.id = id;
    this.warmup = warmup;
    this.working = working;
    this.cooldown = cooldown;
    this.numberOfLoops = numberOfLoops;
    this.exerciseSound = exerciseSound;
    this.restSound = restSound;
    this.breakSound = breakSound;
    this.endSound = endSound;
    this.title = title;
    this.duration = duration;
    this.userCreated = userCreated;
  }
}
