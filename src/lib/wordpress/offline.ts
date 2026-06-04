/** وقتی true باشد، داده از وردپرس نیامده و نسخهٔ آفلاین/نمونه نشان داده می‌شود. */
export type WithOfflineFlag<T> = T & { isOffline: boolean };

export function offlineResult<T>(data: T): WithOfflineFlag<T> {
  return { ...data, isOffline: true };
}

export function onlineResult<T>(data: T): WithOfflineFlag<T> {
  return { ...data, isOffline: false };
}
