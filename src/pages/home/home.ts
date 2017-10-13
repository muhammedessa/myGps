import { Component,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation , Geoposition} from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {

  latt : number = 0;
  lat : number = 0;
  long: number = 0;
  accu: number = 0;
  watch:any;

  constructor(public navCtrl: NavController ,
    public zone:NgZone,
  public backgroundGeolocation:BackgroundGeolocation,
public geolocation:Geolocation) {

  }

  startGps(){

var config = {
  desiredAccuracy :0,
  stationaryRadius:20,
  distanceFilter: 9,
  debug:true,
  interval : 2000
}

this.backgroundGeolocation.configure(config).subscribe((location)=>{
  console.log('Background running'+location.latitude+','+location.longitude);
this.zone.run(()=>{
  this.lat  =location.latitude;
  this.long  = location.longitude;
  this.latt = location.altitude;
  this.accu = location.accuracy;
});


},(error)=>{
  console.log('error : '+error);
});

this.backgroundGeolocation.start();

let options = {
  frequency : 3000,
  enableHighAccuracy: true
};

this.watch = this.geolocation.watchPosition(options).filter((p:any)=> p.code === undefined).subscribe((position:Geoposition)=>{
  console.log(position);

  this.zone.run(()=>{
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
    this.latt = position.coords.altitude;
    this.accu = position.coords.accuracy;
  });
});
  }

  stopGps(){
this.backgroundGeolocation.finish();
this.watch.unsubscribe();
console.log('the GPS stopped ... ')
  }

}
