export const createKey = (serviceUUID: string, characteristicUUID: string) => {
  return `${serviceUUID}_${characteristicUUID}`;
};
