import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { Profile } from './profile';
import { ProfileEdit } from './profile-edit';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: Profile
      },
      {
        path: 'edit/:id',
        component: ProfileEdit
      }
    ])
  ],
  declarations: [Profile, ProfileEdit]
})
export class ProfilePageModule {}
