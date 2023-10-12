import { SortCriteria } from "../classes/SortCriteria";

// Facilitates 'human' sorting.
// Example: say we have ['foo1', 'foo2', ... 'foo10'].
// Regular lexicographic sorting would produce:
//    ['foo1', 'foo10', 'foo2', 'foo3', ..., 'foo9'],
// when the original ordering is what is really desirable.
export function naturalCompare(x, y, sortOption) {
  let field;

  switch (sortOption) {
    case SortCriteria.RECENTLY_COMPLETED:
      field = "timeMostRecentlyCompleted";
      break;
    case SortCriteria.RECENTLY_ADDED:
      field = "timeCreated";
      break;
    case SortCriteria.ALPHABETICAL:
      field = "title";
      break;
    case SortCriteria.DURATION:
      field = "duration";
      break;
  }

  console.log(field);
  // console.log(x, y)
  console.log(x[field]);
  console.log(y[field]);

  // Convert numbers to strings for comparison
  a = x[field] === null ? "" : x[field].toString();
  b = y[field] === null ? "" : y[field].toString();

  // Extract number portions and compare them as integers
  const numberPattern = /\d+/g;

  const aNumbers = a.match(numberPattern) || [];
  const bNumbers = b.match(numberPattern) || [];

  for (let i = 0; i < Math.min(aNumbers.length, bNumbers.length); i++) {
    const difference = parseInt(aNumbers[i], 10) - parseInt(bNumbers[i], 10);
    if (difference) return difference;
  }

  // If numbers are the same or one string has more numbers, compare as regular strings
  return a.localeCompare(b);
}
