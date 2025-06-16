// types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your screen names and their params
export type RootStackParamList = {
  meetups: undefined; // No params;
  comment: {event_id: number, parent_comment_id?: number, parent_comment_user_name?: string };
  event: {event_id: number};
  profile: {user_id:number};
  chat: {user_id:number};
  chatlist: undefined;
  search: undefined;
  emailsignup: undefined;
  emailsignin: undefined;
  submit: undefined;
  signup:undefined;
  signin:undefined;
  eula: undefined;
  editevent: {event_id: number};
  settings: undefined;
  sendresetlink:undefined;
  userdetailsscreen: undefined;
  resetpassword:{access_token: string, refresh_token: string};
  updateinterests:{user_interests: {interest_code:number, interest_group_code:number, interests: { description: string}}[]};
  leaderboard:undefined;
  featuredEvents:undefined;
  featuredeventsevent:{featured_event_id: number};
  featuredEventsSubmit:undefined;
  organizerOnboarding:undefined;
  ticket: {ticket_id: number};
  ticketfeed: undefined;
  editfeaturedevent: {featured_event_id: number};
  attendeelist: {featured_event_id: number,chat_room_id: number};
  groupchat:{featured_event_id: number};
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
export type UpdateInterestsScreenRouteProps = RouteProp<RootStackParamList, 'updateinterests'>;
export type FeaturedEventsEventScreenRouteProps = RouteProp<RootStackParamList, 'featuredeventsevent'>;
export type TicketScreenRouteProps = RouteProp<RootStackParamList, 'ticket'>;
export type EditFeaturedEventScreenRouteProps = RouteProp<RootStackParamList, 'editfeaturedevent'>;
export type AttendeeListScreenProps = RouteProp<RootStackParamList, 'attendeelist'>;
export type GroupChatScreenProps = RouteProp<RootStackParamList, 'groupchat'>;






  
