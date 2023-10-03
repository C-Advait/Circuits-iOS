import { Exercise } from "./Exercise";
import { Sound } from "./Sound";

export class Routine {
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

  constructor(
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
  ) {
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
  }
}
