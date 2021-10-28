import { Component, OnInit } from '@angular/core';
import { Device, DeviceId } from '@capacitor/device';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { AccelerationData, CollectingData, GeolocationData, GyroscopeData, SENSORS } from 'src/constants/consts';
import { PlacesService } from './../../services/places.service'
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

// la pornire app, mi se activeaza gps ul
// cand apas pe start prima oara: error la background location (l am comentat) , locationAccPermission

export class Tab1Page implements OnInit {
  subscription = new Subscription();

  battery: number;
  deviceId: DeviceId;
  startJourney: boolean = false;

  geolocationData: GeolocationData;
  allGeolocationData: GeolocationData[] = [];

  accelerationData: AccelerationData;
  allAccelerationData: AccelerationData[] = [];

  gyroscopeData: GyroscopeData;
  allGyroscopeData: GyroscopeData[] = [];

  SENSORS = SENSORS;
  options: GyroscopeOptions = {
    frequency: 1000
  }

  geolocationFinalData: any;

  constructor(
    private geolocation: Geolocation,
    private placeService: PlacesService,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private backgroundMode: BackgroundMode
  ) {
    platform.ready().then(() => {
      this.checkPermission();
    })
    //this.backgroundMode.enable();
  }

  ngOnInit(): void {
    this.geolocationData = new GeolocationData();
    this.accelerationData = new AccelerationData();
    this.gyroscopeData = new GyroscopeData();
    // Device.getBatteryInfo().then(e =>this.battery = e.batteryLevel);
    // Device.getId().then(e => this.deviceId = e );
    // this.placeService.addDeviceId(this.deviceId);
  }

  onStarGetConstantLocation() {
    this.checkPermission();
    this.startJourney = true;
    this.getCoordsAltitudeVelocity();
    this.getAcceleration();
    this.getGyroscope();
  }

  //TODO: run in backgroud daca user intra in alta ap/ primeste telefon, blocheaza telefon

  onStopGetConstantLocation() {
    // TODO: verifica limita unui fisier stocat pe telefonul userului
    this.startJourney = false;
    this.subscription.unsubscribe();
    this.placeService.addTrackedDataItem(this.allGeolocationData, this.allAccelerationData, this.allGyroscopeData);
    this.placeService.getPlaces().then(
      (result) => {
        debugger
        this.geolocationFinalData = result
      }
    )
  }

  onSendDataToServer() {
    // cum le afisez in forma asta, sa vad de test ca se colecteaza bine?
    this.placeService.getAccelerations();
    this.placeService.getGyroscope();
    this.placeService.getPlaces();
  }

  getGyroscope() {
    // colecteaza doar date diferite
    this.subscription.add(this.gyroscope.watch().subscribe(
      (orientation: GyroscopeOrientation) => {
        console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
        this.gyroscopeData.timeStamp = orientation.timestamp;
        this.gyroscopeData.orientationX = orientation.x;
        this.gyroscopeData.orientationY = orientation.y;
        this.gyroscopeData.orientationZ = orientation.z;
        this.gyroscopeDifferentFromPrevious(this.gyroscopeData, this.allGyroscopeData);
      },
      (error: any) => {
        console.log(error);
        this.placeService.addErrorTracking(this.SENSORS.GYROSCOPE, error);
      }
    ))
  }

  getAcceleration() {
    // colecteaza doar date diferite
    this.subscription.add(this.deviceMotion.watchAcceleration().subscribe(
      (acceleration: DeviceMotionAccelerationData) => {
        console.log(acceleration + " " + acceleration.timestamp);
        this.accelerationData.timeStamp = acceleration.timestamp;
        this.accelerationData.accelerationX = acceleration.x;
        this.accelerationData.accelerationY = acceleration.y;
        this.accelerationData.accelerationZ = acceleration.z;
        this.accelerationDifferentFromPrevious(this.accelerationData, this.allAccelerationData);
      },
      (error: any) => {
        console.log(error);
        this.placeService.addErrorTracking(this.SENSORS.ACCELERATION, error);
      }
    ));
  }

  getCoordsAltitudeVelocity() {
    // colecteaza doar date diferite
    this.subscription.add(this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(position => {
      if ((position as Geoposition).coords != undefined) {
        var geoposition = (position as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        this.geolocationData.timeStamp = geoposition.timestamp;
        this.geolocationData.coordinatesLat = geoposition.coords.latitude;
        this.geolocationData.coordinatesLong = geoposition.coords.longitude;
        this.geolocationData.altitude = geoposition.coords.altitudeAccuracy;
        this.geolocationData.velocity = geoposition.coords.speed;
        this.geolocationDifferentFromPrevious(this.geolocationData, this.allGeolocationData);
      } else {
        var positionError = (position as PositionError);
        console.log('Error ' + positionError.code + ': ' + positionError.message);
        this.placeService.addErrorTracking(this.SENSORS.GEOPOSITION, positionError.message);
      }
    }))
  }

  geolocationDifferentFromPrevious(geoloc: GeolocationData, allGeoLocs: GeolocationData[]): void {
    if (allGeoLocs.length === 0) {
      this.allGeolocationData.push(geoloc);
    }
    if (allGeoLocs.length >= 1 && allGeoLocs[allGeoLocs.length - 1].coordinatesLat !== geoloc.coordinatesLat &&
      allGeoLocs[allGeoLocs.length - 1].coordinatesLong !== geoloc.coordinatesLong) {
      this.allGeolocationData.push(geoloc);
    }
  }

  accelerationDifferentFromPrevious(acc: AccelerationData, allAcc: AccelerationData[]): void {
    if (allAcc.length === 0) {
      this.allAccelerationData.push(acc);
    }
    if (allAcc.length >= 1 && allAcc[allAcc.length - 1].accelerationX !== acc.accelerationX &&
      allAcc[allAcc.length - 1].accelerationY !== acc.accelerationY &&
      allAcc[allAcc.length - 1].accelerationZ !== acc.accelerationZ) {
      this.allAccelerationData.push(acc);
    }
  }

  gyroscopeDifferentFromPrevious(gyroscope: GyroscopeData, allGyroscope: GyroscopeData[]): void {
    if (allGyroscope.length === 0) {
      this.allGyroscopeData.push(gyroscope);
    }
    if (allGyroscope.length >= 1 && allGyroscope[allGyroscope.length - 1].orientationX !== gyroscope.orientationX &&
      allGyroscope[allGyroscope.length - 1].orientationY !== gyroscope.orientationY &&
      allGyroscope[allGyroscope.length - 1].orientationZ !== gyroscope.orientationZ) {
      this.allGyroscopeData.push(gyroscope);
    }
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        alert(error);
      }
    );
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(() => { this.enableGPS(); },
            error => { alert(error + " locationAccPermission ") });
      }
    });
    // this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION)
    //   .then(() => { console.log("background location ok") },
    //     error => { alert(error + " background location") });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        alert('GPS in enabled')
      },
      error => alert(error + " locationAccuracy ")
    );
  }

}

