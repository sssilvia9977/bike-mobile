import { Injectable, OnInit } from '@angular/core';
import { Device, DeviceId } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AccelerationData, GeolocationData, GyroscopeData, } from 'src/constants/consts';
import { DataTemplate, Locations, MultiDatastreams, Observation, Result, UnitOfMeasurement } from 'src/constants/dataTemplate';
import { FrostCommunication } from './frost-communication.service';


@Injectable() // cand folosesc un serviciu (Storage) in alt serviciu (PlacesService)
export class PlacesService {
    geolocations: GeolocationData[] = [];
    accelerations: AccelerationData[] = [];
    gyroscopes: GyroscopeData[] = [];

    dataTemplate: DataTemplate;
    locations: Locations = new Locations();
    multiDatastreams: MultiDatastreams = new MultiDatastreams();
    observationsBuild: Observation[] = [];

    errors: string[] = [];

    deviceId: string;
    thingId: number;

    canSendData: boolean = true;

    constructor(
        private frostCommunication: FrostCommunication,
    ) {
        this.dataTemplate = new DataTemplate();
        const today = new Date();
        this.dataTemplate.description = "Bike journey data collected on " +
            today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

        Device.getId().then(e => {
            this.dataTemplate.name = "Data from device id: " + e.uuid;
        });
    }

    setInitialLocationCoords(lat: number, long: number) {
        this.locations.location.coordinates = [lat, long];
    }


    formatData(
        allGeolocationData: GeolocationData[], allAccelerationData: AccelerationData[], allGyroscopeData: GyroscopeData[]
    ) {
        this.canSendDataCheck(allGeolocationData, allAccelerationData, allGyroscopeData);
        if (this.canSendData) {
            for (let i = 0; i < allAccelerationData.length; i++) {
                let resultBuild: Result = new Result();
                resultBuild.accX = allAccelerationData[i].accelerationX;
                resultBuild.accY = allAccelerationData[i].accelerationY;
                resultBuild.accZ = allAccelerationData[i].accelerationZ;
                resultBuild.orientationX = allGyroscopeData[i].orientationX;
                resultBuild.orientationY = allGyroscopeData[i].orientationY;
                resultBuild.orientationZ = allGyroscopeData[i].orientationZ;
                resultBuild.lat = allGeolocationData[i].coordinatesLat;
                resultBuild.long = allGeolocationData[i].coordinatesLong;
                this.addResultToObservationBuild(new Date(allAccelerationData[i].timeStamp), resultBuild);
            }
            this.multiDatastreams.Observations = this.observationsBuild;        
            this.sendDataToServer();
        }
       
    }

    sendDataToServer() {
        // ce e mai jos am rulat si am primit id thing 3. Restul trimit tot acolo
        // trimite prima oara thingul si tine minte id ul lui
        // this.frostCommunication.sendInitialThing(this.dataTemplate).then(thingId =>
        //     // trimite locatia gen Locations
        //     this.frostCommunication.sendLocation(this.locations, thingId).subscribe()
        // );

        // multidata stream 86 pt local 3 remote
        this.frostCommunication.sendMultidatastream(this.multiDatastreams, 3).subscribe(
            (res) => {},
            error => alert( error.message + " " +  error.error.message)
        );

    }


    addResultToObservationBuild(timeStamp: Date, resultBuild: Result) {
        let obs: Observation = new Observation();
        obs.phenomenonTime = timeStamp;
        obs.result = [resultBuild.lat, resultBuild.long,
            resultBuild.orientationX, resultBuild.orientationY, resultBuild.orientationZ,
            resultBuild.accX, resultBuild.accY, resultBuild.accZ]
        this.observationsBuild.push(obs);
    }


    canSendDataCheck(allGeolocationData: GeolocationData[], allAccelerationData: AccelerationData[], allGyroscopeData: GyroscopeData[]) {
        if (!allGeolocationData || allGeolocationData.length == 0) {
            alert("No coordinates collected. Cannot send data.")
            this.canSendData = false;
        }
        if (!allAccelerationData || allAccelerationData.length == 0) {
            alert("No acceleration collected. Cannot send data.")
            this.canSendData = false;
        }
        if (!allGyroscopeData || allGyroscopeData.length == 0) {
            alert("No gyroscope data collected. Cannot send data.")
            this.canSendData = false;
        }
    }

    addErrorTracking(sensor: string, error: string) {
        let errorString = sensor + " " + error;
        Storage.set({ key: 'errors', value: errorString });
    }

    getPlaces() {
        return Storage.get({ key: 'geolocations' }) // asincron promise care emite cate o valoare pe rand
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
        return Storage.get({ key: 'accelerations' })
            .then(
                (accelerations) => {
                    this.accelerations = accelerations === null ? [] : JSON.parse(accelerations.value);
                    console.log(this.accelerations);
                    return this.accelerations;
                }
            );
    }

    getGyroscope() {
        return Storage.get({ key: 'gyroscopes' })
            .then(
                (gyroscope) => {
                    this.gyroscopes = gyroscope === null ? [] : JSON.parse(gyroscope.value);
                    return this.gyroscopes;
                }
            )
    }

    getErrors() {
        return Storage.get({ key: 'errors' })
            .then(
                (errors) => {
                    this.errors = errors === null ? [] : JSON.parse(errors.value);
                    return this.errors;
                }
            )
    }


}