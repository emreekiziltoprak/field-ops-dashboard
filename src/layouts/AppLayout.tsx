import { Mosaic, MosaicWindow } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import MapPanel from "../panels/mapPanel/MapPanel";
import UnitInfoPanel from "../panels/unitInfoPanel/UnitInfoPanel";
import { JSX } from "react";

type PanelKey = "mapPanel" | "rightUnitPanel";

const ELEMENT_MAP: Record<PanelKey, JSX.Element> = {
  mapPanel: (
    <div style={{ 
      height: '100%',
      width: '100%',
      background: '#10161A',
      padding: 12,
      overflow: 'hidden' 
    }}>
      <MapPanel />
    </div>
  ),
  rightUnitPanel: (
    <div style={{ 
      height: '100%',
      width: '100%',
      background: '#1c2128',
      padding: 12,
      minWidth: '300px' 
    }}>
      <UnitInfoPanel />
    </div>
  ),
};

const PANEL_LABELS: Record<PanelKey, string> = {
  mapPanel: "Mission Map",
  rightUnitPanel: "Unit Info Panel",
};

const AppLayout = () => {
  return (
    <Mosaic<PanelKey>
      renderTile={(id, path) => (
        <MosaicWindow<PanelKey>
          path={path}
          title={PANEL_LABELS[id]}
          toolbarControls={[]} 
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          createNode={() => "newPanel"} 
        >
          {ELEMENT_MAP[id]}
        </MosaicWindow>
      )}
      initialValue={{
        direction: "row",
        first: "mapPanel",
        second: "rightUnitPanel",
        splitPercentage: 70, 
      }}
      className="h-screen mosaic-blueprint-theme bp5-dark"
      resize={{
        minimumPaneSizePercentage: 20, 
      }}
    />
  );
};

export default AppLayout;