import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateInitialVenueManagerAccountDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    name!: string;
}

export class CreateAccountDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    name!: string;

    @IsNumber()
    roleId!: number;
}
