import React from "react";

interface Props {
  value: string;
  onChange: (s: string) => void;
}

const SensorSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 rounded border"
    >
      <option value="air">Aire</option>
      <option value="water">Agua</option>
      <option value="sound">Sonido</option>
    </select>
  );
};

export default SensorSelector;
