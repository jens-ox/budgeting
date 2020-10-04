import { quantize } from 'd3-interpolate'
import { scaleOrdinal } from 'd3-scale'
import { interpolateSpectral } from 'd3-scale-chromatic'
import { arc, pie, PieArcDatum } from 'd3-shape'
import showAmount from '../helpers/showAmount'
import CumulatedEntry from '../types/CumulatedEntry'
import SpendingCategory from '../types/SpendingCategory'

interface IDonut {
  label?: string
  data: Array<CumulatedEntry>
}

const size = 200

const sortFunction = (a: CumulatedEntry, b: CumulatedEntry) =>
  b.amount - a.amount

const pieGenerator = pie<CumulatedEntry>()
  .padAngle(0.005)
  .sort(sortFunction)
  .value((d) => d.amount)

const radius = size / 2
const innerRadius = radius * 0.67
const outerRadius = radius - 1
const arcGenerator = arc<PieArcDatum<CumulatedEntry>>()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

const Donut = ({ data, label }: IDonut) => {
  const arcs = pieGenerator(data)

  const color = scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(
      quantize((t) => interpolateSpectral(t * 0.8 + 0.1), data.length).reverse()
    )

  const onePercent = data.reduce((acc, entry) => acc + entry.amount, 0) / 100

  const savings = data.find((entry) => entry.label === SpendingCategory.SAVINGS)

  return (
    <div className="flex rounded border border-gray-300 p-4 shadow mb-6">
      <div>
        {label && (
          <div className="text-lg mb-3 w-full text-center">{label}</div>
        )}
        <svg
          width={size}
          height={size}
          viewBox={`${-size / 2}, ${-size / 2}, ${size}, ${size}`}
          className="mr-4"
        >
          <g>
            <circle r={innerRadius} className="donut-circle"></circle>
            <circle r={outerRadius} className="donut-circle"></circle>
          </g>
          <g>
            {arcs
              .filter((arc) => arc.data.label !== SpendingCategory.SAVINGS)
              .map((arc, i) => (
                <path
                  key={`arc-${i}`}
                  fill={color(arc.data.label) as string}
                  d={arcGenerator(arc)}
                ></path>
              ))}
          </g>
          {savings && (
            <>
              <text y={-14} className="text-savings-label">
                savings rate
              </text>
              <text
                className={`text-savings-quote ${
                  savings.amount > 0 ? 'fill-green' : 'fill-red'
                }`}
              >
                {percentFormatter.format(savings.amount / onePercent / 100)}
              </text>
            </>
          )}
        </svg>
      </div>
      <div className="mt-12">
        <table className="table-inline">
          <tbody>
            {data.sort(sortFunction).map((entry, i) => (
              <tr key={`legend-${i}`}>
                <td
                  style={{ color: color(entry.label) as string }}
                  className="text-sm"
                >
                  ⬤
                </td>
                <td className="font-bold mr-2">
                  {percentFormatter.format(entry.amount / onePercent / 100)}
                </td>
                <td>{entry.label}</td>
                <td className="text-gray-600 italic text-right">
                  {showAmount(entry.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Donut
