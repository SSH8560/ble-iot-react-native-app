import {supabase} from './supabase';

const RELATION = 'user_devices';

export const postUserDevice = async ({
  peripheral_id,
  device_id,
  device_type,
}: Pick<UserDevice, 'peripheral_id' | 'device_id' | 'device_type'>) => {
  try {
    const {error} = await supabase.from(RELATION).insert({
      peripheral_id,
      device_id,
      device_type,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    throw e;
  }
};

export const getUserDevices = async () => {
  try {
    const {data, error} = await supabase.from(RELATION).select('*');
    if (error) throw new Error(error.message);

    return data as UserDevice[];
  } catch (e) {
    throw e;
  }
};

export type UserDevice = {
  id: number;
  user_id: string;
  device_id: string;
  device_type: string;
  peripheral_id: string;
  device_name: string | null;
  created_at: string;
};
