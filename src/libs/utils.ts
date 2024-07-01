import {Buffer} from 'buffer';

export const createKey = (serviceUUID: string, characteristicUUID: string) => {
  return `${serviceUUID}_${characteristicUUID}`;
};

export const bytesToString = (bytes: number[]) => {
  return String.fromCharCode(...bytes);
};

export const stringToBytes = (str: string) => {
  return Array.from(Buffer.from(str));
};
