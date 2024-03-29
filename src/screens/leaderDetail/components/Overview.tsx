import 'chartjs-plugin-datalabels';
import moment from 'moment';
import 'moment/locale/en-au';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { formatter } from 'utils/utilities';
import { getProfitService } from '../services';
const Overview = ({ id_expert }) => {
  // const [number, setNumber] = useState(0);
  const expertDetail = useSelector((state: any) => state.screen.leaderDetail.expertDetail.data);
  const [fromDate, setfromDate] = useState(moment().subtract(7, 'days'));
  const [toDate, settoDate] = useState(new Date());
  const [type, setType] = useState('DAY');
  const [filterTitle, setfilterTitle] = useState('7 Days');
  const [data, setdata] = useState([]);
  moment().locale('en-au');
  useEffect(() => {
    handleChartChange();
  }, []);

  const handleChartChange = async () => {
    try {
      let body = {
        type,
        fromDate: moment.utc(fromDate).format('YYYY-MM-DD HH:mm:ss'),
        toDate: moment.utc(toDate).format('YYYY-MM-DD HH:mm:ss'),
        id_expert,
      };
      const res = await getProfitService(body);
      if (res && res.data) {
        setdata(res.data);
      }
    } catch (error) {}
  };
  const options = {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: 'white',
        // offset: -25,
        font: {
          // weight: 'bold'
        },
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            // Include a dollar sign in the ticks
            weight: 100,
            beginAtZero: true,
            callback: (value, index, values) => {
              return value + '%';
            },
          },
        },
      ],
    },
  };
  let dataChart = data.reverse();
  let map1 = dataChart.map((x) => formatter.format(Math.abs(x['total_gain'])));
  const map2 =
    type === 'MONTH'
      ? dataChart.map((x) => moment.utc(x['updatedAt']).format('MMM'))
      : dataChart.map((x) => moment.utc(x['updatedAt']).format('DD-MMM'));
  const bg = dataChart.map((x) => {
    return x['total_gain'] > 0 ? '#3FC66D' : '#c72826';
  });
  const chart = {
    labels: filterTitle !== '1 Months' ? map2 : [moment.utc(new Date()).format('MMM')],
    datasets: [
      {
        backgroundColor: filterTitle !== '1 Months' ? bg : '#3FC66D',
        data: filterTitle !== '1 Months' ? map1 : [expertDetail?.info?.gain_rate_months],
        pointRadius: 0,
      },
    ],
  };
  const fillChartByTime = async (date) => {
    let today = new Date();
    settoDate(today);
    switch (date) {
      case 0:
        setfilterTitle('7 Days');
        setfromDate(moment(today).subtract(7, 'days'));
        setType('DAY');
        break;
      case 1:
        setfilterTitle('1 Months');
        // setfromDate(moment(today).subtract(1, 'month'));
        setType('MONTH');
        break;
      case 3:
        setfilterTitle('3 Months');
        setfromDate(moment(today).subtract(3, 'month'));
        setType('MONTH');
        break;
      case 6:
        setfilterTitle('6 Months');
        setfromDate(moment(today).subtract(6, 'month'));
        setType('MONTH');
        break;
      case 12:
        setfilterTitle('12 Months');
        setfromDate(moment(today).subtract(12, 'month'));
        setType('MONTH');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleChartChange();
  }, [fromDate]);

  return (
    <div className="overview">
      <div className="name-wrapper">
        <p>{filterTitle} Gain</p>
        {/*<p>Data as of {data && moment(data[0]['updatedAt']).format('DD MMM YYYY HH:mm:ss')}</p>*/}
      </div>
      <div className="tab-wrapper">
        <button className="tab" onClick={() => fillChartByTime(0)}>
          7 days
        </button>
        <button className="tab" onClick={() => fillChartByTime(1)}>
          1 months
        </button>
        <button className="tab" onClick={() => fillChartByTime(3)}>
          3 months
        </button>
        <button className="tab" onClick={() => fillChartByTime(6)}>
          6 months
        </button>
        <button className="tab" onClick={() => fillChartByTime(12)}>
          12 months
        </button>
        {/* <button className="tab" onClick={() => fillChartByTime(24)}>
          All
        </button> */}
      </div>
      <Bar width={1300} height={230} data={chart} options={options} />
    </div>
  );
};

export default Overview;
