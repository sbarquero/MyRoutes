// Contains all about colors for tracks

export const trackColors = ['#ff2b2b', '#1cb226', '#1449e8'];

export const getTrackColor = (index: number) => {
  return trackColors[index % trackColors.length];
};
