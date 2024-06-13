import {supabase} from './supabase';

const RELATION = 'user_devices';

export const postUserDevice = async ({
  device_id,
  device_type,
}: {
  device_id: string;
  device_type: string;
}) => {
  try {
    const {error} = await supabase.from(RELATION).insert({
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
  device_name: string | null;
  created_at: string;
};
