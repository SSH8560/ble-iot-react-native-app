import {Permission, PermissionsAndroid, Platform} from 'react-native';

export const hasLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const hasCameraAndMediaFileAccess = async () => {
  try {
    const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];
    if (+Platform.Version >= 33) {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
    } else {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const allPermissionsGranted = Object.values(granted).every(
      permission => permission === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (allPermissionsGranted) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const hasBluetoothPermissions = async () => {
  try {
    const permissions: Permission[] = [];

    console.log(+Platform.Version);

    if (+Platform.Version < 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } else {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      );
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const allPermissionsGranted = Object.values(granted).every(
      permission => permission === PermissionsAndroid.RESULTS.GRANTED,
    );

    if (allPermissionsGranted) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
