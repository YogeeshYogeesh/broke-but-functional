let counter = 0;

export function makeId() {
  counter += 1;
  const random = Math.random().toString(36).slice(2, 7);
  return `${Date.now().toString(36)}-${counter.toString(36)}-${random}`;
}
