import { ValueTransformer } from 'typeorm';

export const decimalTransformer: ValueTransformer = {
  to(value: number | null): number | null {
    return value;
  },
  from(value: string | number | null): number | null {
    if (value === null) {
      return null;
    }

    return typeof value === 'number' ? value : Number(value);
  },
};