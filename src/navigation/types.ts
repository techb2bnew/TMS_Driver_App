// Shared param lists. LoadDetail/RouteMap/StopDetails are registered in both
// HomeStack and LoadsStack (same screens, reachable from either tab), so
// their param shapes are declared once here and reused by both.

import type { RouteStop } from '../types';

export type LoadFlowParamList = {
  LoadDetail: { loadId: string };
  RouteMap: { loadId: string };
  // The whole stop is passed through (RouteMapScreen already has it in
  // memory) rather than re-fetched by id — avoids a second round trip.
  StopDetails: { stop: RouteStop };
};

export type HomeStackParamList = LoadFlowParamList & {
  HomeMain: undefined;
  Notifications: undefined;
};

export type LoadsStackParamList = LoadFlowParamList & {
  LoadsMain: undefined;
};

export type LogsStackParamList = {
  LogsMain: undefined;
  LogHistory: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Earnings: undefined;
  Expenses: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ContactSupport: undefined;
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
};
