import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {Buffer} from 'buffer';
import {Peripheral} from 'react-native-ble-manager';
import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '@/router.d';
import {useBLE} from '@/providers/BleProvider';

interface BleScanScreenProps extends NativeStackScreenProps<RootStackParams> {}

const BleScanScreen = ({navigation}: BleScanScreenProps) => {
  const [availableServiceUUIDs, setAvailableServiceUUIDs] = useState<string[]>(
    [],
  );
  const {
    connectedPeripheral,
    scannedPeripherals,
    scanPeripheral,
    connect,
    getServices,
  } = useBLE();

  useEffect(() => {
    if (connectedPeripheral) navigation.navigate('BleManage');
  }, [navigation, connectedPeripheral]);

  const renderItem: ListRenderItem<Peripheral> = useCallback(({item}) => {
    return (
      <TouchableOpacity
        style={{
          padding: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        key={item.id}
        onPress={async () => {
          const peripheralId = item.id;
          await connect(peripheralId);
          // const {
          //   advertising: {serviceUUIDs},
          //   characteristics,
          // } = await getServices(peripheralId);
          // await notifyCharacteristic({
          //   peripheralId,
          //   serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
          //   characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
          //   onUpdateValue({value, peripheral, characteristic, service}) {
          //     console.log(Buffer.from(value).readFloatLE());
          //   },
          // });
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
          }}>
          {item.advertising.localName}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const handlePressPeripherals = async (peripheralId: string) => {
    await connect(peripheralId);
  };

  return (
    <View>
      <View>
        {Array.from(scannedPeripherals.values()).map(peripheral => (
          <TouchableOpacity
            style={{flexDirection: 'row', padding: 16, backgroundColor: '#000'}}
            key={peripheral.id}
            onPress={() => handlePressPeripherals(peripheral.id)}>
            <Text>{peripheral.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {connectedPeripheral ? (
        <View>
          {availableServiceUUIDs
            .filter(
              uuid =>
                uuid === SERVICE_UUIDS.SERVICE_UUID ||
                uuid === SERVICE_UUIDS.SETTING_SERVICE_UUD,
            )
            .map(uuid => (
              <Button key={uuid} title={uuid} />
            ))}
          <Button
            title="서비스 가져오기"
            onPress={async () => {
              const {services} = await getServices(connectedPeripheral);
              if (services)
                setAvailableServiceUUIDs(services.map(uuids => uuids.uuid));
            }}
          />
        </View>
      ) : (
        <>
          <FlatList
            style={{flex: 1}}
            data={Array.from(scannedPeripherals.values()).filter(
              peripheral =>
                peripheral.advertising.isConnectable && peripheral.name,
            )}
            renderItem={renderItem}
          />
          <Button title="스캔" onPress={() => scanPeripheral(5)} />
        </>
      )}
    </View>
  );
};

export default BleScanScreen;
