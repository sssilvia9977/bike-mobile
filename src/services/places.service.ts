import { Injectable, OnInit } from '@angular/core';
import { DeviceId } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AccelerationData, GeolocationData, GyroscopeData, } from 'src/constants/consts';


@Injectable() // cand folosesc un serviciu (Storage) in alt serviciu (PlacesService)

// am nevoie intr adevar de storage? daca user inchide app si doar cand ajunge acasa vrea sa trimita datele, 
// cum fac sa nu le pierd la inchidere ap?
export class PlacesService implements OnInit{
    geolocations: GeolocationData[] = [];
    accelerations: AccelerationData[] = [];
    gyroscopes: GyroscopeData[] = [];
    errors: string[] = [];
    deviceId: string;

    constructor() { }

    async ngOnInit(): Promise<void> {
       // await this.storageService.create();
      //  await this.storageService.set('name', 'Mr. Ionitron'); adauga ID
    }

    addDeviceId(id: DeviceId){
        this.deviceId = id.uuid;
        Storage.set({key:'deviceId', value: id.uuid}); // TODO: verifica formatul id ului
    }

    addTrackedDataItem(geolocation: GeolocationData[], acceleration: AccelerationData[], gyroscope: GyroscopeData[]) {
       // this.places.push(place);
        Storage.set({key:"geolocations", value: JSON.stringify(geolocation)});
        Storage.set({key:"accelerations", value: JSON.stringify(acceleration)});
        Storage.set({key:"gyroscopes", value: JSON.stringify(gyroscope)});
    }

    addErrorTracking(sensor: string, error: string) {
        let errorString = sensor + " " + error;
        Storage.set({key:'errors', value: errorString});
    }

    getPlaces() {
        return Storage.get({key: 'geolocations'}) // asincron promise care emite cate o valoare pe rand
                                                  //daca emitea un array foloseam observable, asta emite mai multe valori simultan
            .then(
                (geolocation) => {
                    this.geolocations = geolocation === null ? [] : JSON.parse(geolocation.value);
                    console.log(this.geolocations);
                    return this.geolocations;
                }
            );
    }

    getAccelerations() {
        return Storage.get({key: 'accelerations'}) 
            .then(
                (accelerations) => {
                    this.accelerations = accelerations === null ? [] : JSON.parse(accelerations.value);
                    console.log(this.accelerations);
                    return this.accelerations;
                }
            );
    }

    getGyroscope() {
        return Storage.get({key: 'gyroscopes'})
        .then(
            (gyroscope) => {
                this.gyroscopes = gyroscope === null ? [] : JSON.parse(gyroscope.value);
                return this.gyroscopes;
            }
        )
    }

    getErrors() {
        return Storage.get({key: 'errors'})
        .then(
            (errors) => {
                this.errors = errors === null ? [] : JSON.parse(errors.value);
                return this.errors;
            }
        )
    }


}