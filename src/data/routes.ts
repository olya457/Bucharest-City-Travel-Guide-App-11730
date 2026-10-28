export type Walk = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
  stops: string[];
  tips: string;
  highlights: string[];
};
export const walks: Walk[] = [
  {
    id: 'old-town',
    title: 'Old Town, slowly',
    subtitle: 'Courtyards, winding streets and grand façades',
    icon: '🏛',
    theme: 'First visit',
    stops: ['sutu', 'lipscani', 'manuc', 'curtea', 'church', 'caru', 'cec'],
    tips: 'Start at Suțu Palace and finish on Calea Victoriei. This walk includes exterior stops; museum admission and meals are optional. Old Princely Court access can be restricted.',
    highlights: [
      'Look for courtyard entrances on Lipscani.',
      'Pause at Stavropoleos without interrupting services.',
      'Compare the scale of the CEC Palace with the narrow Old Town streets.',
    ],
  },
  {
    id: 'victoriei',
    title: 'Along Calea Victoriei',
    subtitle: 'A city told through its architecture',
    icon: '✨',
    theme: 'Architecture',
    stops: [
      'cec',
      'militarycircle',
      'revolution',
      'athenaeum',
      'victoriei',
      'collections',
    ],
    tips: 'Follow public sidewalks north. Cross at marked crossings. Athenaeum access depends on its programme; allow an exterior-only alternative.',
    highlights: [
      'Compare grand civic façades along the avenue.',
      'Take a quiet break near the Athenaeum.',
      'Finish with art collections if the museum is open.',
    ],
  },
  {
    id: 'green-north',
    title: 'A green afternoon',
    subtitle: 'An arch, village houses and a lakeside pause',
    icon: '🌿',
    theme: 'Outdoors',
    stops: ['arch', 'village', 'king'],
    tips: 'Bring water and comfortable shoes. The Village Museum needs a ticket; the park does not. Map pins are approximate locations, so follow public entrances.',
    highlights: [
      'Start with an exterior view of the arch.',
      'Explore a few village houses in depth.',
      'Pick a lakeside bench and leave room for a break.',
    ],
  },
  {
    id: 'rain',
    title: 'A museum day',
    subtitle: 'Natural history, geology and rural culture',
    icon: '☂',
    theme: 'Rainy day',
    stops: ['antipa', 'geology', 'peasant'],
    tips: 'The museums are close together, but transfers are outdoors. Check each venue’s opening days first; the plan is not a live availability check.',
    highlights: [
      'Choose one main museum if you have limited time.',
      'Leave time for a lunch break between collections.',
      'Check temporary exhibitions before buying tickets.',
    ],
  },
  {
    id: 'art',
    title: 'Art & artists',
    subtitle: 'A palace gallery and two intimate creative spaces',
    icon: '🎨',
    theme: 'Culture',
    stops: ['art', 'aman', 'racovita', 'athenaeum'],
    tips: 'Start with the national collection. Check access to Aman and the palace gallery before setting out. Concert tickets are separate from sightseeing.',
    highlights: [
      'Pick a few works to spend time with at the art museum.',
      'Notice the difference between a gallery and an artist’s home.',
      'End outside the Athenaeum or book a concert separately.',
    ],
  },
  {
    id: 'free',
    title: 'Central city on a budget',
    subtitle: 'Public spaces and exterior architecture stops',
    icon: '☀',
    theme: 'Free stops',
    stops: ['university', 'lipscani', 'church', 'cec', 'cismigiu'],
    tips: 'Designed around public spaces and exterior views. Purchases, tours and optional interiors are not included. Finish with a rest in Cișmigiu.',
    highlights: [
      'Use the pedestrian streets to slow down.',
      'Look up at façades instead of rushing between attractions.',
      'Bring a picnic for a park break where permitted.',
    ],
  },
];
