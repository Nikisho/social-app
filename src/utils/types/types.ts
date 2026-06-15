// types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your screen names and their params
export type RootStackParamList = {
  meetups: undefined; // No params;
  comment: {event_id: number, parent_comment_id?: number, parent_comment_user_name?: string };
  event: {event_id: number};
  profile: {user_id:number};
  following: {user_id:number};
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
  featuredEvents:{interest?: {interest_code:number, interests: {description:string}}};
  featuredeventsevent:{featured_event_id: number};
  featuredEventsSubmit:undefined;
  organizerOnboarding:undefined;
  ticket: {ticket_id: number};
  ticketfeed: undefined;
  editfeaturedevent: {featured_event_id: number};
  edittickets: {featured_event_id: number};
  eventanalytics: {featured_event_id: number};
  manageevent: {featured_event_id: number};
  attendeelist: {featured_event_id: number,chat_room_id: number};
  groupchat:{organizer_id: number};
  dashboard: undefined;
  privacypolicy: undefined;
  about:undefined;
  ticketscanner:{featured_event_id: number};
  managememberships:undefined;
  createmembership:undefined;
  followers: {user_id: number};
  emailattendees: {featured_event_id: number};
  guestlist: {featured_event_id: number};
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
export type FeaturedEventsScreenRouteProps = RouteProp<RootStackParamList, 'featuredEvents'>;
export type FollowingScreenRouteProp = RouteProp<RootStackParamList, 'following'>;
export type TicketScannerScreenRouteProp = RouteProp<RootStackParamList, 'ticketscanner'>;
export type EventAnalyticsScreenRouteProp = RouteProp<RootStackParamList, 'eventanalytics'>;
export type ManageEventScreenRouteProp = RouteProp<RootStackParamList, 'manageevent'>;
export type EditTicketsScreenRouteProp = RouteProp<RootStackParamList, 'edittickets'>;
export type Base64<imageType extends string> = `data:image/${imageType};base64${string}`;

export interface EventDataProps {
  title: string
  description: string
  organizer_id: number
  series_id: number;
  price: string
  time: string
  location: string
  image_url: string | { base64: Base64<'jpg'>, uri: string }
  is_free: boolean
  featured_event_id: number
  tickets_sold: number
  date: Date;
  end_time: string;
  end_date: Date;
  recurring_series: {
    paused: boolean
  }
  ticket_types: {
    name: string;
    price: string;
    quantity: number;
    tickets_sold: number;
    ticket_type_id: number;
    description: string
    is_free: boolean;
  }[]
  max_tickets: number
  organizers: {
    user_id: number
    users: { name: string; photo: string }
  }
}




  
