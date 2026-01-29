import { registerDecorator, ValidationOptions } from 'class-validator';
import dayjs from '../utils/dayjs';

export function IsDayjsDate(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDayjsDate',
      target: object.constructor,
      propertyName,
      constraints: [format],
      options: validationOptions,
      validator: {
        validate(value: any, args) {
          if (typeof value !== 'string') return false;

          return dayjs(value, args!.constraints[0], true).isValid();
        },
      },
    });
  };
}
