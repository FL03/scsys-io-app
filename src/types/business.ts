/*
  Appellation: business <types>
  Contrib: @FL03
*/
import { Address } from './address';

export type BusinessHours = {
  day?: string | number | Date; // "sunday": 0 | "monday": 1 | "tuesday": 2 | "wednesday": 3 | "thursday": 4 | "friday": 5 | "saturday": 6;
  open?: string | number;
  close?: string | number;
};

export interface Appellation {
  prefix?: string;
  name?: string;
  suffix?: string;
}

export type ContactInfo = {
  address?: string | Address;
  email?: string;
  phone?: string;
  name?: string | Appellation;
};

export type Business = {
  classification?:
    | 'llc'
    | 'corporation'
    | 'partnership'
    | 'sole proprietorship'
    | 'non-profit'
    | string;
  homepage?: string;
  logo?: string;
  name?: string;
  phone?: string;
};
