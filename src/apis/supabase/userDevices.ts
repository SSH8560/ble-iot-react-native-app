import {supabase} from './supabase';

const RELATION = 'user_devices';

export const postUserDevice = async (device_id: string) => {
  try {
    const {error} = await supabase.from(RELATION).insert({
      device_id,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    throw e;
  }
};
