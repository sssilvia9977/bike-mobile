import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginScreenPage } from './login-screen.page';
import { LoginScreenRoutingModule } from './login-screen-routing-module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginScreenRoutingModule
  ],
  declarations: [LoginScreenPage]
})
export class LoginScreenModule {}
