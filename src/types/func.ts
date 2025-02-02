/*
  Appellation: func <module>
  Contrib: @FL03
*/

export type AsyncCallback<T = unknown, O = void> = (args: T) => Promise<O>;


export type ChangeHandler = <T>(value?: T) => void | Promise<void> | PromiseLike<void>;

export type CompareFn<T = any> = (a: T, b: T) => number;


export type Fetcher<Args = any, TOut = unknown> = (
  args: Args,
) => Promise<TOut>;

export type NextMetaGenerator<TProps = any> = (
  props: TProps,
  parent: import('next').ResolvingMetadata
) => Promise<import('next').Metadata>;
