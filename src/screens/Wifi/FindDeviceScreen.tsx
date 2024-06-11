import {hasBluetoothPermissions} from '@/libs/permissions';
import {useBLE} from '@/providers/BleProvider';
import {DeviceRegistrationParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';

interface FindDeviceScreenProps
  extends NativeStackScreenProps<DeviceRegistrationParams, 'FindDevice'> {}

const FindDeviceScreen = ({navigation}: FindDeviceScreenProps) => {
  const {scanPeripheral, scannedPeripherals, connect} = useBLE();

  useEffect(() => {
    hasBluetoothPermissions().then(() => scanPeripheral(5));
  }, []);

  const peripheralList = Array.from(scannedPeripherals.values());

  return (
    <View>
      {/* {isScanning && <ActivityIndicator size={'large'} />} */}
      {peripheralList.map(peripheral => {
        return (
          <TouchableOpacity
            onPress={async () => {
              if (!peripheral.id) return;

              try {
                await connect(peripheral.id);

                navigation.navigate('Wifi', {
                  peripheralId: peripheral.id,
                });
              } catch (e) {
                throw e;
              }
            }}>
            <Text style={{color: 'black'}}>{peripheral.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FindDeviceScreen;
