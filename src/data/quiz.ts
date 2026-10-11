export type Question = { question: string; answers: string[]; correct: number };
export const questions: Question[] = [
  {
    question: 'What is the capital of Romania?',
    answers: ['Cluj-Napoca', 'Bucharest', 'Brașov', 'Timișoara'],
    correct: 1,
  },
  {
    question: 'Which river flows through Bucharest?',
    answers: ['Danube', 'Olt', 'Dâmbovița', 'Mureș'],
    correct: 2,
  },
  {
    question: 'Which famous building is located in central Bucharest?',
    answers: [
      'Palace of Parliament',
      'Bran Castle',
      'Peleș Castle',
      'Corvin Castle',
    ],
    correct: 0,
  },
  {
    question: 'What nickname was historically given to Bucharest?',
    answers: ['Little Rome', 'Little Paris', 'Eastern Vienna', 'New Prague'],
    correct: 1,
  },
  {
    question: 'Which landmark resembles the Arc de Triomphe in Paris?',
    answers: [
      'CEC Palace',
      'Romanian Athenaeum',
      'Arcul de Triumf',
      'Suțu Palace',
    ],
    correct: 2,
  },
  {
    question: 'Which historic ruler is associated with medieval Bucharest?',
    answers: [
      'Vlad the Impaler',
      'Julius Caesar',
      'Napoleon Bonaparte',
      'Charlemagne',
    ],
    correct: 0,
  },
  {
    question: 'In which year was Bucharest first documented?',
    answers: ['1259', '1359', '1459', '1559'],
    correct: 2,
  },
  {
    question: 'What is the name of Bucharest’s famous concert hall?',
    answers: [
      'Romanian Athenaeum',
      'National Arena',
      'Manuc’s Inn',
      'Royal Fortress',
    ],
    correct: 0,
  },
  {
    question: 'Which park is the oldest public garden in Bucharest?',
    answers: [
      'Tineretului Park',
      'Carol I Park',
      'Cișmigiu Garden',
      'Drumul Taberei Park',
    ],
    correct: 2,
  },
  {
    question: 'What can visitors find at the Village Museum?',
    answers: [
      'Traditional Romanian buildings',
      'Modern skyscrapers',
      'Ancient Roman ships',
      'Underground trains',
    ],
    correct: 0,
  },
  {
    question: 'Which natural area developed on an unfinished reservoir?',
    answers: [
      'Cișmigiu Garden',
      'Văcărești Nature Park',
      'Botanical Garden',
      'King Michael I Park',
    ],
    correct: 1,
  },
  {
    question: 'What was Bucur according to a popular legend?',
    answers: ['A king', 'A merchant', 'A shepherd', 'A soldier'],
    correct: 2,
  },
  {
    question: 'Which palace houses the National Museum of Art of Romania?',
    answers: ['Royal Palace', 'Cotroceni Palace', 'Suțu Palace', 'CEC Palace'],
    correct: 0,
  },
  {
    question: 'What architectural style is Stavropoleos Church famous for?',
    answers: ['Gothic', 'Art Deco', 'Brâncovenesc', 'Brutalist'],
    correct: 2,
  },
  {
    question: 'Which major disaster struck Bucharest on March 4, 1977?',
    answers: ['Flood', 'Earthquake', 'Tornado', 'Wildfire'],
    correct: 1,
  },
  {
    question: 'What is Manuc’s Inn?',
    answers: [
      'A historic inn',
      'A railway station',
      'A museum of aviation',
      'A modern stadium',
    ],
    correct: 0,
  },
  {
    question: 'Which Bucharest museum focuses on natural history?',
    answers: [
      'Suțu Palace',
      'Grigore Antipa Museum',
      'Village Museum',
      'National Museum of Art',
    ],
    correct: 1,
  },
  {
    question: 'Which lake is surrounded by King Michael I Park?',
    answers: ['Herăstrău Lake', 'Snagov Lake', 'Morii Lake', 'Cernica Lake'],
    correct: 0,
  },
  {
    question: 'What major event devastated much of Bucharest in 1847?',
    answers: [
      'An earthquake',
      'A military invasion',
      'A great fire',
      'A major flood',
    ],
    correct: 2,
  },
  {
    question:
      'Which building is famous for its monumental scale and enormous interior?',
    answers: [
      'Romanian Athenaeum',
      'Palace of Parliament',
      'Stavropoleos Church',
      'Manuc’s Inn',
    ],
    correct: 1,
  },
];
export function sampleQuestions(random: () => number = Math.random) {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5);
}
