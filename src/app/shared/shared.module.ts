import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { sharedComponents } from '.';
import { materialModules } from './material.module';

@NgModule({
  imports: [CommonModule, FormsModule, ...materialModules],
  exports: [...sharedComponents],
  declarations: [...sharedComponents],
})
export class SharedModule {}
