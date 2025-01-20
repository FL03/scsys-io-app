/*
  Appellation: address <types>
  Contrib: @FL03
*/

export function mailingAddressString({
  address,
  city,
  state,
  zip_code,
}: MailingAddress) {
  return `${address}, ${city}, ${state} ${zip_code}`;
}

export type MailingAddress = {
  address?: string | [string, string];
  city?: string;
  state?: string;
  zip_code?: number | string;
};

export class Address implements MailingAddress {
  _address: string | [string, string];
  _city: string;
  _state: string;
  _zip_code: number | string;

  constructor({ address = '', city = '', state = '', zip_code = '00000' }: MailingAddress) {
    this._address = address;
    this._city = city;
    this._state = state;
    this._zip_code = zip_code;
  }

  fromString(input: string) {
    const [address, city, state, zip_code] = input.split(',');
    this._address = address;
    this._city = city;
    this._state = state;
    this._zip_code = zip_code;
  }

  toString() {
    const parts = [this._address, this.city, `${this.state} ${this.zip_code}`];
    return parts.join(', ');
  }

  get address() {
    return this._address;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get zip_code() {
    return this._zip_code;
  }

  set address(value: string | [string, string]) {
    this._address = value;
  }

  set city(value: string) {
    this._city = value;
  }

  set state(value: string) {
    this._state = value;
  }

  set zip_code(value: number | string) {
    this._zip_code = value;
  }

}
