import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { Locations } from './locations';
import { LocationsEdit } from './locations-edit';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: Locations
      },
      {
        path: 'edit',
        component: LocationsEdit
      },
      {
        path: 'edit/:id',
        component: LocationsEdit
      }
    ])
  ],
  declarations: [Locations,LocationsEdit]
})
export class LocationsPageModule {}
