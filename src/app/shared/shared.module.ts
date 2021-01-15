import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { sharedComponents } from '.';
import { materialModules } from './material.module';
import { sharedPipes } from './pipes';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [CommonModule, FormsModule, ...materialModules, NgxPaginationModule],
  exports: [...sharedComponents, ...sharedPipes],
  declarations: [...sharedComponents, ...sharedPipes],
})
export class SharedModule {}
