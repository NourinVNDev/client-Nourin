// import React, { useEffect, useRef, useState } from 'react';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// interface MapboxAutocompleteProps {
//   onSelectLocation: (lat: number, lng: number, place: string) => void;
// }

// const MapboxAutocomplete: React.FC<MapboxAutocompleteProps> = ({ onSelectLocation }) => {
//   const geocoderContainerRef = useRef<HTMLDivElement>(null);
//   const geocoderRef = useRef<MapboxGeocoder | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_TOKEN;

//   useEffect(() => {
//     if (!geocoderContainerRef.current) return;

//     if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === 'YOUR_MAPBOX_ACCESS_TOKEN') {
//       console.error('Mapbox access token is missing or invalid');
//       return;
//     }

//     const geocoder = new MapboxGeocoder({
//       accessToken: MAPBOX_ACCESS_TOKEN,
//       types: 'address,place',
//       placeholder: 'Search for a location...',
//       marker: false,
//     });

//     geocoderRef.current = geocoder;
//     geocoder.addTo(geocoderContainerRef.current);

//     geocoder.on('result', (e) => {
//       if (e.result && e.result.geometry && e.result.geometry.coordinates) {
//         const [lng, lat] = e.result.geometry.coordinates;
//         const placeName = e.result.place_name || '';
//         setSearchValue(placeName);
//         onSelectLocation(lat, lng, placeName);
//       }
//     });

//     const applyCustomStyles = () => {
//       const geocoderInput = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--input');
//       if (geocoderInput) {
//         (geocoderInput as HTMLElement).style.height = '50px';
//         (geocoderInput as HTMLElement).style.fontSize = '16px';
//       }
//     };

//     setTimeout(applyCustomStyles, 100);

//     return () => {
//       if (geocoderRef.current) {
//         geocoderRef.current.onRemove();
//         geocoderRef.current = null;
//       }
//     };
//   }, [MAPBOX_ACCESS_TOKEN, onSelectLocation]);

//   useEffect(() => {
//     console.log("Effect",searchValue);
    
//     if (geocoderRef.current) {
//       console.log("gang");
      
//       if (searchValue) {
//         geocoderRef.current.setInput(searchValue);
//       }
//     }
  
    
//   }, [searchValue]);

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       .mapboxgl-ctrl-geocoder {
//         width: 100% !important;
//         max-width: 100% !important;
//         box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
//         border-radius: 0.5rem !important;
//         font-family: inherit !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--input {
//         height: 3rem !important;
//         padding: 0.75rem 1rem !important;
//         font-size: 1rem !important;
//         transition: all 0.3s ease !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--input:focus {
//         outline: none !important;
//         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--icon {
//         top: 12px !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--icon-search {
//         top: 12px !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--button {
//         background-color: transparent !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--suggestion-title {
//         font-weight: 600 !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--suggestion-address {
//         color: #6B7280 !important;
//       }
      
//       .mapboxgl-ctrl-geocoder--suggestion:hover {
//         background-color: #F3F4F6 !important;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   return (
//     <div className="mb-4">
//       <div 
//         ref={geocoderContainerRef}
//         className="w-1/2 relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300"
//       />
//       <div className="mt-1 text-xs text-gray-500">
//         Type to search for a location
//       </div>
//     </div>
//   );
// };

// export default MapboxAutocomplete;
import React, { useEffect, useRef } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface MapboxAutocompleteProps {
  onSelectLocation: (lat: number, lng: number, place: string) => void;
}

const MapboxAutocomplete: React.FC<MapboxAutocompleteProps> = ({ onSelectLocation }) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_TOKEN;

  useEffect(() => {
    if (!geocoderContainerRef.current) return;

    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      console.error('Mapbox access token is missing or invalid');
      return;
    }

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_ACCESS_TOKEN,
      types: 'address,place',
      placeholder: 'Search for a location...',
      marker: false,
      countries:'in'
    });

    geocoderRef.current = geocoder;
    geocoder.addTo(geocoderContainerRef.current);

    geocoder.on('result', (e) => {
      if (e.result && e.result.geometry && e.result.geometry.coordinates) {
        const [lng, lat] = e.result.geometry.coordinates;
        const placeName = e.result.place_name || '';
        onSelectLocation(lat, lng, placeName);

        // Directly set the input value
        const inputElement = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = placeName; // Directly set the input value
        }
      }
    });

    const applyCustomStyles = () => {
      const geocoderInput = geocoderContainerRef.current?.querySelector('.mapboxgl-ctrl-geocoder--input');
      if (geocoderInput) {
        (geocoderInput as HTMLElement).style.height = '50px';
        (geocoderInput as HTMLElement).style.fontSize = '16px';
      }
    };

    setTimeout(applyCustomStyles, 100);

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
        geocoderRef.current = null;
      }
    };
  }, [MAPBOX_ACCESS_TOKEN, onSelectLocation]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .mapboxgl-ctrl-geocoder {
        width: 100% !important;
        max-width: 100% !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        border-radius: 0.5rem !important;
        font-family: inherit !important;
      }
      
      .mapboxgl-ctrl-geocoder--input {
        height: 3rem !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        transition: all 0.3s ease !important;
      }
      
      .mapboxgl-ctrl-geocoder--input:focus {
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
      }
      
      .mapboxgl-ctrl-geocoder--icon {
        top: 12px !important;
      }
      
      .mapboxgl-ctrl-geocoder--icon-search {
        top: 12px !important;
      }
      
      .mapboxgl-ctrl-geocoder--button {
        background-color: transparent !important;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion-title {
        font-weight: 600 !important;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion-address {
        color: #6B7280 !important;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion:hover {
        background-color: #F3F4F6 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="mb-4">
      <div 
        ref={geocoderContainerRef}
        className="w-1/2 relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300"
      />
      <div className="mt-1 text-xs text-gray-500">
        Type to search for a location
      </div>
    </div>
  );
};

export default MapboxAutocomplete;