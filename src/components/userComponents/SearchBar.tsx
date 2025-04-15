import React, { useState, useRef, useEffect } from "react";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface MapboxAutocompleteProps {
  onSelectLocation: (coordinates: [number, number], placeName: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<MapboxAutocompleteProps> = ({ 
  onSelectLocation, 
  initialValue = "" 
}) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const geocoderRef = useRef<any>(null);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_TOKEN;
  const onSelectLocationRef = useRef(onSelectLocation);
  
  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .mapboxgl-ctrl-geocoder {
        min-width: 100%;
        max-width: 100%;
        width: 100%;
        border-radius: 9999px;
        box-shadow: none;
      }
      
      .mapboxgl-ctrl-geocoder--input {
        height: 50px;
        padding-left: 40px !important;
        color: #374151;
        font-family: inherit;
      }
      
      .mapboxgl-ctrl-geocoder--input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }
      
      .mapboxgl-ctrl-geocoder--icon {
        top: 15px;
      }
      
      .mapboxgl-ctrl-geocoder--icon-search {
        top: 15px;
      }
      
      .mapboxgl-ctrl-geocoder--button {
        top: 10px;
      }
      
      /* Critical styles for suggestions container */
      .mapboxgl-ctrl-geocoder--suggestions {
        position: absolute;
        z-index: 50;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid #f3f4f6;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion {
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid #f3f4f6;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion:last-child {
        border-bottom: none;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion-title {
        font-weight: 600;
        color: #1f2937;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion-address {
        color: #6b7280;
        font-size: 0.875rem;
      }
      
      .mapboxgl-ctrl-geocoder--suggestion-active {
        background-color: #eff6ff;
      }
    `;
    document.head.appendChild(styleElement);
    styleElementRef.current = styleElement;
  
    return () => {
      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current);
      }
    };
  }, []);  // Empty dependency array means this runs once on mount

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
      flyTo: false,
      // Force these options for better suggestion behavior
      countries: undefined, // Don't restrict by country
      limit: 5, // Show more results
      minLength: 2, // Start showing results with fewer characters
      proximity: undefined, // Don't bias by proximity
    });
    
    geocoderRef.current = geocoder;
    geocoder.addTo(geocoderContainerRef.current);
    
    // Apply custom styling to the geocoder input
    setTimeout(() => {
      if (geocoderRef.current && geocoderRef.current._inputEl) {
        const inputEl = geocoderRef.current._inputEl;
        
        // Add Tailwind-like classes directly to element
        inputEl.classList.add('pl-10', 'text-base', 'font-medium', 'text-gray-700');
        
        // Add icon to the input
        const parentContainer = inputEl.parentElement;
        if (parentContainer) {
          const iconContainer = document.createElement('div');
          iconContainer.className = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500';
          iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
          parentContainer.classList.add('relative');
          parentContainer.insertBefore(iconContainer, inputEl);
        }
        
        // Set initial value if provided
        if (initialValue) {
          inputEl.value = initialValue;
        }
        
        // Ensure the parent container doesn't block suggestions
        const grandParent = parentContainer?.parentElement;
        if (grandParent) {
          grandParent.style.overflow = 'visible';
        }
      }
    }, 100);

    geocoder.on('result', (e) => {
      if (e.result && e.result.geometry && e.result.geometry.coordinates) {
        const [lng, lat] = e.result.geometry.coordinates;
        const placeName = e.result.place_name || '';
        setSearchValue(placeName);
        onSelectLocationRef.current([lat, lng], placeName);
      }
    });

    geocoder.on('clear', () => {
      setSearchValue('');
    });

    return () => {
      geocoder.onRemove();
    };
  }, []);

  useEffect(() => {
    if (geocoderRef.current && geocoderRef.current._inputEl && searchValue) {
      geocoderRef.current._inputEl.value = searchValue;
    }
  }, [searchValue]);

  return (
    <div className="w-full">
      <div className="relative">
        {/* Wrapper div with Tailwind styling - ensure overflow is visible for suggestions */}
        <div className="rounded-full overflow-visible shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
          <div
            ref={geocoderContainerRef}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;