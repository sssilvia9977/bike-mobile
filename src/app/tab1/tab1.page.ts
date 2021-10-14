import { Component, OnInit } from '@angular/core';
import { Device, DeviceId } from '@capacitor/device';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { TrackedData } from 'src/constants/consts';
import { PlacesService } from './../../services/places.service'
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
//import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  subscription = new Subscription();

  battery: number;
  deviceId: DeviceId;

  trackedData: TrackedData;
  allTrakedData: TrackedData[] = [];
  options: GyroscopeOptions = {
    frequency: 1000
  }

  constructor(
    private geolocation: Geolocation,
    private placeService: PlacesService,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion,
    // private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.trackedData = new TrackedData();
    // Device.getBatteryInfo().then(e =>this.battery = e.batteryLevel);
    // Device.getId().then(e => this.deviceId = e );
    // this.placeService.addDeviceId(this.deviceId);
  }

  onLocateUser() {  // this is just for testing, dupa ce stiu ce merge localizarea deviceului 
    // in timp real, trebuie sa o sterg
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("location is: " + resp.coords.latitude + " " + resp.coords.longitude);
      this.trackedData.coordinatesLat = resp.coords.latitude;
      this.trackedData.coordinatesLong = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  onStarGetConstantLocation() {
    // this.spinner.show();
    this.getCoordsAltitudeVelocity();
    this.getAcceleration();
    this.getGyroscope();
  }

  getGyroscope(){
     //de adaugat la tracked data? cum fac datele
    this.subscription.add(this.gyroscope.watch().subscribe(
      (orientation: GyroscopeOrientation) => console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp),
      (error: any) => console.log(error)
    ))
  }

  getAcceleration() {
    this.subscription.add(this.deviceMotion.watchAcceleration().subscribe(
      (acceleration: DeviceMotionAccelerationData) => console.log(acceleration + " " + acceleration.timestamp),
      //de adaugat la tracked data? cum fac datele
      (error: any) => console.log(error)
    ));
  }

  getCoordsAltitudeVelocity() {
    this.subscription.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(position => {
      if ((position as Geoposition).coords != undefined) {
        var geoposition = (position as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        this.trackedData.timeStamp = geoposition.timestamp;
        this.trackedData.coordinatesLat = geoposition.coords.latitude;
        this.trackedData.coordinatesLong = geoposition.coords.longitude;
        this.trackedData.altitude = geoposition.coords.altitudeAccuracy;
        this.trackedData.velocity = geoposition.coords.speed;
        this.allTrakedData.push(this.trackedData);
      } else {
        var positionError = (position as PositionError);
        console.log('Error ' + positionError.code + ': ' + positionError.message);
        this.placeService.addErrorTracking(positionError.message);
      }
    }))
  }

  onStopGetConstantLocation() {
    // this.spinner.hide();
    this.subscription.unsubscribe();
    this.placeService.addTrackedDataItem(this.allTrakedData);
    this.placeService.getPlaces();
  }

}
