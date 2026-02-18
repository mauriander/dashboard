import React from "react";
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from "react-icons/fa";

function RadarControls({
  frameIndex,
  totalFrames,
  currentLabel,
  horizonLabel,
  isPlaying,
  playSpeed,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onScrub,
  onChangeSpeed,
}) {
  if (totalFrames <= 0) {
    return null;
  }

  return (
    <div className="radar-controls card" aria-label="Controles de animación radar">
      <div className="radar-controls-row">
        <button type="button" className="btn btn-ghost radar-btn" onClick={onStepBack} aria-label="Frame anterior">
          <FaStepBackward />
        </button>
        <button type="button" className="btn btn-primary radar-btn" onClick={onTogglePlay} aria-label={isPlaying ? "Pausar radar" : "Reproducir radar"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button type="button" className="btn btn-ghost radar-btn" onClick={onStepForward} aria-label="Frame siguiente">
          <FaStepForward />
        </button>

        <label className="radar-speed" htmlFor="radarSpeedSelect">
          Velocidad
          <select id="radarSpeedSelect" className="control" value={playSpeed} onChange={(event) => onChangeSpeed(Number(event.target.value))}>
            <option value={0.5}>x0.5</option>
            <option value={1}>x1</option>
            <option value={2}>x2</option>
          </select>
        </label>
      </div>

      <div className="radar-controls-row timeline">
        <input
          type="range"
          min={0}
          max={Math.max(totalFrames - 1, 0)}
          value={frameIndex}
          className="radar-slider"
          onChange={(event) => onScrub(Number(event.target.value))}
          aria-label="Seleccionar frame del radar"
        />
      </div>

      <div className="radar-labels">
        <span>{horizonLabel}</span>
        <strong>{currentLabel}</strong>
      </div>
    </div>
  );
}

export default RadarControls;
