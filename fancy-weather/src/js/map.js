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

    this.mapMarker = new mapboxgl.Marker({ color: '#0000008f' })
      .setLngLat([longitude, latitude])
      .addTo(this.map);

    return this.map;
  }

  moveMapCenter(latitude, longitude) {
    this.map.jumpTo({ center: [longitude, latitude] });
    this.mapMarker.setLngLat([longitude, latitude]);
  }
}


// function mapInit(latitude, longitude) {
//   map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v9',
//     center: [longitude, latitude],
//     zoom: 6,
//   });

//   mapMarker = new mapboxgl.Marker({ color: '#0000008f' })
//     .setLngLat([longitude, latitude])
//     .addTo(map);

//   return map;
// }

// function moveMapCenter(latitude, longitude) {
//   map.jumpTo({ center: [longitude, latitude] });
//   mapMarker.setLngLat([longitude, latitude]);
// }