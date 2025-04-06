// components/IntervalSliderPopover.tsx
import React, { useEffect, useState } from "react";
import { Slider, Label } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshInterval } from "../../../../store/simulationSlice";
import { RootState } from "../../../../store";
import "./IntervalSliderPopover.scss";

interface IntervalSliderPopoverProps {
  initialValue?: number;
  onChange?: (value: number) => void;
}

export const IntervalSliderPopover: React.FC<IntervalSliderPopoverProps> = ({ 
  onChange 
}) => {
  const dispatch = useDispatch();
  const refreshInterval = useSelector((state: RootState) => state.simulation.refreshInterval);
  const [value, setValue] = useState(refreshInterval);

  // When external refreshInterval changes, update local state
  useEffect(() => {
    setValue(refreshInterval);
  }, [refreshInterval]);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    
    // Update Redux state
    dispatch(setRefreshInterval(newValue));
    
    // Call optional callback for backward compatibility
    if (onChange) {
      onChange(newValue);
    }
  };

  const formatLabelValue = (ms: number) => {
    return ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`;
  };

  return (
    <div className="interval-slider-popover">
      <Label>
        Simülasyon Hızı: {formatLabelValue(value)}
      </Label>
      <Slider
        min={2500}
        max={60000}
        stepSize={1000}
        labelStepSize={15000}
        labelRenderer={formatLabelValue}
        value={value}
        onChange={handleSliderChange}
        showTrackFill={true}
      />
    </div>
  );
};
