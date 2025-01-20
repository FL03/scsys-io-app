/*
  Appellation: types <orgs>
  Contrib: @FL03
*/
import { z } from 'zod';
import { Tables } from "@/types";

export type Organization = Tables<'organizations'>;

export const organizationSchema = z.object({
  id: z.string().uuid().readonly(),
  name: z.string({ required_error: 'Please provide a name for the organization' }).default(''),
  description: z.string().default('').nullish(),
  logo: z.string().url().default('').nullish(),
  owner: z.string().uuid().array().default([]),
  members: z.string().uuid().array().default([]),
  metadata: z.record(z.unknown()).default({}),
  website: z.string().url().default('').nullish(),
}, {

}).passthrough();

export type OrganizationSchema = z.infer<typeof organizationSchema>;