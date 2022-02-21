import { OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';


export class NetworkService  {

    checkConnection() {
        Network.addListener('networkStatusChange', status => {
            if(status.connected){
                alert("ok")
            }
            else{
                alert("please activate your internet connection")
            }
        });
    }

  async getStatus(){
    const status = await Network.getStatus();
    return status;
  }


}