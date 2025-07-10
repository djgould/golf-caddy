export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)/login': undefined;
  '+not-found': undefined;
};

export type TabParamList = {
  index: undefined;
  map: undefined;
  round: undefined;
  settings: undefined;
};

// Declare global types for Expo Router
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}