// src/features/unit/components/UnitMovementGraphs.tsx
import React, { useMemo } from 'react';
import GraphCard from '../../../components/graphCard/graphCard';
import { Unit  } from '../../../types/Unit';

interface UnitMovementGraphsProps {
  unit: Unit | null;
}

// Helper function to calculate distances
const calculateHaversineDistance = (
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const UnitMovementGraphs: React.FC<UnitMovementGraphsProps> = ({ unit }) => {
  // Calculate distance data from position history
  const distanceData = useMemo(() => {
    if (!unit || !unit.positionHistory || unit.positionHistory.length < 1) {
      return [];
    }
    
    const result = [];
    let totalDistance = 0;
    
    // Add current position to history for calculations
    const fullHistory = [...unit.positionHistory, unit.currentPosition];
    
    for (let i = 1; i < fullHistory.length; i++) {
      const prevPos = fullHistory[i - 1];
      const currPos = fullHistory[i];
      
      const distance = calculateHaversineDistance(
        prevPos.lat, prevPos.lng,
        currPos.lat, currPos.lng
      );
      
      totalDistance += distance;
      
      result.push({
        timestamp: currPos.timestamp,
        value: parseFloat(totalDistance.toFixed(2)),
        latitude: currPos.lat,
        longitude: currPos.lng
      });
    }
    
    return result;
  }, [unit]);

  // Calculate speed data
  const speedData = useMemo(() => {
    if (!unit || !unit.positionHistory || unit.positionHistory.length < 1) {
      return [];
    }
    
    const result = [];
    
    // Add current position to history for calculations
    const fullHistory = [...unit.positionHistory, unit.currentPosition];
    
    for (let i = 1; i < fullHistory.length; i++) {
      const prevPos = fullHistory[i - 1];
      const currPos = fullHistory[i];
      
      const distance = calculateHaversineDistance(
        prevPos.lat, prevPos.lng,
        currPos.lat, currPos.lng
      );
      
      const prevTime = new Date(prevPos.timestamp).getTime();
      const currTime = new Date(currPos.timestamp).getTime();
      const timeElapsedHours = (currTime - prevTime) / (1000 * 60 * 60);
      
      // Calculate speed in km/h
      const speed = timeElapsedHours > 0 ? distance / timeElapsedHours : 0;
      
      result.push({
        timestamp: currPos.timestamp,
        value: parseFloat(speed.toFixed(2))
      });
    }
    
    return result;
  }, [unit]);

  if (!unit) {
    return (
      <div className="no-unit-selected">Select a unit to view movement analytics</div>
    );
  }

  return (
    <div className="unit-movement-graphs">
      <GraphCard
        title={`${unit.name} - Distance Traveled`}
        data={distanceData}
        xAxisKey="timestamp"
        yAxisKey="value"
        type="line"
        showLegend={false}
        height={200}
        customOptions={{
          series: [{
            name: 'Total Distance (km)',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(72, 175, 240, 0.6)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(72, 175, 240, 0.1)'
                  }
                ]
              }
            }
          }],
          yAxis: {
            name: 'Distance (km)',
            nameTextStyle: {
              color: '#a7b6c2'
            }
          }
        }}
      />
      
      <GraphCard
        title={`${unit.name} - Speed`}
        data={speedData}
        xAxisKey="timestamp"
        yAxisKey="value"
        type="bar"
        showLegend={false}
        height={200}
        customOptions={{
          series: [{
            name: 'Speed (km/h)',
            itemStyle: {
              color: '#15B371'
            }
          }],
          yAxis: {
            name: 'Speed (km/h)',
            nameTextStyle: {
              color: '#a7b6c2'
            }
          }
        }}
      />
      
      {distanceData.length > 0 && (
        <div className="movement-stats">
          <div className="stat-item">
            <span className="stat-label">Total Distance:</span>
            <span className="stat-value">{distanceData[distanceData.length - 1]?.value} km</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Speed:</span>
            <span className="stat-value">
              {speedData.length > 0 
                ? (speedData.reduce((sum, item) => sum + item.value, 0) / speedData.length).toFixed(2) 
                : 0} km/h
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Duration:</span>
            <span className="stat-value">
              {distanceData.length > 0 && unit.positionHistory.length > 0 ? 
                formatDuration(
                  new Date(unit.positionHistory[0].timestamp).getTime(),
                  new Date(unit.currentPosition.timestamp).getTime()
                ) : '0h 0m 0s'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format duration
const formatDuration = (startTime: number, endTime: number): string => {
  const durationMs = endTime - startTime;
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

export default UnitMovementGraphs;