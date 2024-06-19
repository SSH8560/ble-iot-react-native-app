import {Buffer} from 'buffer';

export const createKey = (serviceUUID: string, characteristicUUID: string) => {
  return `${serviceUUID}_${characteristicUUID}`;
};

export const btyesToString = (bytes: number[]) => {
  return String.fromCharCode(...bytes);
};
