/*
  Appellation: dbmap <data>
  Contrib: @FL03
*/
import { profileTable } from '@/features/profiles/types';

type DbTable = {
  name: string;
  schema?: 'public' | 'auth' | string;
};
/**
 * The products table
 */

export const tables: Record<string, DbTable> = {
  profiles: profileTable,
};

export const schemas = {
  public: {
    name: 'public',
    tables: tables,
  },
};

export const database = {
  schemas: schemas,
};

export default database;
