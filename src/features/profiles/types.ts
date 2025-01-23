/*
  Appellation: profile <model>
  Contrib: FL03 <jo3mccain@icloud.com>
*/
import { Database, Tables } from '@/types';


export const profileTable = {
  name: 'profiles',
  schema: 'public',
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileTable =Tables<"profiles">;