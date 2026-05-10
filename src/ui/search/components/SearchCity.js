import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { searchLocationsByName } from "../services/geocodingService";
import "./search.css";

function SearchCity({ onLocationSearch }) {
  const [namesearch, setNamesearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedLabelRef = useRef("");

  useEffect(() => {
    const query = namesearch.trim();

    if (selectedLabelRef.current === query) {
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    searchLocationsByName(query)
      .then((data) => {
        if (isCancelled) {
          return;
        }

        setResults(data.results || []);
        setActiveIndex(0);
        setIsOpen(true);
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Error fetching data:", error);
          setResults([]);
          setIsOpen(true);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [namesearch]);

  const getLocationLabel = (location) => {
    return [location.name, location.admin1, location.country_code].filter(Boolean).join(", ");
  };

  const getLocationMeta = (location) => {
    const latitude = Number(location.latitude).toFixed(2);
    const longitude = Number(location.longitude).toFixed(2);
    return `${location.country || location.country_code || "Ubicación"} · ${latitude}, ${longitude}`;
  };

  const handleSelectLocation = (location) => {
    if (!location) {
      return;
    }

    const label = getLocationLabel(location);
    selectedLabelRef.current = label;
    setNamesearch(label);
    setResults([]);
    setIsOpen(false);
    onLocationSearch(location);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.min(currentIndex + 1, results.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      handleSelectLocation(results[activeIndex]);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && namesearch.trim().length >= 2;

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
            placeholder="Ej: Esperanza, Santa Fe"
            value={namesearch}
            onChange={(e) => {
              selectedLabelRef.current = "";
              setNamesearch(e.target.value);
            }}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="Buscar ciudad"
            aria-expanded={showDropdown}
            aria-controls="citySearchResults"
            aria-activedescendant={showDropdown && results[activeIndex] ? `city-result-${results[activeIndex].id}` : undefined}
            role="combobox"
            autoComplete="off"
          />
        </div>

        {showDropdown ? (
          <div
            id="citySearchResults"
            className="search-results"
            role="listbox"
            aria-label="Resultados de ciudad"
          >
            {isLoading ? <div className="search-empty" role="status">Buscando...</div> : null}
            {!isLoading && results.length === 0 ? <div className="search-empty">Sin resultados</div> : null}
            {!isLoading
              ? results.map((location, index) => (
                  <button
                    id={`city-result-${location.id}`}
                    key={location.id}
                    type="button"
                    className={`search-result ${index === activeIndex ? "active" : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelectLocation(location)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span className="search-result-title">{getLocationLabel(location)}</span>
                    <span className="search-result-meta">{getLocationMeta(location)}</span>
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchCity;
