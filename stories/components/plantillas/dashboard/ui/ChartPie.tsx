import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { useThemeContext } from '@/themes/ThemeRegistry'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ChartPie = () => {
  const { themeMode } = useThemeContext()

  const optionsPie: ApexOptions = {
    chart: {
      id: 'apexchart-pie',
      type: 'pie',
      foreColor: themeMode == 'light' ? '#3f3e3d' : '#fff',
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
    tooltip: {
      theme: themeMode == 'light' ? 'light' : 'dark',
    },
    dataLabels: {
      style: {
        colors: [themeMode == 'light' ? '#e9e9e9' : '#fff'],
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    series: [44, 55, 13, 43, 22],
    labels: [
      'Ropa y Accesorios',
      'Alimentos y Bebidas',
      'Belleza y Cuidado Personal',
      'Juguetes y Juegos',
      'Libros y Medios',
    ],
  }

  return (
    <div>
      <Chart
        options={optionsPie}
        type="pie"
        width="100%"
        series={optionsPie.series}
      />
    </div>
  )
}

export default ChartPie
