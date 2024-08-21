// types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your screen names and their params
export type RootStackParamList = {
  home: undefined; // No params;
  comment: {event_id: number};
  event: {event_id: number};
  profile: {user_id:number};
  chat: {user_id:number};
  chatlist: undefined;
  search: undefined;
  emailsignup: {name:string, age:string};
  emailsignin: undefined;
  submit: undefined;
  signup:undefined;
  signin:undefined;
};

// Define the navigation prop types
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'chat'>;
export type EmailSignUpScreenRouteProp = RouteProp<RootStackParamList, 'emailsignup'>;
export type CommentScreenRouteProp = RouteProp<RootStackParamList, 'comment'>;
export type EventScreenRouteProp = RouteProp<RootStackParamList, 'event'>;



  
