import dayjs from 'dayjs';
import {supabase} from './supabase';

const RELATION = 'scale_device_values';

export const getScaleDeviceValues = async (
  device_id: string,
  options?: {date?: Date},
) => {
  let query = supabase
    .from(RELATION)
    .select('value, created_at')
    .eq('device_id', device_id);

  if (options) {
    const {date} = options;
    if (date) {
      const startOfDate = dayjs(date).startOf('day').toISOString();
      const endOfDate = dayjs(date).add(1, 'day').startOf('day').toISOString();
      query = query.gte('created_at', startOfDate).lte('created_at', endOfDate);
    }
  }

  const {data, error} = await query;
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
