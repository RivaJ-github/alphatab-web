const STORE_NAME = "file-history";

const indexedDB =
  window.indexedDB ||
  (window as any).webkitIndexedDB ||
  (window as any).mozIndexedDB ||
  (window as any).msIndexedDB;

let db: any;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("alphatab-guita", 1);

    request.onsuccess = (e: any) => {
      db = e.target.result;
      console.log("数据库打开成功");
      resolve(db);
    };

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "fileName" });
      }
    };

    request.onerror = () => {
      console.log("数据库打开失败");
      reject();
    };
  });
}

/**
 * 存储文件
 */
export function saveHistoryFile(name: string, file: ArrayBuffer) {
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  console.log(Date.now());
  const request = store.put({ fileName: name, file: file, _t: Date.now() });
  request.onsuccess = function () {
    console.log("File stored successfully");
  };
  request.onerror = function (event: any) {
    console.error("Error storing file:", event.target.error);
  };
}

/**
 * 获取最近一次上传的文件
 */
export function getLastFile() {
  return new Promise((resolve) => {
    const fileNames: any = [];
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    store.openCursor().onsuccess = function (event: any) {
      const cursor = event.target.result;
      if (cursor) {
        // 假设文件名是存储对象的key
        fileNames.push(cursor.value);
        cursor.continue();
      } else {
        // 所有文件名已收集完毕，可以在这里处理fileNames数组
        resolve(fileNames.sort((a: any, b: any) => b._t - a._t)[0].file); // 输出所有文件名
      }
    };
  });
}
