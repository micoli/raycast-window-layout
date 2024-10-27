export interface Row {
  height: number;
  cells: { width: number }[];
}

export interface Layout {
  name: string;
  rows: Row[];
}

export interface CellWindowNumberMap {
  [p: string]: string | null;
}

export const layoutDefinitionsToSVG = (
  layout: Layout,
  index: number | "no_selection" | "ok",
  icons: { [p: number]: string | null },
): string => {
  return (
    "data:image/svg+xml;base64," +
    btoa(
      unescape(
        encodeURIComponent(`<svg>
    ${enumerateCells(layout.rows)
      .map((cell, cellIndex) => {
        let color = null;
        const icon = icons[cellIndex.toString()];
        switch (true) {
          case index == "no_selection":
            color = "black";
            break;
          case index == "ok":
            color = "green";
            break;
          case Number.isInteger(cellIndex) && cellIndex == index:
            color = "red";
            break;
        }
        return `<rect
          style="fill:black;stroke-width:4;stroke:${color}"
          x="${cell.x * 100 + 2}"
          y="${cell.y * 100 + 2}"
          width="${cell.width * 100 - 6}"
          height="${cell.height * 100 - 6}"
      />${
        icon &&
        `<image
          x="${cell.x * 100 + (cell.width * 100) / 2 - 24}"
          y="${cell.y * 100 + (cell.height * 100) / 2 - 24}"
          width="48"
          height="48"
          xlink:href="${icon}"
          />`
      }
    `;
      })
      .join("")}
  </svg>`),
      ),
    )
  );
};

export const formatWindowTitle = (window): string => {
  if (window.name === "") {
    return window.ownerName;
  }
  if (window.name === window.ownerName) {
    return window.ownerName;
  }
  return `${window.ownerName} - ${window.name}`;
};

export const enumerateCells = (rows) => {
  const cells = [];
  let x = 0;
  let y = 0;
  let index = 0;
  rows.map((row) => {
    x = 0;
    row.cells
      .map((cell) => {
        cells.push({
          index,
          x,
          y,
          width: cell.width,
          height: row.height,
        });
        index = index + 1;
        x = x + cell.width;
      })
      .join("");
    y = y + row.height;
  });
  return cells;
};
