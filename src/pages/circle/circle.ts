import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  ILatLng,
  Circle,
  Marker,
  Spherical
} from '@ionic-native/google-maps';

/**
 * Generated class for the CirclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle',
  templateUrl: 'circle.html',
  providers: [
    Spherical
  ]
})
export class CirclePage {

  map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private spherical: Spherical,
    private googleMaps: GoogleMaps) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CirclePage');
    this.loadMap();
  }

  loadMap() {
    let center: ILatLng = {"lat": 32, "lng": -97};

    let radius = 300;  // radius (meter)

    // Calculate the positions
    let positions: ILatLng[] = [0, 90, 180, 270].map((degree: number) => {
      return this.spherical.computeOffset(center, radius, degree);
    });

    this.map = this.googleMaps.create('map_canvas', {
      camera: {
        target: positions,
        padding: 100
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      return this.map.addMarker({
        position: positions[0],
        draggable: true,
        title: 'Drag me!'
      });
    }).then((marker: Marker) => {
      this.map.addCircle({
        'center': center,
        'radius': radius,
        'strokeColor' : '#AA00FF',
        'strokeWidth': 5,
        'fillColor' : '#00880055'
      }).then((circle: Circle) => {
        marker.on('position_changed').subscribe((params: any) => {
          let newValue: ILatLng = <ILatLng>params[1];
          let newRadius: number = this.spherical.computeDistanceBetween(center, newValue);
          circle.setRadius(newRadius);
        });
      });
    });
  }

}
