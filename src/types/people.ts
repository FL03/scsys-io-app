/*
  Appellation: people <module>
  Contrib: @FL03
*/

export type PersonName = {
  full_name?: string;
  prefix?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
};

export class Name implements PersonName {
  full_name?: string;
  prefix?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;

  constructor(name: PersonName) {
    this.full_name = name.full_name;
    this.prefix = name.prefix;
    this.first_name = name.first_name;
    this.middle_name = name.middle_name;
    this.last_name = name.last_name;
    this.suffix = name.suffix;
  }
}

export abstract class Person {
  bio_id?: string; // the unique identifier for the person generated as the hash of 1+ biometric identifier
  age: number; // the age of the person; the more exact the better...
  name: PersonName; // the birtname of the person

  constructor(name: PersonName, age: number) {
    this.name = name;
    this.age = age;
  }
}

export type ContactInfo = {
  address?: string | import("./address").Address;
  email?: string;
  phone?: string;
  name?: string | PersonName;
};