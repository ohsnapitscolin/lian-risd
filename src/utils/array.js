export function groupBy(array, fn) {
  return array.reduce(function (memo, element) {
    (memo[fn(element)] = memo[fn(element)] || []).push(element);
    return memo;
  }, {});
}

export function randomValue(array) {
  const index = [Math.floor(Math.random() * array.length)];
  return array[index];
}
