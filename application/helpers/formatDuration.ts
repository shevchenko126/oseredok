export const formatDuration = (seconds:number) => {
  const sec = Math.floor(seconds % 60);
  const min = Math.floor((seconds / 60) % 60);
  const hrs = Math.floor((seconds / 3600) % 24);
  const days = Math.floor((seconds / 86400) % 365);
  const years = Math.floor(seconds / (86400 * 365));

  if (years > 0) {
    return `${years}y${days > 0 ? ` ${days}d` : ''}`;
  } else if (days > 0) {
    return `${days}d${hrs > 0 ? ` ${hrs}h` : ''}`;
  } else if (hrs > 0) {
    return `${hrs}h${min > 0 ? ` ${min}m` : ''}`;
  } else if (min > 0) {
    return `${min}m${sec > 0 ? ` ${sec}s` : ''}`;
  } else {
    return `${sec}s`;
  }
};