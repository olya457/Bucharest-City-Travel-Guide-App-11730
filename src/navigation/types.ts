import { NavigatorScreenParams } from '@react-navigation/native';
export type TabsParams = {
  Explore: undefined;
  MyTrip: undefined;
  Routes: undefined;
  Guide: undefined;
  Map: { placeId?: string; stopIds?: string[] } | undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabsParams>;
  Place: { id: string };
  Walk: { id: string };
  Blog: undefined;
  Facts: undefined;
  Quiz: undefined;
  Article: { id: string };
  FactList: { category: string };
  RandomFact: undefined;
  QuizGame: undefined;
  QuizResult: { score: number };
};
