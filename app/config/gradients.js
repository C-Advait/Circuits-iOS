import { Tag } from "../classes/Exercise";

export const getMovingEndColor = (tag) => {
  switch (tag) {
    case Tag.WORKING:
      return "#e44a5d";
    case Tag.BREAK:
      return "rgba(255, 255, 255, 0.87)";
    case Tag.REST:
      return "#9180ff";
    default:
      return "dodgerblue";
  }
};

export const getFixedEndColor = (tag) => {
  switch (tag) {
    case Tag.WORKING:
      return "#eb774b";
    case Tag.BREAK:
      return "rgba(255, 255, 255, 0.38)";
    case Tag.REST:
      return "#4db4ff";
    default:
      return "dodgerblue";
  }
};
