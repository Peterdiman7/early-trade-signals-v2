/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type HeadlineTickersQueryVariables = Exact<{ [key: string]: never; }>;


export type HeadlineTickersQuery = { __typename?: 'Query', headlineTickers: Array<{ __typename?: 'Instrument', id: string, name: string, snapshot: { __typename?: 'Snapshot', id: string, open: number, high: number, low: number, close: number, change: number, changePercent: number, when: any } }> };

export type GetInstrumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstrumentQuery = { __typename?: 'Query', instrument: { __typename?: 'Instrument', id: string, name: string, snapshot: { __typename?: 'Snapshot', id: string, close: number, change: number, changePercent: number, when: any } } };

export type OnSnapshotSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OnSnapshotSubscription = { __typename?: 'Subscription', snapshot: { __typename?: 'Snapshot', id: string, close: number, change: number, changePercent: number, when: any } };


export const HeadlineTickersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"headlineTickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headlineTickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"open"}},{"kind":"Field","name":{"kind":"Name","value":"high"}},{"kind":"Field","name":{"kind":"Name","value":"low"}},{"kind":"Field","name":{"kind":"Name","value":"close"}},{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"when"}}]}}]}}]}}]} as unknown as DocumentNode<HeadlineTickersQuery, HeadlineTickersQueryVariables>;
export const GetInstrumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstrument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instrument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"close"}},{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"when"}}]}}]}}]}}]} as unknown as DocumentNode<GetInstrumentQuery, GetInstrumentQueryVariables>;
export const OnSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnSnapshot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"snapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"close"}},{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"when"}}]}}]}}]} as unknown as DocumentNode<OnSnapshotSubscription, OnSnapshotSubscriptionVariables>;