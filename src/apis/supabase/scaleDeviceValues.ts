import {supabase} from './supabase';

const RELATION = 'scale_device_values';

export const getScaleDeviceValues = async (device_id: string) => {
  const {data, error} = await supabase
    .from(RELATION)
    .select('value, created_at')
    .eq('device_id', device_id);
  if (error) {
    throw new Error(error.message);
  }

  return data as SimpleScaleDeviceValue[];
};

export type ScaleDeviceValue = {
  id: number;
  value: number;
  created_at: Date;
  device_id: string;
};

export type SimpleScaleDeviceValue = Omit<ScaleDeviceValue, 'id' | 'device_id'>;
