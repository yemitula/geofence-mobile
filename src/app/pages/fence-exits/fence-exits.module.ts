import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { FenceExits } from './fence-exits';
import { FenceExitsDetail } from './fence-exits-detail';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FenceExits
      },{
        path: 'detail/:id',
        component: FenceExitsDetail
      }
    ])
  ],
  declarations: [FenceExits,FenceExitsDetail]
})
export class FenceExitsPageModule {}
