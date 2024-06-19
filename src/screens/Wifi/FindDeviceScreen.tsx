import {hasBluetoothPermissions} from '@/libs/permissions';
import {useBLE} from '@/providers/BleProvider';
import {DeviceRegistrationParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';

interface FindDeviceScreenProps
  extends NativeStackScreenProps<DeviceRegistrationParams, 'FindDevice'> {}

const FindDeviceScreen = ({navigation}: FindDeviceScreenProps) => {
  const {isScanning, startScan, scannedPeripherals, connect, retrieveServices} =
    useBLE();

  useEffect(() => {
    hasBluetoothPermissions().then(() => startScan(5));
  }, []);

  const peripheralList = Array.from(scannedPeripherals.values());

  const renderPeripheral: ListRenderItem<Peripheral> = useCallback(
    ({item: {id, name}}) => {
      return (
        <TouchableOpacity
          onPress={async () => {
            try {
              await connect(id);
              const ser = await retrieveServices(id);
              console.log(ser);
              navigation.navigate('Wifi', {
                peripheralId: id,
              });
            } catch (e) {
              throw e;
            }
          }}>
          <Text style={{color: 'black'}}>{name}</Text>
        </TouchableOpacity>
      );
    },
    [],
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        refreshing={isScanning}
        onRefresh={() => startScan(5)}
        style={{flex: 1}}
        data={peripheralList}
        renderItem={renderPeripheral}
      />
    </View>
  );
};

export default FindDeviceScreen;
