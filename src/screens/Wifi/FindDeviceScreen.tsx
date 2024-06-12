import {hasBluetoothPermissions} from '@/libs/permissions';
import {useBLE} from '@/providers/BleProvider';
import {DeviceRegistrationParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';

interface FindDeviceScreenProps
  extends NativeStackScreenProps<DeviceRegistrationParams, 'FindDevice'> {}

const FindDeviceScreen = ({navigation}: FindDeviceScreenProps) => {
  const {isScanning, scanPeripheral, scannedPeripherals, connect} = useBLE();

  useEffect(() => {
    hasBluetoothPermissions().then(() => scanPeripheral(5));
  }, []);

  const peripheralList = Array.from(scannedPeripherals.values());

  const renderPeripheral: ListRenderItem<Peripheral> = useCallback(
    ({item: {id, name}}) => {
      return (
        <TouchableOpacity
          onPress={async () => {
            try {
              await connect(id);

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
      {/* {isScanning && <ActivityIndicator size={'large'} />} */}
      <FlatList
        refreshing={isScanning}
        onRefresh={() => scanPeripheral(5)}
        style={{flex: 1}}
        data={peripheralList}
        renderItem={renderPeripheral}
      />
    </View>
  );
};

export default FindDeviceScreen;
