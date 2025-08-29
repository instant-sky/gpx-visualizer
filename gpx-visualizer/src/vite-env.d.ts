/// <reference types="vite/client" />

import 'leaflet';

declare module 'leaflet' {
  interface Polyline {
    snakeIn(): this;
  }
}

declare module 'lodash-es';