import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import CoffeeMarker from './CoffeeMarker';

const CoffeeMap = ({ coffeeShops }) => {
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  });

  const radiusCircle = (
    <Marker
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      offsetLeft={-20}
      offsetTop={-20}
    >
      <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 255, 0.3)' }} />
    </Marker>
  );

  return (
    <Map
      initialViewState={viewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onMove={evt => setViewport(evt.viewState)}
    >
      {radiusCircle}
      {coffeeShops.map(shop => (
        <CoffeeMarker key={shop.id} shop={shop} />
      ))}
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" />
    </Map>
  );
};

export default CoffeeMap;