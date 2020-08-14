import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { Staff } from './staff';
import { StaffEdit } from './staff-edit';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: Staff
      },
      {
        path: 'edit',
        component: StaffEdit
      },
      {
        path: 'edit/:id',
        component: StaffEdit
      }
    ])
  ],
  declarations: [Staff, StaffEdit]
})
export class StaffPageModule {}
