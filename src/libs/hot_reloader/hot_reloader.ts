import { app, BrowserWindow } from "electron";
import { info } from "../utility";
import fs from 'fs';

export { };

const appUserDataPath = app.getPath('userData');

// If this changes, there's something wrong with the operating system.
const reloaderDir = `${appUserDataPath}/reloader.json`;

class Reloader {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Move the window where it was on hot reload.
 * @param mainWindow The electron window.
 */
export function restoreWindowPosition(mainWindow: BrowserWindow): void {
  const reloaderExists = fs.existsSync(reloaderDir);
  if (!reloaderExists) {
    fs.writeFileSync(reloaderDir, JSON.stringify(new Reloader(0, 0)));
  }
  let reloader: Reloader;
  // Attempt to parse from the file. 
  try {
    reloader = JSON.parse(fs.readFileSync(reloaderDir).toString());
  } catch (e: any) {
    // Literally FORCE the thing to do it. If this fails, something has gone EXTREMELY wrong.
    fs.writeFileSync(reloaderDir, JSON.stringify(new Reloader(0, 0)));
    reloader = JSON.parse(fs.readFileSync(reloaderDir).toString());
  }
  mainWindow.setPosition(reloader.x, reloader.y);
}

/**
 * Save the window position for the next hot reload.
 * @param mainWindow The electron window.
 */
export function storeWindowPosition(mainWindow: BrowserWindow): void {
  // Attempt to cram the position into a JSON object.
  let pos: number[] = mainWindow.getPosition();
  try {
    fs.writeFileSync(reloaderDir, JSON.stringify(new Reloader(pos[0], pos[1])));
  } catch (e: any) {
    info(`FAILED TO WRITE RELOADER DATA: ${e}`);
  }
}
