import useBLERegistration from '@/hooks/ble/useBLERegistration';
import {hasBluetoothPermissions} from '@/libs/permissions';
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
    startScanDevice,
    stopScanDevice,
    connectDevice,
    deviceList,
    isScanning,
  } = useBLERegistration();

  useEffect(() => {
    hasBluetoothPermissions().then(() => startScanDevice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPeripheral: ListRenderItem<Peripheral> = useCallback(
    ({item: {id, name}}) => {
      const onPressDevice = async () => {
        try {
          if (isScanning) stopScanDevice();

          connectDevice(id);
          navigation.navigate('Wifi', {
            peripheralId: id,
          });
        } catch (e) {
          throw e;
        }
      };

      return (
        <TouchableOpacity
          style={{height: 40, paddingHorizontal: 10, justifyContent: 'center'}}
          onPress={onPressDevice}>
          <Text style={{fontSize: 18, fontWeight: '700'}}>{name}</Text>
        </TouchableOpacity>
      );
    },
    [isScanning],
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        refreshing={isScanning}
        onRefresh={() => startScanDevice()}
        style={{flex: 1}}
        data={deviceList}
        renderItem={renderPeripheral}
      />
    </View>
  );
};

export default FindDeviceScreen;
