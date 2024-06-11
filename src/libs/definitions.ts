type ArrayBufferData = {
  CDVType: string;
  bytes: number[];
  data: string;
};

type AdvertisingData = {
  isConnectable: boolean;
  manufacturerData?: Record<string, object>;
  manufacturerRawData: ArrayBufferData;
  rawData: ArrayBufferData;
  serviceData: Record<string, any>;
  serviceUUIDs: string[];
  txPowerLevel: number;
  localName?: string;
};

export type BluetoothDevice = {
  advertising: AdvertisingData;
  id: string;
  name: string | null;
  rssi: number;
};
