import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectThingDto } from 'src/constants/data-vis';



@Injectable()
export class DataVisualizationService {
   // private baseUrl: string = "http://192.168.100.8:8080/DATA-VISUALIZATION-SERVER";  
    private baseUrl: string = "http://193.226.7.70:8099/DATA-VISUALIZATION-SERVER";

    private projectThingUrl: string = this.baseUrl + "/project-thing"

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // Authorization: 'my-auth-token'
        })
    };

    constructor(
        private httpClient: HttpClient
    ) { }

    public sendThingForProject(thingId: number, deviceId: string) {
        let requestUrl = this.projectThingUrl;
        let dto = new ProjectThingDto(thingId, deviceId);
        return this.httpClient.post<ProjectThingDto>(requestUrl, dto, this.httpOptions);
    }

    public async checkIfNewDevice(deivceId: String) {
        let thingId = 0;
        let requestUrl = this.projectThingUrl + "/check-deviceId";
        await this.httpClient.post<any>(requestUrl, deivceId, { observe: 'response' }).toPromise().then(resp => {
            thingId = resp.body
        })
        return thingId;
    }


}