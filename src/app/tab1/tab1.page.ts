import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { AccelerationData, GeolocationData, GyroscopeData, SENSORS } from 'src/constants/consts';
import { PlacesService } from './../../services/places.service'
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { FrostCommunication } from 'src/services/frost-communication.service';
import { NetworkService } from 'src/services/network.service';
import { timer, of, interval } from 'rxjs';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { registerPlugin } from "@capacitor/core";
import { DataVisualizationService } from 'src/services/data-visualization.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements OnInit {
  subscription = new Subscription();
  BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
  battery: number;
  deviceId: string;
  startJourney: boolean = false;

  allGeolocationData: GeolocationData[] = new Array();
  allAccelerationData: AccelerationData[] = [];
  allGyroscopeData: GyroscopeData[] = [];

  SENSORS = SENSORS;
  options: GyroscopeOptions = {
    frequency: 1000
  }

  showDataForTest: boolean = true;

  latStart: number;
  longStart: number;

  constructor(
    private geolocation: Geolocation,
    private placeService: PlacesService,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private frostCommunication: FrostCommunication,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    private networkService: NetworkService,
    private dataVisualizationService: DataVisualizationService,
  ) { }

  ngOnInit(): void { }

  onStarGetConstantLocation() {
    this.checkPermission();
  }

  startCollectingData() {
    this.allGyroscopeData = [];
    this.allAccelerationData = [];
    this.allGeolocationData = [];
    this.subscription = new Subscription();

    this.startJourney = true;
    this.getCoordsAltitudeVelocity();
    this.getAcceleration();
    this.getGyroscope();

    this.geolocation.getCurrentPosition().then(
      (position) => {
        this.latStart = position.coords.latitude;
        this.longStart = position.coords.longitude;
        // !!!!! NU MERGE DELOC CITIRE COORDS CU LIVE RELOAD
        this.placeService.setInitialLocationCoords(this.latStart, this.longStart);
      }
    )
      .catch(err => {
        alert(err.message)
      })
  }

  onStopGetConstantLocation() {
    this.startJourney = false;
    this.showDataForTest = true;

    this.networkService.getStatus().then(resp => {
      if (!resp.connected) { alert("Please connect to the internet"); }
      else {
        this.placeService.formatData(this.allGeolocationData, this.allAccelerationData, this.allGyroscopeData);;
      }
    });

    this.subscription.unsubscribe();
  }

  onSendDataToServer() {
    this.networkService.getStatus().then(resp => {
      if (!resp.connected) { alert("Please connect to the internet"); }
      else {
        this.placeService.sendDataToServer();
      }
    });
  }

  test(){
    this.dataVisualizationService.checkIfNewDevice("5e0a40edd12582ac").then(res => {
      console.log(res)
    });

    // this.dataVisualizationService.sendThingForProject(3, "5e0a40edd12582ac").subscribe(res => {
    //   console.log(res)
    // })
  }

  getGyroscope() {
    this.subscription.add(this.gyroscope.watch({ frequency: 10000 }).subscribe(
      (orientation: GyroscopeOrientation) => {
        let gyroscopeData = new GyroscopeData();
        gyroscopeData.timeStamp = orientation.timestamp;
        gyroscopeData.orientationX = orientation.x;
        gyroscopeData.orientationY = orientation.y;
        gyroscopeData.orientationZ = orientation.z;
        this.allGyroscopeData.push(gyroscopeData)
      },
      (error: any) => {
        console.log(error);
        this.placeService.addErrorTracking(this.SENSORS.GYROSCOPE, error);
      }
    ))
  }

  getAcceleration() {
    this.subscription.add(this.deviceMotion.watchAcceleration({ frequency: 10000 }).subscribe(
      (acceleration: DeviceMotionAccelerationData) => {
        let accelerationData = new AccelerationData();
        accelerationData.timeStamp = acceleration.timestamp;
        accelerationData.accelerationX = acceleration.x;
        accelerationData.accelerationY = acceleration.y;
        accelerationData.accelerationZ = acceleration.z;
        this.allAccelerationData.push(accelerationData);
      },
      (error: any) => {
        console.log(error);
        this.placeService.addErrorTracking(this.SENSORS.ACCELERATION, error);
      }
    ));
  }


  getCoordsAltitudeVelocity() {
    this.subscription.add(interval(10000).subscribe(res =>
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
        let geolocationData = new GeolocationData();
        var geoposition = (position as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        geolocationData.timeStamp = geoposition.timestamp;
        geolocationData.coordinatesLat = geoposition.coords.latitude;
        geolocationData.coordinatesLong = geoposition.coords.longitude;
        geolocationData.altitude = geoposition.coords.altitudeAccuracy;
        geolocationData.velocity = geoposition.coords.speed;
        this.allGeolocationData.push(geolocationData);
      }).catch((error) => {
        console.log('Error getting location', error);
      })
    ))
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
        alert("eroare checkPerm " + error);
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
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        alert('GPS is enabled');
        this.startCollectingData();
      },
      error => alert(error + " locationAccuracy ")
    );
  }

}

