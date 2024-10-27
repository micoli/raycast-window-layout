import { Layout } from "./common";

export const layouts: Layout[] = [
  {
    name: "split horizontal",
    rows: [{ height: 1, cells: [{ width: 1 }, { width: 1 }] }],
  },
  {
    name: "split horizontal 2+1",
    rows: [{ height: 1, cells: [{ width: 2 }, { width: 1 }] }],
  },
  {
    name: "split horizontal 1+2",
    rows: [{ height: 1, cells: [{ width: 1 }, { width: 2 }] }],
  },
  {
    name: "split vertical",
    rows: [
      { height: 1, cells: [{ width: 1 }] },
      { height: 1, cells: [{ width: 1 }] },
    ],
  },
  {
    name: "split vertical 2+1",
    rows: [
      { height: 2, cells: [{ width: 1 }] },
      { height: 1, cells: [{ width: 1 }] },
    ],
  },
  {
    name: "split vertical 1+2",
    rows: [
      { height: 1, cells: [{ width: 1 }] },
      { height: 2, cells: [{ width: 1 }] },
    ],
  },
  {
    name: "split horizontal 1+1+1",
    rows: [{ height: 1, cells: [{ width: 1 }, { width: 1 }, { width: 1 }] }],
  },
  {
    name: "split horizontal 1+2+1",
    rows: [{ height: 1, cells: [{ width: 1 }, { width: 2 }, { width: 1 }] }],
  },
  {
    name: "split 2*1+2*1",
    rows: [
      { height: 1, cells: [{ width: 2 }, { width: 1 }] },
      { height: 1, cells: [{ width: 2 }, { width: 1 }] },
    ],
  },
  {
    name: "split 1*2+1*2",
    rows: [
      { height: 1, cells: [{ width: 1 }, { width: 2 }] },
      { height: 1, cells: [{ width: 1 }, { width: 2 }] },
    ],
  },
  {
    name: "split 2*1+2",
    rows: [
      { height: 1, cells: [{ width: 1 }, { width: 2 }] },
      { height: 1, cells: [{ width: 2 }, { width: 1 }] },
    ],
  },
];
