import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, CreateInitialAdminAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Public } from 'src/authentication/public.guard';
import type { RequestWithAccount } from "src/types";

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Public()
  @Post('/initial')
  createInitialAdmin(@Body() createInitialAdminAccountDto: CreateInitialAdminAccountDto) {
    return this.accountsService.createInitialAdmin(createInitialAdminAccountDto);
  }

  @Post()
  create(@Req() request: RequestWithAccount, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(request, createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(Number(id));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
  //   return this.accountsService.update(+id, updateAccountDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountsService.remove(+id);
  // }
}
