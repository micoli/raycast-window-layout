export interface Row {
  height: number;
  cells: { width: number }[];
}

export interface Layout {
  name: string;
  rows: Row[];
}

export const layoutDefinitionsToSVG = (layout:Layout, index: number|'no_selection'|'ok') => {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(`<svg>
    ${enumerateCells(layout.rows).map((cell, cellIndex) => {
    let color = null;
      switch(true){
        case index == 'no_selection':
          color = 'black';
          break;
        case index == 'ok':
          color = 'green';
          break;
        case Number.isInteger(cellIndex) && cellIndex==index:
          color = 'red';
          break;
      }
      return `<rect
          style="fill:black;stroke-width:1;stroke:${color}"
          x="${cell.x * 10 + 2}"
          y="${cell.y * 10 + 2}"
          width="${cell.width * 10 - 2}"
          height="${cell.height * 10 - 2}"
      />
    `}).join("")}
  </svg>`)));
}

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
