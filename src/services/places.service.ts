import { Injectable, OnInit } from '@angular/core';
import { DeviceId } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { TrackedData, TrackedDataFields } from 'src/constants/consts';

@Injectable() // cand folosesc un serviciu (Storage) in alt serviciu (PlacesService)
export class PlacesService implements OnInit{
    places: TrackedData[] = [];
    deviceId: string;

    constructor(
       //private storageService: Storage,
    ) { }

    async ngOnInit(): Promise<void> {
       // await this.storageService.create();
      //  await this.storageService.set('name', 'Mr. Ionitron'); de pus la addDeviceId sau deloc?
    }

    addDeviceId(id: DeviceId){
        this.deviceId = id.uuid;
        Storage.set({key:'deviceId', value: id.uuid});
    }

    addTrackedDataItem(places: TrackedData[]) {
       // this.places.push(place);
        Storage.set({key:"places", value: JSON.stringify(places)});
    }

    addErrorTracking(error: string) {
        Storage.set({key:'errors', value: error});
    }

    getPlaces() {
        return Storage.get({key: 'places'}) // asincron promise care emite cate o valoare pe rand
        //daca emitea un array foloseam observable, asta emite mai multe valori simultan
            .then(
                (places) => {
                    this.places = places === null ? [] : JSON.parse(places.value);
                    console.log(this.places);
                    return this.places;
                }
            );
    }


}