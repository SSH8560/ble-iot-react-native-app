import {CHARACTERISTIC_UUIDS, SERVICE_UUIDS} from '@/libs/ble';
import {useBLE} from '@/providers/BleProvider';
import {RootStackParams} from '@/router.d';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {Buffer} from 'buffer';
import {getUser} from '@/apis/supabase/auth';

interface BleManageScreenProps
  extends NativeStackScreenProps<RootStackParams> {}

const BleManageScreen = ({navigation}: BleManageScreenProps) => {
  const {
    connectedPeripheral,
    disconnect,
    retrieveServices,
    startNotification,
    stopNotification,
    write,
  } = useBLE();
  const [weight, setWeight] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  useEffect(() => {
    if (!connectedPeripheral) {
      navigation.goBack();
      return;
    }

    retrieveServices(connectedPeripheral).then(({advertising}) => {
      startNotification({
        peripheralId: connectedPeripheral,
        serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
        characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
        onUpdateValue: ({value}) => {
          setWeight(Buffer.from(value).readFloatLE().toFixed(2));
        },
      });
      console.log(advertising);
    });

    return () => {
      stopNotification({
        peripheralId: connectedPeripheral,
        serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
        characteristicUUID: CHARACTERISTIC_UUIDS.CHARACTERISTIC_UUID,
      });
    };
  }, [navigation, connectedPeripheral, retrieveServices]);

  if (!connectedPeripheral) return <></>;

  return (
    <View>
      <Button
        title="연결 해제"
        onPress={() => connectedPeripheral && disconnect(connectedPeripheral)}
      />
      <Button
        title="영점"
        onPress={() =>
          write({
            peripheralId: connectedPeripheral,
            serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
            characteristicUUID:
              CHARACTERISTIC_UUIDS.LOAD_CELL_TARE_CHARACTERISTIC_UUID,
            data: [],
          })
        }
      />
      <View style={{padding: 16}}>
        <Text style={{color: '#000'}}>
          <Text>무게</Text> : {weight}
        </Text>
      </View>
      <TextInput
        style={{color: '#000'}}
        keyboardType="numeric"
        onChangeText={text =>
          !isNaN(parseFloat(text)) && setScaleFactor(parseFloat(text))
        }
      />
      <Button
        title="조절"
        onPress={() =>
          write({
            peripheralId: connectedPeripheral,
            serviceUUID: SERVICE_UUIDS.SERVICE_UUID,
            characteristicUUID:
              CHARACTERISTIC_UUIDS.LOAD_CELL_CALIBRATION_CHARACTERISTIC_UUID,
            data: Array.from(Buffer.from(scaleFactor.toString())),
          })
        }
      />
      <Button
        title="전송"
        onPress={async () => {
          const {id} = await getUser();

          write({
            peripheralId: connectedPeripheral,
            serviceUUID: SERVICE_UUIDS.SETTING_SERVICE_UUD,
            characteristicUUID:
              CHARACTERISTIC_UUIDS.SETTING_CHARACTERISTIC_UUID,
            data: Array.from(Buffer.from(`KT_GiGA_59D9,6dbb3hf606,${id}`)),
          });
        }}
      />
    </View>
  );
};

export default BleManageScreen;
