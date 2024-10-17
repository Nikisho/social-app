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
  emailsignup: {name:string, age:string | null};
  emailsignin: undefined;
  submit: undefined;
  signup:undefined;
  signin:undefined;
  eula: undefined;
  editevent: {event_id: number};
  settings: undefined;
  sendresetlink:undefined;
  resetpassword:{access_token: string, refresh_token: string};
};

// Define the navigation prop types
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, 'chat'>;
export type EmailSignUpScreenRouteProp = RouteProp<RootStackParamList, 'emailsignup'>;
export type CommentScreenRouteProp = RouteProp<RootStackParamList, 'comment'>;
export type EventScreenRouteProp = RouteProp<RootStackParamList, 'event'>;
export type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'profile'>;
export type EditEventScreenRouteProp = RouteProp<RootStackParamList, 'editevent'>;
export type ResetPasswordScreenRouteProps = RouteProp<RootStackParamList, 'resetpassword'>;





  
