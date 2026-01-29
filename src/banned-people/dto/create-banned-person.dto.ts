import { IsNumber, IsString } from 'class-validator';
import { IsDayjsDate } from 'src/validators/is-dayjs-date.validator';

export class CreateBannedPersonDto {
  @IsString()
  name!: string;

  @IsString()
  reason!: string;

  @IsDayjsDate("DD-MM-YYYY", {message: 'format: dd-mm-yyyy required'})
  startDate!: string;

  @IsDayjsDate("DD-MM-YYYY", {message: 'format: dd-mm-yyyy required'})
  endDate!: string;
}
