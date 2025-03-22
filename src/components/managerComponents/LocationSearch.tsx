import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface PlacesAutocompleteProps {
  onSelectLocation: (address: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({ onSelectLocation }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState<string>("");

  // Handle loading of Google Maps Autocomplete
  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  // Handle place selection
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setValue(place.formatted_address);
        onSelectLocation(place.formatted_address);
      }
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter address"
        className="w-full p-2 border border-gray-300 rounded text-gray-800 bg-white focus:ring focus:ring-blue-400"
      />
    </Autocomplete>
  );
};

export default PlacesAutocomplete;




// // LocationSearch.tsx
// import { Autocomplete } from "@react-google-maps/api";
// import { useState } from "react";

// interface LocationSearchProps {
//   onSelectLocation: (address: string) => void;
// }

// const LocationSearch = ({ onSelectLocation }: LocationSearchProps) => {
//   const [address, setAddress] = useState<string>("");
//   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

//   const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
//     setAutocomplete(autocomplete);
//   };

//   const onPlaceChanged = () => {
//     if (autocomplete) {
//       const place = autocomplete.getPlace();
//       if (place && place.formatted_address) {
//         setAddress(place.formatted_address);
//         onSelectLocation(place.formatted_address);
//       }
//     }
//   };

//   return (
//     <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter location"
//         style={{
//           width: "100%",
//           padding: "10px",
//           fontSize: "16px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//           background:"white",
//           color:"grey"
//         }}
//       />
//     </Autocomplete>
//   );
// };

// export default LocationSearch;
