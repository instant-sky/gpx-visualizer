<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import "../scripts/L.Polyline.SnakeAnim.js"

const props = defineProps<{ gpxFiles: Array<{ name: string, file: File, visible: boolean }> }>()

const mapDiv = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let polylines: L.Polyline[] = []
let all_coords: L.LatLng[] = []

onMounted(() => {
  if (mapDiv.value) {
    map = L.map(mapDiv.value as HTMLDivElement).setView([52.5251819, 13.3700300], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  }
})


function gpx_loader(gpx_file: string): L.LatLng[] {
    //returns name and coords of a gpx track given as xml string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpx_file, "text/xml");
    const track = xmlDoc.querySelector("trk");
    if (!track) {
      return [];
    }
    //const track_name = track.querySelector("name")?.textContent ?? null;
    const track_segments = track.querySelectorAll("trkseg");
    let coords: L.LatLng[] = [];
    track_segments.forEach(segment => {
        const track_points = segment.querySelectorAll("trkpt");
        track_points.forEach(track_point => {
            let lat = parseFloat(track_point.getAttribute("lat") ?? "0");
            let lon = parseFloat(track_point.getAttribute("lon") ?? "0");
            if (!isNaN(lat) && !isNaN(lon)) {
              coords.push(L.latLng(lat, lon));
            }
        });
    });
    return coords;
}

function gpx_file_loader(gpx_file: { name: string, file: File, visible: boolean }, callback: (gpxData: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const gpxData = e.target?.result as string;
    callback(gpxData);
  };
  reader.readAsText(gpx_file.file);
}

function animatePolyline(polyline: L.Polyline, map: L.Map) {
  console.log(polyline)
  polyline.snakeIn();

  const tipMarker = L.circleMarker([0, 0], { radius: 5, opacity: 1, fill: true, fillOpacity: 1}).addTo(map);
  polyline.on('snake', function() {
    // Get the current tip position
    const latlngs = polyline.getLatLngs();
    let tip: L.LatLng | null = new L.LatLng(0, 0);
    if (Array.isArray(latlngs[0])) {
      // Multi-polyline
      const lastSegment = latlngs[latlngs.length - 1];
      if (Array.isArray(lastSegment)) {
        tip = lastSegment[lastSegment.length - 1] as L.LatLng;
      } else {
        tip = lastSegment as L.LatLng;
      }
    } else {
      // Single polyline
      tip = latlngs[latlngs.length - 1] as L.LatLng;
    }
    tipMarker.setLatLng(tip);
    //map.panTo(tip);
  })
  polyline.on('snakeend', function() {
    map.removeLayer(tipMarker);
  });
}

function animate_all_tracks() {
  /*const allFiles = props.gpxFiles;
  console.log("Animate all tracks called in map component");
  allFiles.forEach(fileObj => {
    console.log(fileObj);
    // You can access fileObj.name, fileObj.file, fileObj.visible
    // For example, animate only visible tracks:
    if (fileObj.visible) {
      // Animate this track
    }
  });*/
  polylines.forEach(polyline => {
    if (map) {
      //map?.removeLayer(polyline);
      console.log(polyline);
      animatePolyline(polyline, map)//animatePolyline(polyline, map);
    }
  });
}

defineExpose({ animate_all_tracks })

// Here you would watch props.gpxFiles and add/remove GPX layers accordingly
watch(() => props.gpxFiles, (newFiles) => { //TODO: runs on all files, not only on newly created ones
  console.log("file watcher in map component triggered")
  Promise.all(
  newFiles.filter(f => f.visible).map(fileObj =>
    new Promise(resolve => {
      gpx_file_loader(fileObj, gpxData => {
        const track_coords = gpx_loader(gpxData);
        all_coords.push(...track_coords);

        if (map && track_coords.length > 1) {
          const polyline = L.polyline(track_coords);
          polyline.addTo(map);
          polylines.push(polyline);
        }

        resolve(track_coords);
      });
    })
  )
).then(() => {
  if (all_coords.length > 0) {
    map?.flyToBounds(L.latLngBounds(all_coords), {duration: 1});
  }
  all_coords = [] // clear all_coords for now to not store unnecessary data
});
})
</script>

<template>
  <div ref="mapDiv" id="mapDiv"></div>
</template>