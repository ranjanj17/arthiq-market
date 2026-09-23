declare module '@shopify/flash-list' {
  import { Component } from 'react';
  import { FlatListProps } from 'react-native';

  export interface FlashListProps<T> extends FlatListProps<T> {
    estimatedItemSize?: number;
    // Add other props as needed if TS complains later
  }

  export interface ViewToken {
    item: any;
    key: string;
    index: number | null;
    isViewable: boolean;
    section?: any;
  }

  export class FlashList<T> extends Component<FlashListProps<T>> {}
}
