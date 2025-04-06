// components/BottomBar.tsx
import React from "react";
import { Popover, Button, Navbar } from "@blueprintjs/core";
import { IntervalSliderPopover } from "../../features/unit/components/intervalSliderPopover/IntervalSliderPopover";
import "./BottomBar.scss";

export const BottomBar: React.FC = () => {
  return (
    <Navbar className="bottom-bar bp5-dark">
      <Popover content={<IntervalSliderPopover />} minimal>
        <Button icon="time" minimal outlined small />
      </Popover>
    </Navbar>
  );
};
