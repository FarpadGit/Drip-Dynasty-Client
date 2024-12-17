let timer: ReturnType<typeof setTimeout> | undefined;

export function debounce(cb: Function, delay: number) {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    cb();
    timer = undefined;
  }, delay);
}
