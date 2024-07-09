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
  {uuid: 'ed675cf4-ff51-4be8-96e1-4c89b78e0fa0', label: '거리'},
];

export const CHARACTERISTICS: Characteristic[] = [
  // 거리
  {
    uuid: '3e5df93e-36a6-4f01-a9d0-021d6cd599a4',
    label: '거리',
    serviceUuid: 'ed675cf4-ff51-4be8-96e1-4c89b78e0fa0',
    valueType: 'FLOAT',
  },
  {
    uuid: '2da860d3-536f-4e84-afcb-27e0178d3102',
    label: '변화량',
    serviceUuid: 'ed675cf4-ff51-4be8-96e1-4c89b78e0fa0',
    valueType: 'FLOAT',
  },
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
    label: '와이파이',
    serviceUuid: '3126d1ed-031f-4470-8906-3a3b90bc039a',
    valueType: 'STRING',
  },
  {
    uuid: '6dfba204-77ac-437b-8b5a-194d2545c587',
    label: '연결상태',
    serviceUuid: '3126d1ed-031f-4470-8906-3a3b90bc039a',
    valueType: 'STRING',
  },
  {
    uuid: 'b023daf1-980f-4c91-826d-0f0b0e3675c2',
    label: '기기',
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

export const getServiceUUID = (label: string): string => {
  const service = SERVICES.find(service => service.label === label);
  if (!service) {
    throw new Error(`Service with label "${label}" not found`);
  }
  return service.uuid;
};

export const getCharacteristicUUID = (label: string): string => {
  const characteristic = CHARACTERISTICS.find(
    ({label: characteristicLabel}) => characteristicLabel === label,
  );
  if (!characteristic) {
    throw new Error(`Characteristic with label "${label}" not found`);
  }
  return characteristic.uuid;
};
