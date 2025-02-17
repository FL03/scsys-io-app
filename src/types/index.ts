/*
  Appellation: types <module>
  Contrib: @FL03
*/
export * from './address';
export * from './charts';
export * from './datetime';
export * from './func';
export * from './props';
export * from './supabase';

export * from './database.types';

export enum Crud {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type FormEventHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void;

/**
 * Any type with an `id` key.
 */
export type Identifiable<Id = string> = { id: Id };

export type Nullish<T> = T | null | undefined;

export type Url = string | import('url').UrlObject;