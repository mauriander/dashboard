import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchCity({ onLocationSearch}) {
  const [namesearch, setNamesearch] = useState('');
  const [results, setResults] = useState([]);

  const url = 'https://geocoding-api.open-meteo.com/v1/search?count=40&language=es&format=json';

  useEffect(() => {
    if (namesearch) {
      fetch(`${url}&name=${namesearch}`)
        .then((response) => response.json())
        .then((data) => setResults(data.results))
        .catch((error) => console.error('Error fetching data:', error));
    } else {
      setResults([]);
    }
  }, [namesearch]);

const handleSelectLocation = (location) => {
  setNamesearch(`${location.name}, ${location.admin1}, ${location.country_code}`);
  setResults([]);
  onLocationSearch(location); // Llama a la función con la ubicación seleccionada
};

  return (
    <div >
    <br />
      <FaSearch></FaSearch>
      <input style={{ background: "gray" }}
        type="text"
        placeholder="Buscar ciudad..."
        value={namesearch}
        onChange={(e) => setNamesearch(e.target.value)}
      />
         {results && results.length > 0 && (      
       <select onChange={(e) => handleSelectLocation(results.find((location) => location.id === parseInt(e.target.value)))} >     
       <option>Seleccione una ciudad</option>
  {results.map((location) => (
    <option key={location.id} value={location.id}>
      {`${location.name}, ${location.admin1}, ${location.country_code}`}
    </option>
  ))}
</select>
      )}
   
    </div>
  );
}

export default SearchCity;
