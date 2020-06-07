import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaXJpbmF0ZWxub3ZhIiwiYSI6ImNrYXBlcmFzbzA5OWMycW1zdXJoOTU5dmUifQ.YK2bVQSU4q7qlBHn0Y6KPQ';

export default class Map {
  constructor(latitude, longitude) {
    this.map = null;
    this.mapMarker = null;

    this.mapInit(latitude, longitude);
  }

  mapInit(latitude, longitude) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [longitude, latitude],
      zoom: 6,
    });

    this.mapMarker = new mapboxgl.Marker({
      color: '#0000008f',
      draggable: true,
    })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup({
        closeOnMove: true,
      })
        .setHTML('<h1 class=\'markerPopup\'>Drag the marker to start a search!</h1>'))
      .addTo(this.map);

    // this.dispatchMarkerClick();
    this.bind();
    return this.map;
  }

  bind() {
    this.mapMarker.on('dragend', () => {
      const langLat = this.mapMarker.getLngLat();
      this.onMapSearch([langLat.lat, langLat.lng]);
    });
  }

  onMapSearch() {
    throw new Error('method should be overriden', this);
  }

  moveMapCenter(latitude, longitude) {
    this.map.jumpTo({ center: [longitude, latitude] });
    this.mapMarker.setLngLat([longitude, latitude]);
  }
}