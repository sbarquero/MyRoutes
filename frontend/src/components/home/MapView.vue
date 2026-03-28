<template>
  <div class="map-container">
    <!-- Map Div -->
    <div id="mapContainer" class="map" ref="mapElement"></div>
    <!-- Zoom tag-->
    <div class="zoom"><b>Zoom: </b>{{ zoom }}</div>
    <!-- Location tag-->
    <div v-if="isUserLocationReady" class="fixed-bottom d-flex justify-content-center">
      <div class="location">
        <b>{{ t('homeView.mapView.myLocation') }}</b> Lat: {{ userLocation[0] }}, Lng:
        {{ userLocation[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import * as turf from '@turf/turf';
import L, { type LatLngExpression } from 'leaflet';

import { getTrackColor } from '@/utils/colors';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useTrackStore } from '@/stores/trackStore';
import mapsProviders from '@/components/home/mapsProviders';

const { t } = useI18n();
const { initialLocation, isUserLocationReady, userLocation, zoom } = storeToRefs(useGlobalStore());
const globalStore = useGlobalStore();
const mapElement = ref<HTMLDivElement>();
const trackStore = useTrackStore();
const { hideTrackIndex, selectedTrackIndex } = storeToRefs(useTrackStore());
const { userId } = storeToRefs(useAuthStore());

let map: L.Map;

let geojsonLayers: L.GeoJSON[];

onMounted(async () => {
  globalStore.getUserLocation();
  initializeMap();
  geojsonLayers = [];

  fixLeafletMarkerNotFoundInProductionEnv();
});

onUnmounted(() => {
  trackStore.unselectTrack();
  map.remove();
});

// Watch if Selected Track Index changes and then display and fly to it
watch(selectedTrackIndex, async () => {
  const index = selectedTrackIndex.value;

  if (index === -1) return;

  if (!geojsonLayers[index]) {
    geojsonLayers[index] = new L.GeoJSON(trackStore.trackList[index].geojsonData, {
      onEachFeature: showPopup,
      style: function () {
        return { color: getTrackColor(index), opacity: 0.8 };
      },
    });
  }
  const layer = geojsonLayers[index].addTo(map);
  map.flyToBounds(layer.getBounds());
});

// Watch if Hide Track Index changes and then remove it from the map
watch(hideTrackIndex, () => {
  if (hideTrackIndex.value === -1) return;
  const index = trackStore.hideTrackIndex;
  map.removeLayer(geojsonLayers[index]);
});

// Watch if the user's location changes and then show a popup with the location on the map
watch(userLocation, () => {
  L.marker(userLocation.value as LatLngExpression)
    .addTo(map)
    .bindPopup(
      `<div style="text-align: center">
        <h5>${t('homeView.mapView.myLocation')}</h5>
        <b>${t('homeView.mapView.latitude')}:</b> ${userLocation.value[0]}<br/>
        <b>${t('homeView.mapView.longitude')}:</b> ${userLocation.value[1]}
      </div>`,
    )
    .openPopup();
  flyToLocation();
});

// Watch if logged user id changes and then removes the layers
watch(userId, async () => {
  trackStore.unselectTrack();
  geojsonLayers.forEach(layer => map.removeLayer(layer));
  geojsonLayers = [];
  flyToLocation();
});

async function initializeMap() {
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  const baseMaps = {
    'MapBox - OpenStreetMap': mapsProviders.mapboxOsm,
    'OpenStreetMap - Mapnik': mapsProviders.openStreetMapMapnik,
    OpenTopoMap: mapsProviders.openTopoMap,
    MtbMap: mapsProviders.mtbMap,
    'ESRI WordImagery': mapsProviders.esriWorldImagery,
    'ESRI WordTopoMap': mapsProviders.esriWorldTopoMap,
  };

  map = L.map(mapElement.value, {
    zoomSnap: 0.25, // Forces the map's zoom level to always be a multiple of this (default = 1)
    zoomDelta: 0.5, // Zoom level using keyboard or zoom controls
    zoomControl: false, // zoom control off
    wheelPxPerZoomLevel: 128, // Zoom level in pixels using mouse wheel
  }).setView(initialLocation.value as LatLngExpression, zoom.value);
  map.addLayer(mapsProviders.mapboxOsm);

  map.on('zoom', () => {
    zoom.value = map.getZoom();
  });

  L.control.layers(baseMaps).addTo(map);
  L.control.scale().addTo(map);
  L.control
    .zoom({
      position: 'topleft',
      zoomInTitle: t('homeView.mapView.zoomControl.zoomInTitle'),
      zoomOutTitle: t('homeView.mapView.zoomControl.zoomOutTitle'),
    })
    .addTo(map);
}

function flyToLocation() {
  if (isUserLocationReady.value) {
    map.flyTo(userLocation.value as LatLngExpression, 11);
  } else {
    map.flyTo(initialLocation.value as LatLngExpression, 5);
  }
}

function showPopup(feature: any, layer: any) {
  if (!feature.properties) return;
  if (!feature.geometry) return;

  const geometry = feature.geometry;

  if (geometry.type === 'LineString') {
    showPopupTrackInformation(feature, layer);
  } else {
    showPopupPointInformation(feature, layer);
  }
}

function showPopupTrackInformation(feature: any, layer: any) {
  const selectedTrack = trackStore.trackList[trackStore.selectedTrackIndex];

  const line = turf.lineString(feature.geometry.coordinates);
  const distanceKm = turf.round(turf.length(line, { units: 'kilometers' }), 2);
  const distanceMi = turf.round(turf.length(line, { units: 'miles' }), 2);
  const coordinates = feature.geometry.coordinates as number[][];
  const heights = coordinates.map(x => x[2]);
  const maxHeight = Math.max(...heights);
  const minHeight = Math.min(...heights);
  let message = `
    <h5>${selectedTrack.name}</h5>
    <p>${selectedTrack.description}</p>
    <h6><b>${t('homeView.mapView.distance')}:</b> ${distanceKm} km (${distanceMi} mi)</h6>
    <p>
      <b>${t('homeView.mapView.maxHeight')}:</b> ${maxHeight} m<br>
      <b>${t('homeView.mapView.minHeight')}:</b> ${minHeight} m<br>
    </p>
  `;
  layer.bindPopup(message);
}

function showPopupPointInformation(feature: any, layer: any) {
  let message = '';

  let name: string = feature.properties.name;
  name = name.replace(/^\((.+)\)$/, '$1'); // Remove leading and trailing parentheses
  message = name ? `<h5>${name}</h5>` : '';

  const description = feature.properties.description;
  if (description) {
    const xmlDOM = new DOMParser().parseFromString(description.value, 'text/html');
    xmlDOM.getElementsByTagName('img')[0]?.remove();
    message += xmlDOM.body.innerHTML;
  }
  layer.bindPopup(message);
}

// Fix Leaflet Marker not found in production environment
// https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
// https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing
function fixLeafletMarkerNotFoundInProductionEnv() {
  type D = Icon.Default & {
    _getIconUrl?: string;
  };
  delete (Icon.Default.prototype as D)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/assets/img/marker-icon-2x.png',
    iconUrl: '/assets/img/marker-icon.png',
    shadowUrl: '/assets/img/marker-shadow.png',
  });
}
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: calc(100% - 3rem);
}

.map {
  background-color: rgb(181, 228, 255);
  height: 100%;
  width: 100%;
  z-index: 1;
}

.zoom {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  color: #444;
  font-size: 1rem;
  left: 3.5rem;
  margin: auto;
  padding: 0 0.5rem;
  position: absolute;
  text-align: center;
  top: 3.75rem;
  width: auto;
  z-index: 2;
}

.location {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  bottom: 1.5rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  color: #444;
  margin: auto;
  padding: 0rem 1rem;
  position: absolute;
  font-size: 1rem;
  z-index: 2;
}
</style>
