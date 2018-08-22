// @flow

const nameMap = {
  african_storybook: 'African Storybook Project',
  bookdash: 'Book Dash',
  ew: 'Enabling Writers',
  storyweaver: 'StoryWeaver',
  taf: 'The Asia Foundation',
  usaid: 'USAID'
};

export default function getSourceName(sourceId: string): string {
  // Fallback to the input argument if we haven't defined a name
  return nameMap[sourceId] || sourceId;
}
