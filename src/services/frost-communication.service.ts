import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { DataTemplate, Locations, MultiDatastreams } from 'src/constants/dataTemplate';

@Injectable()
export class FrostCommunication {
    private baseUrl: string = "http://193.226.7.70/FROST-Server/"; 
    //private baseUrl: string = "http://localhost:8080/FROST-Server/";
    private sendInitialThingURL: string = this.baseUrl + "v1.1/Things";  // sa nu fie 1.0??

    private baseUrlThingRelated: string = this.baseUrl + "v1.1/Things(";
    private locationUrl: string = ")/Locations";
    private multiDatastreamsUrl: string = ")/MultiDatastreams";

    thingId: number;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // Authorization: 'my-auth-token'
        })
    };

    constructor(
        private httpClient: HttpClient
    ) { }

    public getThingId(): number {
        return this.thingId;
    }

    public async sendInitialThing(initialThing: DataTemplate) {
        let initialThingJson = JSON.stringify(initialThing);
        let myResponse =  await this.httpClient.post<DataTemplate>(this.sendInitialThingURL, initialThingJson, { observe: 'response' })
        .toPromise().then(resp => {
            const locationString = resp.headers.get('location');
            var locationSplit = locationString.split('(')[1];
            this.thingId = parseInt(locationSplit.split(')')[0]);
        });
        return this.thingId;
    }

    public sendLocation(locations: Locations, thingId) {
        let locationJson = JSON.stringify(locations);
        let requestUrl = this.baseUrlThingRelated + thingId + this.locationUrl;
        return this.httpClient.post<Locations>(requestUrl, locationJson, this.httpOptions);
    }

    public sendMultidatastream(data: MultiDatastreams, thingId){
        let dataJson = JSON.stringify(data);
        let requestUrl = this.baseUrlThingRelated + thingId + this.multiDatastreamsUrl;
        console.log(data)
        return this.httpClient.post<MultiDatastreams>(requestUrl, dataJson, this.httpOptions);
    }

  


}