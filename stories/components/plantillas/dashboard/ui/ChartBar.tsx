import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { useThemeContext } from '@/themes/ThemeRegistry'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ChartBar = () => {
  const { themeMode } = useThemeContext()

  const optionsBar: ApexOptions = {
    chart: {
      id: 'apexchart-bar',
      type: 'bar',
      toolbar: { tools: { download: false } },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      labels: {
        style: {
          colors: themeMode == 'light' ? '#2A2928' : '#fff',
        },
      },
    },
    tooltip: {
      //theme: themeMode == 'light' ? 'light' : 'dark',
      style: {
        fontSize: '14px',
      },

      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const tooltipTheme = themeMode == 'light' ? 'light' : 'dark'
        return `<div style="
                background-color: ${tooltipTheme === 'light' ? '#f3f3f3' : '#2A2A2A'};
                color: ${tooltipTheme === 'light' ? '#2A2928' : '#fff'};
                border-radius: 10px;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
                ">
                <div style="background-color: ${tooltipTheme === 'light' ? '#dadada' : '#3f3f3f'}; padding: 5px;">${w.globals.labels[dataPointIndex]}</div>
                <div style="padding: 6px;
                            display:flex;
                            flex-direction: row;
                            align-items: center">
                  <div style="width: 10px;
                              height: 10px;
                              background-color: ${w.globals.markers.colors[seriesIndex]}; 
                              border-radius: 50%;
                              margin-right: 5px">
                  </div>
                  <div>
                    ${w.globals.seriesNames[seriesIndex]}: <b>${series[seriesIndex][dataPointIndex]}</b>
                  </div>
              </div>`
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: themeMode == 'light' ? '#2A2928' : '#fff',
        },
      },
    },
    theme: {
      monochrome: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -1,
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    series: [
      {
        name: 'series-1',
        data: [300, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  }

  return (
    <div>
      <Chart
        options={optionsBar}
        type="bar"
        width="100%"
        series={optionsBar.series}
      />
    </div>
  )
}

export default ChartBar
