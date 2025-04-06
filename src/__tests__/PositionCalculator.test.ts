import { PositionCalculator } from '../service/unitSimulation/PositionCalculator';

describe('PositionCalculator', () => {
  let calculator: PositionCalculator;

  beforeEach(() => {
    calculator = new PositionCalculator();
  });

  test('northward movement increases latitude', () => {
    const initialLat = 39.9334;
    const initialLng = 32.8597;
    const result = calculator.calculateNewPosition(initialLat, initialLng, 10, 0, 10);
    
    expect(result.lat).toBeGreaterThan(initialLat);
    expect(result.lng).toBeCloseTo(initialLng, 4);
  });
  
  test('eastward movement increases longitude', () => {
    const initialLat = 39.9334;
    const initialLng = 32.8597;
    const result = calculator.calculateNewPosition(initialLat, initialLng, 10, 90, 10);
    
    expect(result.lng).toBeGreaterThan(initialLng);
    expect(result.lat).toBeCloseTo(initialLat, 4);
  });
  
  test('southeast movement changes both coordinates', () => {
    const initialLat = 39.9334;
    const initialLng = 32.8597;
    const result = calculator.calculateNewPosition(initialLat, initialLng, 10, 135, 10);
    
    expect(result.lat).toBeLessThan(initialLat);
    expect(result.lng).toBeGreaterThan(initialLng);
  });
  
  test('zero speed returns original position', () => {
    const initialLat = 39.9334;
    const initialLng = 32.8597;
    const result = calculator.calculateNewPosition(initialLat, initialLng, 0, 90, 10);
    
    expect(result.lat).toBeCloseTo(initialLat);
    expect(result.lng).toBeCloseTo(initialLng);
  });
  
  test('long movement matches expected displacement', () => {
    const initialLat = 39.9334;
    const initialLng = 32.8597;
    const result = calculator.calculateNewPosition(initialLat, initialLng, 5, 0, 3600);
    
    const expectedLatDiff = 0.16;
    const actualLatDiff = result.lat - initialLat;
    
    expect(actualLatDiff).toBeCloseTo(expectedLatDiff, 1);
  });
}); 