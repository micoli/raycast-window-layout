import { Display, resizeWindow } from "./WindowManager";
import { enumerateCells } from "./common";

export const doLayout = (rows, displays: Display[], cellWindowNumberMap: { [p: string]: unknown }) => {
  const [unitWidth, unitHeight] = enumerateCells(rows).reduce(
    ([unitWidth, unitHeight], cell) => [
      Math.max(unitWidth, cell.x + cell.width),
      Math.max(unitHeight, cell.y + cell.height),
    ],
    [0, 0],
  );
  const [pixelX, pixelY] = [Math.trunc(displays[0].width / unitWidth), Math.trunc(displays[0].height / unitHeight)];
  for (const cell of enumerateCells(rows)) {
    resizeWindow(
      cellWindowNumberMap[cell.index],
      cell.x * pixelX,
      cell.y * pixelY,
      cell.width * pixelX,
      cell.height * pixelY,
    ).then((_) => console.log);
  }

  console.log("--");
  console.log(cellWindowNumberMap);
  console.log(displays[0]);
  console.log(unitWidth, unitHeight);
  console.log("activate", unitWidth, unitHeight, cellWindowNumberMap);
};
