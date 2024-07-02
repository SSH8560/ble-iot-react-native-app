import {Buffer} from 'buffer';

export const createHandlerKey = ({
  peripheral,
  service,
  characteristic,
}: {
  peripheral: string;
  service: string;
  characteristic: string;
}): string => {
  return `${peripheral}_${service}_${characteristic}`;
};

export const createKey = (serviceUUID: string, characteristicUUID: string) => {
  return `${serviceUUID}_${characteristicUUID}`;
};

export const bytesToString = (bytes: number[]) => {
  return String.fromCharCode(...bytes);
};

export const stringToBytes = (str: string) => {
  return Array.from(Buffer.from(str));
};

export const bytesToNumber = (bytes: number[]) => {
  return Buffer.from(bytes).readFloatLE();
};
