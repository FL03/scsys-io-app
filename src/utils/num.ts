/*
  Appellation: num <utils>
  Contrib: @FL03
*/

/**
 * @param data: T[]
 */
export const sumBy = <K extends keyof T, T = any>(data: T[], key: K) => {
  return data.reduce((acc, item) => acc + Number(item[key]), 0);
};

/**
 * @param data: T[]
 */
export const averageBy = <K extends keyof T, T = any>(data: T[], key: K) => {
  return sumBy(data, key) / data.length;
};

export const countBy = (data: any[], key: string) => {
  const result = data.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = 1;
    }
    acc[value]++;
    return acc;
  }, {});
  return Object.keys(result).map((key) => ({
    name: key,
    value: result[key],
  }));
};

export const groupBy = (data: any[], key: string) => {
  return data.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {});
};

export const uniqueBy = (data: any[], key: string) => {
  return Array.from(new Set(data.map((item) => item[key])));
};

