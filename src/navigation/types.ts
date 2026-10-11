import { NavigatorScreenParams } from '@react-navigation/native';
export type TabsParams = {
  Explore: undefined;
  Saved: undefined;
  Map: { placeId?: string } | undefined;
  Blog: undefined;
  Facts: undefined;
  Quiz: undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabsParams>;
  Place: { id: string };
  Article: { id: string };
  FactList: { category: string };
  RandomFact: undefined;
  QuizGame: undefined;
  QuizResult: { score: number };
};
