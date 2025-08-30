/// <reference types="vite/client" />

import 'leaflet';

declare module 'leaflet' {
  interface Polyline {
    snakeIn(): this;
    pauseSnake(): this;
    resumeSnake(): this;
  }
}

declare module 'lodash-es';