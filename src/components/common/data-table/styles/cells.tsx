/*
  Appellation: cells <module>
  Contrib: @FL03
*/

type StylerOpts = {
  onNull?: any;
}

export const accountingStyle = (value?: number, opts?: StylerOpts) => {
  const { onNull = '-' } = opts || {};
  return value ? `$${value?.toFixed(2)}` : onNull;
};

export const dateStyle = (value?: any, opts?: StylerOpts) => {
  const { onNull = '-' } = opts || {};
  return value ? new Date(value).toLocaleDateString() : onNull;
};