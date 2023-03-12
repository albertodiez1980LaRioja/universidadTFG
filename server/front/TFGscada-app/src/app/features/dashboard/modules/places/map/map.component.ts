import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map!: Map
  constructor() { }

  @ViewChild('map2') mapElement!: ElementRef;

  ngOnInit(): void {
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([-2.4173725601108815, 42.43105735715603])),
      name: 'Null Island',
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/icon.png',
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });


    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }), vectorLayer
      ],
      target: 'map',//this.mapElement.nativeElement,//'map',
      view: new View({
        center: fromLonLat([-2.4173725601108815, 42.43105735715603]),
        zoom: 14, maxZoom: 18,
      }),
    });
    // display popup on click
    this.map.on('click', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        console.log('Pulsado en el feature: ', feature);
        return feature;
      });
      if (!feature) {
        return;
      }
    });

    // change mouse cursor when over marker
    this.map.on('pointermove', (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      if (this.mapElement)
        this.mapElement.nativeElement.style.cursor = hit ? 'pointer' : '';
    });
  }
}
