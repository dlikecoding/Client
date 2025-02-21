import { MediaType } from "../../context/ViewContext";

export class ModalElsManager {
  private allElements: MediaType[];
  private top: number;
  private bottom: number;

  private readonly STEP = 5;

  constructor(allElements: MediaType[], midIdx: number) {
    this.allElements = allElements;
    this.top = Math.max(0, midIdx - this.STEP);
    this.bottom = Math.min(allElements.length, midIdx + this.STEP);
  }

  /**
   * Get the current partial list without unnecessary recalculations.
   */
  getPartialList(): MediaType[] {
    return this.allElements.slice(this.top, this.bottom + 1);
  }

  getPartialTop(): MediaType[] {
    if (this.top === 0) return [];
    const top = Math.max(0, this.top - this.STEP);

    const result = this.allElements.slice(top, this.top);
    this.top = top;

    return result;
  }

  getPartialBottom(): MediaType[] {
    if (this.bottom === this.allElements.length) return [];

    const nextInd = this.bottom + 1;
    const bottom = Math.min(this.allElements.length, nextInd + this.STEP);

    const result = this.allElements.slice(nextInd, bottom);
    this.bottom = bottom;

    return result;
  }
  /**
   * Expands the list upwards or downwards while staying within bounds.
   * @param direction "top" or "bottom"
   * @param count Number of elements to expand by
   */
  addElements(direction: "top" | "bottom", count: number): void {
    console.log("Top: ", this.top, "Bottom: ", this.bottom);

    // if (direction === "top") {
    //   this.top = Math.max(0, this.top - count);
    // } else if (direction === "bottom") {
    //   this.bottom = Math.min(this.allElements.length - 1, this.bottom + count);
    // }

    // // Ensure we don't exceed max allowed elements
    // if (this.bottom - this.top + 1 > this.STEP) {
    //   if (direction === "top") {
    //     this.bottom = this.top + this.STEP - 1;
    //   } else {
    //     this.top = this.bottom - this.STEP + 1;
    //   }
    // }
  }

  /**
   * Reset to a new range dynamically.
   */
  updateRange(newTop: number, newBottom: number): void {
    this.top = Math.max(0, newTop);
    this.bottom = Math.min(this.allElements.length - 1, newBottom);
  }
}
