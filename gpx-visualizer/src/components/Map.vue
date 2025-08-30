<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import "../scripts/L.Polyline.SnakeAnim.js"
import { debounce } from 'lodash-es'

const props = defineProps<{ gpxFiles: Array<{ name: string, file: File, visible: boolean }> }>()

const mapDiv = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let polylines: L.Polyline[] = []
let all_coords: L.LatLng[] = []

onMounted(() => {
  if (mapDiv.value) {
    map = L.map(mapDiv.value as HTMLDivElement).setView([52.5251819, 13.3700300], 13)
    /*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)*/

    var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
CartoDB_DarkMatter.addTo(map)
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

function gpx_file_loader_async(gpx_file: { name: string, file: File, visible: boolean }): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const gpxData = e.target?.result as string
      resolve(gpxData)
    }
    reader.onerror = reject
    reader.readAsText(gpx_file.file)
  })
}

function animatePolyline(polyline: L.Polyline, map: L.Map, follow_marker: Boolean = false) {

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
    if (follow_marker) {
      map.panTo(tip);
    }
  })
  polyline.on('snakeend', () => {
    map.removeLayer(tipMarker);
  });

    polyline.snakeIn();
}

function toggle_pause_resume(isPaused: boolean) {
  polylines.forEach(polyline => {
    if (!isPaused) {
      polyline.pauseSnake();
    } else if (isPaused) {
      polyline.resumeSnake();
    }
  })
}

function animate_all_tracks_sequential() {
  let index = 0;

  // remove all polylines first
  polylines.forEach(polyline => {
    map?.removeLayer(polyline);
  })

  function animateNext() {
    if (index >= polylines.length || !map) return;
    const polyline = polylines[index];

    polyline.once('snakeend', () => {
      index++;
      animateNext();
    });
    polyline.addTo(map);
    animatePolyline(polyline, map, true);
  }
  animateNext();
}


function animate_all_tracks_parallel() {
  polylines.forEach(polyline => {
    if (map) {
      polyline.off('snake') // this seems to be necessary to stop the view from following the polyline tip
      map.removeLayer(polyline);
      polyline.addTo(map);
      animatePolyline(polyline, map, false);
    }
  });
}

defineExpose({ animate_all_tracks_parallel, animate_all_tracks_sequential, toggle_pause_resume })

// Here you would watch props.gpxFiles and add/remove GPX layers accordingly
watch(() => props.gpxFiles, debounce(async(newFiles: any[]) => {
  // Remove all existing polylines
  polylines.forEach(polyline => {
    if (map?.hasLayer(polyline)) {
      map.removeLayer(polyline)
    }
  })
  polylines = []
  all_coords = []

  const visibleFiles = newFiles.filter(f => f.visible)

  for (const fileObj of visibleFiles) {
    try {
      const gpxData = await gpx_file_loader_async(fileObj)
      const track_coords = gpx_loader(gpxData)
      all_coords.push(...track_coords)

      if (map && track_coords.length > 1) {
        const polyline = L.polyline(track_coords)
        polyline.addTo(map)
        polylines.push(polyline)
      }
    } catch (err) {
      console.error(`Failed to load ${fileObj.name}`, err)
    }
  }

  if (all_coords.length > 0) {
    map?.flyToBounds(L.latLngBounds(all_coords), { duration: 1 })
  }
  all_coords = []
}, 100))

</script>

<template>
  <div ref="mapDiv" id="mapDiv"></div>
</template>