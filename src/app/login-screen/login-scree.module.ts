import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginScreenComponent } from './login-screen.component';
import { LoginScreenRoutingModule } from './login-screen-routing-module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginScreenRoutingModule
  ],
  declarations: [LoginScreenComponent]
})
export class LoginScreenModule {}
