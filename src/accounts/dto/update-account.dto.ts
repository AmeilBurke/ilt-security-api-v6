import { IsEmail, IsNumber, IsString } from "class-validator";

export class UpdateAccountDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    name!: string;

    @IsNumber()
    roleId!: number;
}