// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your screen names and their params
export type RootStackParamList = {
  home: undefined; // No params;
  comment: {event_id: number};
  event: {event_id: number};
  profile: {user_id:number};
  message: undefined;
  search: undefined;
};

// Define the navigation prop types
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
