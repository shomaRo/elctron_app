import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // 開発モードなら `localhost:5173` を開く
    mainWindow.loadURL("http://localhost:5173/");
  } else {
    // 本番モードなら `dist/index.html` を開く
    mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Mac の場合、ウィンドウがすべて閉じてもアプリは終了しない
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
