import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { searchLocationsByName } from "../services/geocodingService";
import "./search.css";

function SearchCity({ onLocationSearch }) {
  const [namesearch, setNamesearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (namesearch) {
      searchLocationsByName(namesearch)
        .then((data) => setResults(data.results || []))
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      setResults([]);
    }
  }, [namesearch]);

  const handleSelectLocation = (location) => {
    if (!location) {
      return;
    }

    setNamesearch(`${location.name}, ${location.admin1}, ${location.country_code}`);
    setResults([]);
    onLocationSearch(location);
  };

  return (
    <div className="search-city" role="search">
      <div className="search-field">
        <label className="field-label" htmlFor="citySearchInput">
          Buscar ciudad
        </label>
        <div className="search-input-wrap">
          <FaSearch className="icon" aria-hidden="true" />
          <input
            id="citySearchInput"
            className="control search-input"
            type="search"
            placeholder="Ej: Córdoba, AR"
            value={namesearch}
            onChange={(e) => setNamesearch(e.target.value)}
            aria-label="Buscar ciudad"
            autoComplete="off"
          />
        </div>
      </div>

      {results.length > 0 ? (
        <div className="search-field">
          <label className="field-label" htmlFor="citySearchResults">
            Resultados
          </label>
          <select
            id="citySearchResults"
            className="control search-select"
            onChange={(e) => handleSelectLocation(results.find((location) => location.id === parseInt(e.target.value, 10)))}
            aria-label="Seleccionar ciudad"
          >
            <option value="">Seleccione una ciudad</option>
            {results.map((location) => (
              <option key={location.id} value={location.id}>
                {`${location.name}, ${location.admin1}, ${location.country_code}`}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default SearchCity;
