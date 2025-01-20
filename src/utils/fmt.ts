/*
  Appellation: fmt <utils>
  Contrib: @FL03
*/
import { Timestamptz } from '@/types/datetime';

type FormatAs<TData = any, TOut = unknown> = (value?: TData | null) => TOut;

export const formatAsAccounting: FormatAs<any, React.ReactNode> = (value) => {
  if (!value) return '-';
  return (
    '$\t' +
    Number(value)
      ?.toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
};

export const formatAsDateString: FormatAs<Timestamptz, string> = (value) => {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('en-us', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

// Coercions
export const coerceAnyDate = (value?: any | null) => {
  if (!value) return null;
  return new Date(value);
};

export const coerceTimestamptz = (
  value?: Timestamptz | null
): Date | undefined => {
  if (!value) return undefined;
  return new Date(value);
};

export const coerceDate: FormatAs<any> = (value) => {
  if (!value) return null;
  return new Date(value);
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatAsCurrency: FormatAs<any, string> = (value) => {
  if (!value) return '-';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
};
