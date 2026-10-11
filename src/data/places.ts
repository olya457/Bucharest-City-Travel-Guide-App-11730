import { ImageSourcePropType } from 'react-native';
import { images } from './images';
export type Category = 'All' | 'Historical' | 'Parks' | 'Museums';
export type Place = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  latitude: number;
  longitude: number;
  image: ImageSourcePropType;
  description: string;
};
export const categories: Category[] = ['All', 'Historical', 'Parks', 'Museums'];
export const categoryIcons = {
  All: '🌍',
  Historical: '🏛️',
  Parks: '🌿',
  Museums: '🎨',
};
export const categoryLabels = {
  All: 'All Locations',
  Historical: 'Historical Landmarks',
  Parks: 'Parks & Nature',
  Museums: 'Museums & Culture',
};
export const places: Place[] = [
  {
    id: 'palace',
    name: 'Palace of Parliament',
    category: 'Historical',
    latitude: 44.4275,
    longitude: 26.0875,
    image: images.palace,
    description:
      'One of Bucharest’s most recognizable landmarks and one of the largest administrative buildings in the world. Its monumental halls, massive stone façade, and imposing scale reflect the ambitious architecture of Romania’s communist period.',
  },
  {
    id: 'athenaeum',
    name: 'Romanian Athenaeum',
    category: 'Historical',
    latitude: 44.4413,
    longitude: 26.0974,
    image: images.athenaeum,
    description:
      'An iconic concert hall in central Bucharest, famous for its elegant neoclassical architecture, impressive dome, and richly decorated interior. It is one of Romania’s most important cultural and architectural symbols.',
  },
  {
    id: 'arch',
    name: 'Arcul de Triumf',
    category: 'Historical',
    latitude: 44.4673,
    longitude: 26.0781,
    image: images.arch,
    description:
      'A monumental triumphal arch commemorating Romania’s military victories and national history. The current structure was completed in the 1930s and features detailed stone reliefs and sculptures.',
  },
  {
    id: 'church',
    name: 'Stavropoleos Monastery Church',
    category: 'Historical',
    latitude: 44.4317,
    longitude: 26.0984,
    image: images.church,
    description:
      'A small historic Orthodox church in Bucharest’s Old Town, renowned for its Brâncovenesc architectural style, intricate stone carvings, peaceful courtyard, and richly decorated interior.',
  },
  {
    id: 'cec',
    name: 'CEC Palace',
    category: 'Historical',
    latitude: 44.4314,
    longitude: 26.0971,
    image: images.cec,
    description:
      'A striking historic building on Calea Victoriei, distinguished by its large glass-and-metal dome and elaborate Beaux-Arts architecture. It remains one of the most recognizable buildings in central Bucharest.',
  },
  {
    id: 'king',
    name: 'King Michael I Park',
    category: 'Parks',
    latitude: 44.4704,
    longitude: 26.0827,
    image: images.king,
    description:
      'One of Bucharest’s largest and most popular green spaces, surrounding Herăstrău Lake. The park offers long walking paths, waterfront areas, gardens, recreational spaces, and extensive tree-lined landscapes.',
  },
  {
    id: 'cismigiu',
    name: 'Cișmigiu Garden',
    category: 'Parks',
    latitude: 44.437,
    longitude: 26.0907,
    image: images.cismigiu,
    description:
      'The oldest public garden in Bucharest, located close to the historic city center. It features a picturesque lake, shaded walking paths, landscaped gardens, fountains, bridges, and historic monuments.',
  },
  {
    id: 'tineretului',
    name: 'Tineretului Park',
    category: 'Parks',
    latitude: 44.4074,
    longitude: 26.1057,
    image: images.tineretului,
    description:
      'A large urban park in southern Bucharest with expansive lawns, a lake, walking and cycling routes, playgrounds, and recreational areas. It is a popular destination for outdoor activities and relaxation.',
  },
  {
    id: 'botanical',
    name: 'Dimitrie Brândză Botanical Garden',
    category: 'Parks',
    latitude: 44.4372,
    longitude: 26.0634,
    image: images.botanical,
    description:
      'Bucharest’s major botanical garden, home to thousands of plant species, landscaped outdoor collections, greenhouses, ponds, and thematic gardens. It provides a quiet natural environment close to the city center.',
  },
  {
    id: 'vacaresti',
    name: 'Văcărești Nature Park',
    category: 'Parks',
    latitude: 44.3994,
    longitude: 26.1346,
    image: images.vacaresti,
    description:
      'A remarkable urban wetland formed inside a former reservoir area. Often described as an urban delta, it supports numerous species of birds, insects, reptiles, and plants within the densely developed city.',
  },
  {
    id: 'art',
    name: 'National Museum of Art of Romania',
    category: 'Museums',
    latitude: 44.4397,
    longitude: 26.0963,
    image: images.art,
    description:
      'Romania’s principal art museum, located in the former Royal Palace. Its collections include Romanian medieval and modern art alongside significant works by major European artists.',
  },
  {
    id: 'village',
    name: 'Dimitrie Gusti National Village Museum',
    category: 'Museums',
    latitude: 44.4728,
    longitude: 26.0767,
    image: images.village,
    description:
      'An open-air museum showcasing traditional Romanian village life. Visitors can explore authentic houses, churches, workshops, windmills, and other historic structures relocated from different regions of Romania.',
  },
  {
    id: 'peasant',
    name: 'National Museum of the Romanian Peasant',
    category: 'Museums',
    latitude: 44.4544,
    longitude: 26.084,
    image: images.peasant,
    description:
      'An ethnographic museum dedicated to Romanian rural culture and traditional ways of life. Its collections feature clothing, ceramics, religious objects, household items, textiles, and traditional crafts.',
  },
  {
    id: 'antipa',
    name: 'Grigore Antipa National Museum of Natural History',
    category: 'Museums',
    latitude: 44.4549,
    longitude: 26.0845,
    image: images.antipa,
    description:
      'One of Romania’s most important natural history museums. Its exhibitions explore biodiversity, evolution, ecosystems, geology, and wildlife through extensive scientific collections and modern displays.',
  },
  {
    id: 'sutu',
    name: 'Museum of Bucharest – Suțu Palace',
    category: 'Museums',
    latitude: 44.4344,
    longitude: 26.1023,
    image: images.sutu,
    description:
      'A city history museum housed inside the elegant Suțu Palace. Its exhibitions present the development of Bucharest through historical objects, photographs, maps, documents, artworks, and archaeological discoveries.',
  },
];
