import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PlacesService } from 'src/services/places.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { LoginScreenRoutingModule } from './pick-project-login-screen/login-screen-routing-module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HttpClientModule } from '@angular/common/http';
import { FrostCommunication } from 'src/services/frost-communication.service';
import { NetworkService } from 'src/services/network.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    LoginScreenRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PlacesService,
    FrostCommunication,
    NetworkService,
    Geolocation,
    Gyroscope,
    DeviceMotion,
    AndroidPermissions,
    LocationAccuracy,
    BackgroundMode
  ],
  exports: [LoginScreenRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
