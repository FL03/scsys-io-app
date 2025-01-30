/*
  Appellation: types <module>
  Contrib: @FL03
*/
export * from './address';
export * from './charts';
export * from './datetime';
export * from './func';
export * from './props';

export * from './database.types';

export type Crud = 'create' | 'read' | 'update' | 'delete';

export type FormEventHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void;

export type TaskStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export type Identifiable<Id = string> = { id: Id };

export type Nullish<T> = T | null | undefined;

export type SupaClient =
  | import('@supabase/supabase-js').SupabaseClient
  | Promise<import('@supabase/supabase-js').SupabaseClient>;

export type Url = string | import('url').UrlObject;