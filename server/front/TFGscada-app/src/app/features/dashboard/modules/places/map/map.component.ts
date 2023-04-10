import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { Feature, Overlay } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { IPlace } from '../places-interfaces';
import { PlacesService } from '../places.service';
import Control from 'ol/control/Control';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map!: Map;
  placesDate: IPlace[] = [];
  toolTip: any;

  constructor(public placesService: PlacesService,) { }

  @ViewChild('map2') mapElement!: ElementRef;

  @Output() placeSelected = new EventEmitter<IPlace>();

  ngOnInit(): void {
    this.fetchPlaces();
  }

  getCenter(LastZoom: number = 1, viewport: number[] = []): { latitude: number, longitude: number, zoom: number } {
    if (this.placesDate.length == 0)
      return { latitude: 0, longitude: 0, zoom: 14 };
    let aux = fromLonLat([this.placesDate[0].longitude, this.placesDate[0].latitude])
    let maxX = aux[0];
    let maxY = aux[1];
    let minX = aux[0];
    let minY = aux[1];
    this.placesDate.forEach((place) => {
      aux = fromLonLat([place.longitude, place.latitude]);
      if (maxX < aux[0])
        maxX = aux[0];
      if (maxY < aux[1])
        maxY = aux[1];
      if (minX > aux[0])
        minX = aux[0];
      if (minY > aux[1])
        minY = aux[1];
    });
    let zoom = maxX - minX;
    if (zoom < (maxY - minY))
      zoom = maxY - minY;
    zoom = 17;
    if (viewport.length) {
      zoom = LastZoom;
      if (viewport[0] > minX)
        zoom = LastZoom - 0.1;
      else if (viewport[2] < maxX)
        zoom = LastZoom - 0.1;
      else if (viewport[1] > minY)
        zoom = LastZoom - 0.1;
      else if (viewport[3] < maxY)
        zoom = LastZoom - 0.1;
    }
    return {
      latitude: ((maxX - minX) / 2) + minX,
      longitude: ((maxY - minY) / 2) + minY, zoom: zoom
    };
  }

  async initMap(center: { latitude: number, longitude: number, zoom: number }) {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/icon.png',
      }),
    });

    let features: any[] = [];
    for (const element of this.placesDate) {
      let feature = new Feature({
        geometry: new Point(fromLonLat([element.longitude, element.latitude])),
        place: element,
      });
      feature.setStyle(iconStyle);
      features.push(feature);
    }

    const vectorSource = new VectorSource({
      features: features
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
        center: [center.latitude, center.longitude],
        zoom: center.zoom, maxZoom: 18,
      }),
    });
    let center2 = this.getCenter(this.map.getView().getZoom(), this.map.getView().calculateExtent(this.map.getSize()));
    while (center2.zoom != this.map.getView().getZoom() && center2.zoom > 3) {
      this.map.getView().setZoom(center2.zoom);
      center2 = this.getCenter(this.map.getView().getZoom(), this.map.getView().calculateExtent(this.map.getSize()));
    }
    this.map.getView().setZoom((this.map.getView().getZoom() as number) - 0.2);

    // display popup on click
    this.map.on('click', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        this.placeSelected.emit((feature as any).values_.place);
        // hay que hacer un evento con un output
        return feature;
      });
      if (!feature) {
        return;
      }
    });
    this.toolTip = document.createElement('div');
    this.overlay = new Overlay({
      element: this.toolTip,
      offset: [-15, 35],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.overlay);
    // change mouse cursor when over marker
    this.map.on('pointermove', (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      if (this.mapElement) {
        this.mapElement.nativeElement.style.cursor = hit ? 'pointer' : '';
      }
      if (hit) {
        let feature = this.map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });
        if (feature) {
          let coordinates = [...(feature as any).values_.geometry.flatCoordinates];
          coordinates[0] = coordinates[0] + 100;
          this.overlay.setPosition(/*e.coordinate*/coordinates);
          this.toolTip.innerHTML = '<span>' + (feature as any).values_.place.identifier + '</span>'
          this.toolTip.style.padding = '0.3em';
          this.toolTip.style.backgroundColor = 'white';
          this.toolTip.style.borderRadius = '5px';
          if (this.toolTip.style.visibility == 'hidden')
            this.toolTip.style.visibility = 'visible';
        }
      }
      else
        this.toolTip.style.visibility = 'hidden';

    });
  }

  overlay: any;


  async fetchPlaces() {
    this.placesService.get().subscribe({
      next: (response: any) => {
        this.placesDate = response.data;
        for (let i = 0; i < response.data.length; i++) {
          this.placesDate[i].personsNames = [];
          for (let i2 = 0; i2 < response.data[i].persons.length; i2++) {
            this.placesDate[i].personsNames.push(response.data[i].persons[i2].name);
          }
        }
        this.initMap(this.getCenter());
      },
      error: (err: any) => {
        console.log('Ha ocurrido un error: ', err);
      }
    });
  }

}

