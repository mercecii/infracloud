import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import rawData from '../utils/rawData';
import { borderColors, backgroundColors } from '../utils/chartConfigs';

export interface IData {
  endpoint: string;
  time: string;
  requests: number;
  special?: boolean;
}

export interface OrderedPair {
  x: string;
  y: number;
}
export interface IDataSet {
  label: string;
  data: OrderedPair[];
  borderColor?: string;
  backgroundColor?: string;
}

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [dataSets, setDataSets] = useState<IDataSet[]>([]);
  const getUniqueApiAsLabel = (data: IData[]) => {
    const labels = new Set<string>([]);
    data.forEach((el, ind) => {
      labels.add(el.endpoint);
    });
    return labels;
  };
  const labels = useMemo(() => getUniqueApiAsLabel(rawData), []);

  const getMinDateInData = () => {
    const minDate = new Date(
      Math.min(
        ...rawData.map((el) => {
          return Date.parse(el.time);
        })
      )
    );
    minDate.setDate(minDate.getDate() - 1);
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDateInData = () => {
    const minDate = new Date(
      Math.max(
        ...rawData.map((el) => {
          return Date.parse(el.time);
        })
      )
    );
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState<string>(getMinDateInData());
  const [endDate, setEndDate] = useState<string>(getMaxDateInData());

  const createDataSetsForLabel = useCallback(
    (rawData: IData[], startDate = '', endDate = '') => {
      let dataSets: IDataSet[] = [];
      let timeFilteredData = rawData;
      if (startDate && endDate) {
        console.log('found startDate && endDate');
        timeFilteredData = rawData.filter(
          (el) => Date.parse(el.time) > Date.parse(startDate) && Date.parse(el.time) < Date.parse(endDate)
        );
      }
      labels.forEach((label: string, index) => {
        const temp: OrderedPair[] = timeFilteredData
          .filter((el: IData) => el.endpoint === label)
          .map((el) => ({ x: el.time, y: el.requests }))
          .sort((a, b) => Date.parse(a['x']) - Date.parse(b['x']));
        dataSets.push({ label, data: temp });
      });
      dataSets = dataSets.map((el, index) => {
        return { ...el, borderColor: borderColors[index], backgroundColor: backgroundColors[index], tension: 0.5 };
      });
      return dataSets;
    },
    [labels]
  );

  const startDateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value).toISOString().split('T')[0]);
  };
  const endDateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value).toISOString().split('T')[0]);
  };

  useEffect(() => {
    setDataSets(createDataSetsForLabel(rawData));
  }, [createDataSetsForLabel]);

  useEffect(() => {
    setDataSets(createDataSetsForLabel(rawData, startDate, endDate));
  }, [createDataSetsForLabel, startDate, endDate]);

  return (
    <>
      <div style={{ padding: '20px', width: '80%' }}>
        <Line
          data={{
            datasets: dataSets,
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Traffic of APIs',
              },
              legend: {
                display: true,
              },
            },
            layout: {
              padding: 20,
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                },
                grid: {
                  display: true,
                },
                title: {
                  display: true,
                  text: 'Dates',
                },
                min: getMinDateInData(),
                max: getMaxDateInData(),
              },
              y: {
                grid: {
                  display: true,
                },
                title: {
                  display: true,
                  text: 'No. of Requests',
                },
              },
            },
          }}
        />
        <section>
          <label>Select Date Range: </label>
          <input type="date" value={startDate} onChange={startDateChangeHandler} />
          <input type="date" value={endDate} onChange={endDateChangeHandler} />
        </section>
      </div>
    </>
  );
};

export default LineChart;
