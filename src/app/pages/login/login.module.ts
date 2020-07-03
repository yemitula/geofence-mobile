import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginPage } from './login.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPage
      }
    ]),
    CalendarModule
  ],
  declarations: [LoginPage,],
})
export class LoginPageModule { }
