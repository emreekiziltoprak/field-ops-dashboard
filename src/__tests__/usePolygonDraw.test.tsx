import { renderHook } from '@testing-library/react';
import { usePolygonDraw } from '../features/draw/hooks/usePolygonDraw';
import { ScreenSpaceEventHandler, Viewer } from 'cesium';

jest.mock('cesium', () => ({
  Cartesian2: jest.fn().mockImplementation((x, y) => ({ x, y })),
  Cartesian3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  Color: {
    AQUAMARINE: 'mock-color',
    AQUA: { withAlpha: jest.fn().mockReturnValue('mock-color') },
    LIME: 'mock-color',
    BLACK: 'mock-color'
  },
  Entity: jest.fn(),
  PolygonHierarchy: jest.fn(positions => ({ positions })),
  PolylineGraphics: jest.fn(options => options),
  PointGraphics: jest.fn(options => options),
  ScreenSpaceEventHandler: jest.fn().mockImplementation(() => ({
    setInputAction: jest.fn(),
    destroy: jest.fn()
  })),
  ScreenSpaceEventType: {
    MOUSE_MOVE: 'mouse_move',
    LEFT_CLICK: 'left_click',
    RIGHT_CLICK: 'right_click'
  },
  CallbackProperty: jest.fn(callback => ({ callback, setCallback: jest.fn() }))
}));

describe('usePolygonDraw Hook', () => {
  let mockViewer: Partial<Viewer>;
  let mockOnComplete: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockViewer = {
      canvas: {} as HTMLCanvasElement,
      scene: {
        pickPosition: jest.fn(position => 
          new (jest.requireMock('cesium').Cartesian3)(position.x, position.y, position.z)
        )
      } as unknown as Viewer['scene'],
      entities: {
        add: jest.fn().mockReturnValue({ 
          id: 'test-entity', 
          position: null, 
          polyline: { positions: null } 
        }),
        remove: jest.fn()
      } as unknown as Viewer['entities']
    };
    
    mockOnComplete = jest.fn();
  });
  
  test('ignores setup when disabled', () => {
    renderHook(() => usePolygonDraw(mockViewer as Viewer, false, mockOnComplete));
    expect(ScreenSpaceEventHandler).not.toHaveBeenCalled();
  });
  
  test('creates handler when enabled', () => {
    renderHook(() => usePolygonDraw(mockViewer as Viewer, true, mockOnComplete));
    expect(ScreenSpaceEventHandler).toHaveBeenCalledWith(mockViewer.canvas);
    const mockSetInputAction = (ScreenSpaceEventHandler as jest.Mock).mock.instances[0].setInputAction;
    expect(mockSetInputAction).toHaveBeenCalledTimes(3);
  });
  
  test('cleans up on unmount', () => {
    const { unmount } = renderHook(() => 
      usePolygonDraw(mockViewer as Viewer, true, mockOnComplete)
    );
    
    unmount();
    
    const mockDestroy = (ScreenSpaceEventHandler as jest.Mock).mock.instances[0].destroy;
    expect(mockDestroy).toHaveBeenCalled();
  });
  
  test('handles enabled state changes', () => {
    const { rerender } = renderHook(
      ({ enabled }) => usePolygonDraw(mockViewer as Viewer, enabled, mockOnComplete),
      { initialProps: { enabled: false } }
    );
    
    expect(ScreenSpaceEventHandler).not.toHaveBeenCalled();
    
    rerender({ enabled: true });
    
    expect(ScreenSpaceEventHandler).toHaveBeenCalledWith(mockViewer.canvas);
  });
  
  test('skips entity creation without viewer', () => {
    renderHook(() => usePolygonDraw(null, true, mockOnComplete));
    expect(mockViewer.entities?.add).not.toHaveBeenCalled();
  });
}); 