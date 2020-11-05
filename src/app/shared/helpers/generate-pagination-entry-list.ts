import * as _ from 'lodash';

export function generatePaginationEntryList(pageMaxSize, pageIntervalFactor) {
  const arrayList = [10, 25, 50, 100];
  const finalArray = _.map(arrayList, arrayItem => {
    return checkIfInRange(
      arrayItem,
      arrayList,
      pageMaxSize,
      pageIntervalFactor
    );
  });

  return _.compact(finalArray);
}

export function checkIfInRange(
  arrayItem,
  arrayList,
  pageMaxSize,
  pageIntervalFactor
) {
  if (_.inRange(arrayItem, arrayList.first, pageMaxSize)) {
    return arrayItem * pageIntervalFactor;
  } else {
    return null;
  }
}
