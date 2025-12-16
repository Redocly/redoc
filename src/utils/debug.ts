export function debugTime(label: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.time(label);
  }
}

export function debugTimeEnd(label: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(label);
  }
}
