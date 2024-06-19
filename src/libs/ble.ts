interface Service {
  uuid: string;
  label: string;
}

interface Characteristic {
  uuid: string;
  label: string;
  serviceUuid: string;
  valueType: 'FLOAT' | 'STRING' | 'NULL';
}

export const SERVICES: Service[] = [
  {uuid: '68b6285c-df48-4809-9b0d-8ff8196996d8', label: '로드셀'},
  {uuid: '3126d1ed-031f-4470-8906-3a3b90bc039a', label: '설정'},
];

export const CHARACTERISTICS: Characteristic[] = [
  // 로드셀
  {
    uuid: '8f46de3a-b1d6-4fa2-9298-a444f2e0f10d',
    label: '무게',
    serviceUuid: '68b6285c-df48-4809-9b0d-8ff8196996d8',
    valueType: 'FLOAT',
  },
  {
    uuid: '717a80d8-2e1e-42fb-bd94-ec7bdb345c65',
    label: '영점',
    serviceUuid: '68b6285c-df48-4809-9b0d-8ff8196996d8',
    valueType: 'NULL',
  },
  {
    uuid: '5ad21362-2a96-4d45-836b-dcb7e28dd1b8',
    label: '계수',
    serviceUuid: '68b6285c-df48-4809-9b0d-8ff8196996d8',
    valueType: 'FLOAT',
  },
  // 설정
  {
    uuid: '1683d984-ba48-4ad4-869c-fcff86e39ce5',
    label: '설정값',
    serviceUuid: '3126d1ed-031f-4470-8906-3a3b90bc039a',
    valueType: 'STRING',
  },
];

export const SERVICE_MAP: Map<string, Service> = new Map();
SERVICES.forEach(service => SERVICE_MAP.set(service.uuid, service));

export const CHARACTERISTIC_MAP: Map<string, Characteristic> = new Map();
CHARACTERISTICS.forEach(characteristic =>
  CHARACTERISTIC_MAP.set(characteristic.uuid, characteristic),
);
