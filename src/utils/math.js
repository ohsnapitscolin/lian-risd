export function progress(min, max, percent, peak = false) {
  if (!peak) {
    return (max - min) * percent + min;
  } else if (percent <= 0.5) {
    return (max - min) * percent * 2 + min;
  } else {
    return (max - min) * (1 - percent) * 2 + min;
  }
}
