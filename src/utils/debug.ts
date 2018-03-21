export function debugTime(label: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.time(label);
  }
}

export function debugTimeEnd(label: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(label);
  }
}
