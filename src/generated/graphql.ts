/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  snapshot: Snapshot;
};

export type Query = {
  __typename?: 'Query';
  headlineTickers: Array<Instrument>;
  instrument: Instrument;
};


export type QueryInstrumentArgs = {
  id: Scalars['ID']['input'];
};

export type Snapshot = {
  __typename?: 'Snapshot';
  change: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  close: Scalars['Float']['output'];
  high: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  low: Scalars['Float']['output'];
  open: Scalars['Float']['output'];
  when: Scalars['Date']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  snapshot: Snapshot;
};


export type SubscriptionSnapshotArgs = {
  id: Scalars['ID']['input'];
};
