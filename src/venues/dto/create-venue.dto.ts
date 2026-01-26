import { IsNumber, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name!: string;
}

export class CreateVenueManagerDto {
  @IsNumber()
  venueId!: number;

  @IsNumber()
  accountId!: number;
}
