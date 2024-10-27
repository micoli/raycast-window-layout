import { Display, resizeWindow } from "./WindowManager";
import { CellWindowNumberMap, enumerateCells } from "./common";

export const doLayout = (rows, displays: Display, cellWindowNumberMap: CellWindowNumberMap) => {
  const [unitWidth, unitHeight] = enumerateCells(rows).reduce(
    ([unitWidth, unitHeight], cell) => [
      Math.max(unitWidth, cell.x + cell.width),
      Math.max(unitHeight, cell.y + cell.height),
    ],
    [0, 0],
  );
  const [pixelX, pixelY] = [Math.trunc(displays.width / unitWidth), Math.trunc(displays.height / unitHeight)];
  for (const cell of enumerateCells(rows)) {
    resizeWindow(
      cellWindowNumberMap[cell.index],
      cell.x * pixelX,
      cell.y * pixelY,
      cell.width * pixelX,
      cell.height * pixelY,
    ).then((_) => console.log);
  }
};
