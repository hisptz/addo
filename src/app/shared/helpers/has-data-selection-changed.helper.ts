export function hasDataSelectionChanged(
  currentDataSelections: any,
  newDataSelections: any
) {
  if (!currentDataSelections || !newDataSelections) {
    return true;
  }

  return newDataSelections.orgunit && newDataSelections.period
    ? currentDataSelections.orgunit !== newDataSelections.orgunit.id ||
        currentDataSelections.period !== newDataSelections.period.id
    : true;
}
