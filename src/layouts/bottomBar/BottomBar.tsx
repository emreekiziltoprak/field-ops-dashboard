// components/BottomBar.tsx
import React, { useState } from "react";
import { Popover, Button } from "@blueprintjs/core";
import { IntervalSliderPopover } from "../../features/unit/components/intervalSliderPopover/IntervalSliderPopover";
import "./BottomBar.scss";

interface Props {
  onIntervalChange: (interval: number) => void;
}

export const BottomBar: React.FC<Props> = ({ onIntervalChange }) => {
  const [sliderValue, setSliderValue] = useState(10000);

  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    onIntervalChange(val);
  };

  return (
    <div className="bottom-bar bp4-dark">
      <Popover content={<IntervalSliderPopover initialValue={sliderValue} onChange={handleSliderChange} />} minimal>
        <Button icon="time" minimal outlined small />
      </Popover>
    </div>
  );
};
