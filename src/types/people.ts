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

export abstract class Person {
  bio_id?: string; // the unique identifier for the person generated as the hash of 1+ biometric identifier
  age: number; // the age of the person; the more exact the better...
  name: PersonName; // the true name of the person

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