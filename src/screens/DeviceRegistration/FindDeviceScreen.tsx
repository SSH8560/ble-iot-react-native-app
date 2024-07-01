import {getServiceUUID} from '@/libs/ble';
import {hasBluetoothPermissions} from '@/libs/permissions';
import {useBLEContext} from '@/providers/BLEProvider';
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
  const {
    isScanning,
    startScan,
    stopScan,
    scannedPeripherals,
    connect,
    retrieveServices,
  } = useBLEContext();

  useEffect(() => {
    hasBluetoothPermissions().then(() => startScan(5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const peripheralList = Array.from(scannedPeripherals.values()).filter(
    ({advertising: {serviceUUIDs}}) => {
      return serviceUUIDs?.includes(getServiceUUID('설정'));
    },
  );

  const renderPeripheral: ListRenderItem<Peripheral> = useCallback(
    ({item: {id, name}}) => {
      return (
        <TouchableOpacity
          style={{height: 40, paddingHorizontal: 10, justifyContent: 'center'}}
          onPress={async () => {
            try {
              stopScan();
              await connect(id);
              await retrieveServices(id);
              navigation.navigate('Wifi', {
                peripheralId: id,
              });
            } catch (e) {
              throw e;
            }
          }}>
          <Text style={{fontSize: 18, fontWeight: '700'}}>{name}</Text>
        </TouchableOpacity>
      );
    },
    [connect, stopScan, navigation, retrieveServices],
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
