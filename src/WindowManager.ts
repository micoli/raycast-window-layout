import { execa, ExecaError } from "execa";
import fs from "fs";

export interface Window {
  pid: number,
  ownerName: string,
  name: string,
  posX: number,
  posY: number,
  width: number,
  height: number,
  number: number,
  screen: number,
}
export interface Display {
  id: number,
  x: number,
  y: number,
  width: number,
  height: number
}
const binaryPath = `${__dirname}/assets/window-manager`;
fs.chmodSync(binaryPath, 0o755);


export async function listWindows(onScreenOnly: boolean):Promise<Window[]> {
  try {
    const { stdout } = await execa`${binaryPath} windows ${onScreenOnly ? "--on-screen-only" : ""}`;
    return JSON.parse(stdout);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function listDisplays():Promise<Display[]> {
  try {
    const { stdout } = await execa`${binaryPath} displays`;
    return JSON.parse(stdout);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function resizeWindow(windowNumber, x, y, width, height) {
  try {
    console.log(`${binaryPath} resize-window ${windowNumber} ${x} ${y} ${width} ${height}`);
    await execa`${binaryPath} resize-window ${windowNumber} ${x} ${y} ${width} ${height}`;
  } catch (error) {
    console.log(error);
  }
}
