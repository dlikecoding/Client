/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param classType data-X this X is a dataset name
 * @param dataID dataID is data in that dataset
 * @returns HTMLDivElement
 */
export const getElementBySelector = (classType: string, dataID: string) => {
  return document.querySelector<HTMLElement>(`[data-${classType}="${dataID}"]`);
};

export const scrollIntoViewFc = (classType: string, dataID: string): void => {
  const targetEl = getElementBySelector(classType, dataID);
  if (targetEl) targetEl.scrollIntoView({ behavior: "instant", block: "center" });
};
