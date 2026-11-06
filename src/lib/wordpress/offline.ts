/** وقتی true باشد، اتصال به وردپرس برقرار نشده و دادهٔ زنده در دسترس نیست. */
export type WithOfflineFlag<T> = T & { isOffline: boolean };

export function offlineResult<T>(data: T): WithOfflineFlag<T> {
  return { ...data, isOffline: true };
}

export function onlineResult<T>(data: T): WithOfflineFlag<T> {
  return { ...data, isOffline: false };
}
