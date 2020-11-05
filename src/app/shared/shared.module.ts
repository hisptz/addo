import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { sharedComponents } from '.';
import { materialModules } from './material.module';
import { sharedPipes } from './pipes';

@NgModule({
  imports: [CommonModule, FormsModule, ...materialModules],
  exports: [...sharedComponents, ...sharedPipes],
  declarations: [...sharedComponents, ...sharedPipes],
})
export class SharedModule {}
