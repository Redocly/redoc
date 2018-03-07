export function debugTime(label: string) {
  if (__REDOC_DEV__) {
    console.time(label);
  }
}

export function debugTimeEnd(label: string) {
  if (__REDOC_DEV__) {
    console.timeEnd(label);
  }
}
