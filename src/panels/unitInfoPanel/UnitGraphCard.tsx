// src/components/SimpleUnitChart.tsx
import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { Card, Elevation, Spinner } from "@blueprintjs/core";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// TypeScript interfaces
interface Position {
  timestamp: string;
  lat: number;
  lng: number;
}

interface DistanceData {
  time: string;
  value: number;
}

interface UnitChartData {
  unitId: number;
  unitName: string;
  distanceData: DistanceData[];
  totalDistance: number;
  averageSpeed: number;
}

// Haversine formula for distance calculation
const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Average speed calculation
const calculateAverageSpeed = (
  positionData: Position[],
  totalDistance: number
): number => {
  if (!positionData || positionData.length < 2) {
    return 0;
  }

  const firstTimestamp = new Date(positionData[0].timestamp).getTime();
  const lastTimestamp = new Date(
    positionData[positionData.length - 1].timestamp
  ).getTime();

  const durationHours = (lastTimestamp - firstTimestamp) / (1000 * 60 * 60);

  if (durationHours < 0.001) {
    return 0;
  }

  const avgSpeed = totalDistance / durationHours;

  return avgSpeed > 500 ? 0 : avgSpeed;
};

// Format speed for display
const formatSpeed = (speed: number): string => {
  if (speed < 0.1) return "Hesaplanamadı";
  return `${speed.toFixed(1)} km/h`;
};

const UnitGraphCard: React.FC = () => {
  const chartRef = useRef<ReactECharts>(null);
  const selectedUnits = useSelector(
    (state: RootState) => state.unit.selectedUnits
  );
  const simulationUnits = useSelector(
    (state: RootState) => state.simulation.units
  );
  const [unitCharts, setUnitCharts] = useState<UnitChartData[]>([]);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);

  // Force chart to render after the component is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only proceed if we have selected units
    if (selectedUnits.length === 0) {
      setUnitCharts([]);
      return;
    }

    // Process each selected unit
    const charts: UnitChartData[] = [];

    selectedUnits.forEach((selectedUnit) => {
      const unitId = parseInt(selectedUnit.id);
      const fullUnitData = simulationUnits.find((u) => u.id === unitId);

      if (!fullUnitData || !fullUnitData.positionHistory) {
        return; // Skip this unit
      }

      // Calculate distances using Haversine
      const distances: DistanceData[] = [];
      let totalDistance = 0;

      // Use position history plus current position
      const allPositions = [
        ...fullUnitData.positionHistory,
        fullUnitData.currentPosition,
      ];

      // Add first position (starting point)
      if (allPositions.length > 0) {
        distances.push({
          time: new Date(allPositions[0].timestamp).toLocaleTimeString(),
          value: 0, // Starting point
        });
      }

      for (let i = 1; i < allPositions.length; i++) {
        const prevPos = allPositions[i - 1];
        const currPos = allPositions[i];

        const segmentDistance = calculateHaversineDistance(
          prevPos.lat,
          prevPos.lng,
          currPos.lat,
          currPos.lng
        );

        totalDistance += segmentDistance;

        distances.push({
          time: new Date(currPos.timestamp).toLocaleTimeString(),
          value: parseFloat(totalDistance.toFixed(2)),
        });
      }

      // Calculate average speed with improved function
      const averageSpeed = calculateAverageSpeed(allPositions, totalDistance);

      charts.push({
        unitId,
        unitName: selectedUnit.name,
        distanceData: distances,
        totalDistance,
        averageSpeed: parseFloat(averageSpeed.toFixed(1)),
      });
    });

    setUnitCharts(charts);

    // Force chart to rerender
    if (chartRef.current) {
      setTimeout(() => {
        if (chartRef.current) {
          const echartsInstance = chartRef.current.getEchartsInstance();
          if (echartsInstance) {
            echartsInstance.clear();
            echartsInstance.setOption(getChartOptions(charts[0]), true);
          }
        }
      }, 100);
    }
  }, [selectedUnits, simulationUnits]);

  // If no data for any unit, don't render anything
  if (unitCharts.length === 0) {
    return null;
  }

  const getChartOptions = (chartData: UnitChartData) => {
    // Generate fake data points if we have only one real data point
    let displayData = [...chartData.distanceData];

    // If we have less than 3 points, create some fake ones for visibility
    if (displayData.length < 3) {
      const baseValue =
        displayData.length > 0 ? displayData[displayData.length - 1].value : 0;
      const baseTime =
        displayData.length > 0
          ? displayData[displayData.length - 1].time
          : new Date().toLocaleTimeString();

      // Add dummy points for visualization
      for (let i = displayData.length; i < 3; i++) {
        displayData.push({
          time: baseTime,
          value: baseValue + 0.01 * i, // Just a tiny increment to make line visible
        });
      }
    }

    // Create a simpler dataset for better visibility
    const simplifiedData = [
      { value: 0 },
      { value: chartData.totalDistance > 0 ? chartData.totalDistance : 0.1 },
    ];

    return {
      animation: false,
      title: {
        text: `${chartData.unitName} - Hareket Mesafesi`,
        left: "center",
        textStyle: {
          color: "#e0e0e0",
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      tooltip: {
        show: true,
        trigger: "axis",
        formatter: function (params: any) {
          const dataPoint = params[0];
          return `<div style="padding: 4px 8px;">
                  <div>Zaman: ${dataPoint.name || ""}</div>
                  <div style="font-weight: bold;">Mesafe: ${
                    typeof dataPoint.value === "number"
                      ? dataPoint.value.toFixed(2)
                      : dataPoint.value
                  } km</div>
                  </div>`;
        },
        backgroundColor: "rgba(50, 50, 50, 0.8)",
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        top: "25%",
        containLabel: true,
      },
      // Fix X-axis label settings
      xAxis: {
        type: "category",
        data: chartData.distanceData.map((item) => item.time),
        axisLine: {
          show: true,
          lineStyle: {
            color: "#5c7080",
            width: 1.5,
          },
        },
        axisLabel: {
          color: "#abb3bf",
          rotate: 45,
          fontSize: 9, // Reduce font size
          margin: 8, // Reduce margin
          interval: 2, // Show every 2nd label (to reduce crowding)
        },
      },

      // Optimize Y-axis settings as well
      yAxis: {
        type: "value",
        name: "Mesafe (km)",
        nameTextStyle: {
          color: "#abb3bf",
          fontWeight: "bold",
          padding: [0, 0, 0, 0], // Reset name padding
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#5c7080",
            width: 1.5,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(92, 112, 128, 0.3)",
            width: 1,
          },
        },
        axisLabel: {
          color: "#abb3bf",
          formatter: function(value) {
            if (value === 0) return "0";
            if (value === 0.3) return "0.3";
            if (value === 0.6) return "0.6";
            if (value === 0.9) return "0.9";
            if (value === 1.2) return "1.2";
            if (value === 1.5) return "1.5";
            if (value >= 2) return value.toFixed(0);
            return value.toFixed(1);
          },
          margin: 2
        },
        min: 0,
        max: function (value) {
          return Math.ceil(Math.max(1, value.max * 1.1));
        },
      },
      yAxis: {
        type: "value",
        name: "Mesafe (km)",
        nameTextStyle: {
          color: "#abb3bf",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#5c7080",
            width: 1.5,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(92, 112, 128, 0.3)",
            width: 1,
          },
        },
        color: "#abb3bf",
        formatter: function (value: number) {
          // Format decimal part to max 2 digits
          return value.toFixed(2) + " km";
        },
        // Fixed min/max values
        min: 0,
        max: Math.max(1, chartData.totalDistance * 1.5),
      },
      series: [
        {
          name: "Toplam Mesafe",
          type: "line",
          data: displayData.map((item) => item.value),
          lineStyle: {
            width: 3,
            color: "#FF9A69",
          },
          itemStyle: {
            color: "#FF9A69",
          },
          showSymbol: true,
          symbolSize: 6,
          z: 5,
        },
      ],
    };
  };

  return (
    <>
      {unitCharts.map((chartData, index) => (
        <Card
          key={chartData.unitId}
          elevation={Elevation.TWO}
          style={{
            marginTop: 15,
            background: "#252a31",
            marginBottom: index < unitCharts.length - 1 ? 20 : 0,
            zIndex: 1,
            position: "relative",
          }}
        >
          {!isChartReady ? (
            <div
              style={{
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner size={50} />
            </div>
          ) : chartData.distanceData.length === 0 ? (
            <div
              style={{
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a7b6c2",
                fontSize: "14px",
              }}
            >
              Yeterli hareket verisi bulunmamaktadır. Birim hareket ettiğinde
              grafik otomatik güncellenecektir.
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <ReactECharts
                ref={chartRef}
                option={getChartOptions(chartData)}
                style={{ height: "250px", width: "100%" }}
                opts={{ renderer: "canvas" }}
                theme="dark"
                notMerge={true}
                lazyUpdate={false}
              />
            </div>
          )}

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              color: "#e0e0e0",
              padding: "10px",
              backgroundColor: "#1c2127",
              borderRadius: "3px",
            }}
          >
            <div>
              <span
                style={{ color: "#9ba7b3", fontSize: "12px", display: "block" }}
              >
                Toplam Mesafe:
              </span>
              <span style={{ fontWeight: 600 }}>
                {chartData.totalDistance.toFixed(2)} km
              </span>
            </div>
            <div>
              <span
                style={{ color: "#9ba7b3", fontSize: "12px", display: "block" }}
              >
                Ortalama Hız:
              </span>
              <span style={{ fontWeight: 600 }}>
                {formatSpeed(chartData.averageSpeed)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default UnitGraphCard;
