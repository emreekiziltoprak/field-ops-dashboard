// src/components/graphCard/graphCard.tsx
import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Elevation } from '@blueprintjs/core';
import './index.scss';

interface GraphCardProps {
  title: string;
  data: any[];
  xAxisKey?: string;
  yAxisKey?: string;
  type?: 'line' | 'bar' | 'scatter' | 'area';
  showLegend?: boolean;
  height?: string | number;
  customOptions?: any;
  className?: string;
}

const GraphCard: React.FC<GraphCardProps> = ({
  title,
  data,
  xAxisKey = 'timestamp',
  yAxisKey = 'value',
  type = 'line',
  showLegend = true,
  height = '300px',
  customOptions = {},
  className = '',
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Resize chart when window resizes
    const handleResize = () => {
      if (chartRef.current) {
        const chartInstance = chartRef.current.getEchartsInstance();
        chartInstance.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartOptions = () => {
    // Check if data is valid
    if (!data || data.length === 0) {
      return {
        title: {
          text: 'No data available',
          left: 'center',
          textStyle: {
            color: '#ccc'
          }
        }
      };
    }

    const baseOptions = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: '#e0e0e0',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#555',
        textStyle: {
          color: '#e0e0e0'
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item[xAxisKey]),
        axisLine: {
          lineStyle: {
            color: '#5c7080'
          }
        },
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: '#abb3bf',
          formatter: (value: string) => {
            // Format dates if needed
            if (value && value.includes('T')) {
              try {
                const date = new Date(value);
                return date.toLocaleTimeString();
              } catch (e) {
                return value;
              }
            }
            return value;
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#5c7080'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(92, 112, 128, 0.2)'
          }
        },
        axisLabel: {
          color: '#abb3bf'
        }
      },
      series: [
        {
          name: yAxisKey,
          type: type,
          data: data.map(item => item[yAxisKey]),
          itemStyle: {
            color: '#48aff0'
          },
          lineStyle: {
            width: 2,
            color: '#48aff0'
          },
          areaStyle: type === 'area' ? {
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
          } : undefined
        }
      ],
      legend: showLegend ? {
        show: true,
        bottom: 0,
        textStyle: {
          color: '#e0e0e0'
        }
      } : { show: false }
    };

    // Merge with custom options
    return {
      ...baseOptions,
      ...customOptions
    };
  };

  return (
    <Card elevation={Elevation.TWO} className={`graph-card ${className}`}>
      <ReactECharts
        ref={chartRef}
        option={getChartOptions()}
        style={{ height, width: '100%' }}
        theme="dark"
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
};

export default GraphCard;