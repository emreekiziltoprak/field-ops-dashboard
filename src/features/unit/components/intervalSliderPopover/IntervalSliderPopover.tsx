// components/IntervalSliderPopover.tsx
import React, { useState } from "react";
import { Slider } from "@blueprintjs/core";
import "./IntervalSliderPopover.scss";

interface IntervalSliderPopoverProps {
  initialValue: number;
  onChange: (value: number) => void;
}

export const IntervalSliderPopover: React.FC<IntervalSliderPopoverProps> = ({ initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="interval-slider-popover">
      <Slider
        min={5000}
        max={60000}
        stepSize={5000}
        labelStepSize={15000}
        value={value}
        onChange={handleSliderChange}
      />
    </div>
  );
};
