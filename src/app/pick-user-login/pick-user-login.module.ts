import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickUserLoginPageRoutingModule } from './pick-user-login-routing.module';

import { PickUserLoginPage } from './pick-user-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickUserLoginPageRoutingModule
  ],
  declarations: [PickUserLoginPage]
})
export class PickUserLoginPageModule {}
