export type Resource = {
  id: string;
  title: string;
  publisher: string;
  kind: 'Video' | 'Article' | 'Visitor info';
  language: string;
  url: string;
  description: string;
};
export const resources: Resource[] = [
  {
    id: 'rick',
    title: 'Bucharest: Eclectic and Rejuvenated',
    publisher: 'Rick Steves’ Europe · YouTube',
    kind: 'Video',
    language: 'English',
    url: 'https://www.youtube.com/watch?v=zUnEi0gtxYY',
    description:
      'A short introduction to the city’s architecture and Old Town. Published in 2016; use for inspiration, not current visitor arrangements.',
  },
  {
    id: 'archive',
    title: 'Bucharest City Museum video archive',
    publisher: 'Muzeul Municipiului București',
    kind: 'Video',
    language: 'Romanian',
    url: 'https://muzeulbucurestiului.ro/arhiva-video.html',
    description:
      'Museum films and recordings from the institution’s own archive.',
  },
  {
    id: 'city',
    title: 'Bucharest visitor guide',
    publisher: 'Romania Tourism',
    kind: 'Article',
    language: 'English',
    url: 'https://romaniatourism.com/bucharest.html',
    description: 'A broad reference for sights, museums and planning a visit.',
  },
  {
    id: 'attractions',
    title: 'Explore Bucharest’s attractions',
    publisher: 'Visit Bucharest',
    kind: 'Article',
    language: 'English',
    url: 'https://visitbucharest.today/bucharest-attractions/',
    description:
      'An independent city guide with ideas for further exploration.',
  },
  {
    id: 'virtual',
    title: 'Explore museum virtual tours',
    publisher: 'Muzeul Municipiului București',
    kind: 'Visitor info',
    language: 'Romanian',
    url: 'https://muzeulbucurestiului.ro/tururi-virtuale.html',
    description: 'Preview museum spaces through the operator’s virtual tours.',
  },
  {
    id: 'art',
    title: 'Art museums: visiting information',
    publisher: 'National Museum of Art of Romania',
    kind: 'Visitor info',
    language: 'Romanian',
    url: 'https://www.mnar.arts.ro/descopera/muzee-satelit',
    description:
      'Operator information for the Art Collections, Zambaccian and Pallady museums, including closure notices.',
  },
  {
    id: 'citybus',
    title: 'Bucharest City Tour',
    publisher: 'STB',
    kind: 'Visitor info',
    language: 'Romanian',
    url: 'https://bct.stb.ro/',
    description:
      'Check the operator’s current sightseeing bus route, schedule and fares.',
  },
];
