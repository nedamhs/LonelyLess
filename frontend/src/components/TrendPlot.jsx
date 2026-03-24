import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'


 
const styles = `
  .trend-plot-card {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.65);
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 14px;
    padding: 14px 16px 10px;
  }
 
  .trend-plot-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
 
  .trend-plot-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--purple-dark, #6b4fa0);
  }
 
  .trend-select {
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark, #3d2d6b);
    background: #eeedfe;
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 6px;
    padding: 3px 8px;
    cursor: pointer;
    outline: none;
    max-width: 180px;
  }
 
  .trend-select:focus {
    border-color: var(--purple-mid, #8b6fc0);
  }
 
  .trend-chart-wrap {
    width: 100%;
    height: 180px;
  }
 
  .trend-loading {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-light, #a89cc8);
  }
 
  .trend-tooltip {
    background: rgba(255,255,255,0.95);
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 8px;
    padding: 7px 11px;
    font-size: 11px;
    color: var(--text-dark, #3d2d6b);
    font-family: 'DM Sans', sans-serif;
  }
 
  .trend-tooltip .t-label {
    color: var(--text-mid, #7a6a9a);
    margin-bottom: 2px;
  }
`
 
function CustomTooltip({ active, payload, label, feature, color }) {
  if (!active || !payload?.length) return null
  return (
    <div className="trend-tooltip">
      <div className="t-label">{label}</div>
      <div style={{ fontWeight: 500, color }}>{feature}: {payload[0].value?.toFixed(2)}</div>
    </div>
  )
}
 
function pickTicks(dates) {
  if (!dates.length) return []
  const mid = Math.floor((dates.length - 1) / 2)
  return [dates[0], dates[mid], dates[dates.length - 1]]
}
 
function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
 
export default function TrendPlot({ title, data, loading, color, gradientId, exclude = [], extraDropdown = null }) {
  console.log('extraDropdown:', extraDropdown)
  const excludeSet = new Set(exclude)
 
  const features = data.length
    ? Object.keys(data[0]).filter(k => !excludeSet.has(k))
    : []
 
  const [selected, setSelected] = useState('')
 
  useEffect(() => {
    if (features.length && !selected) setSelected(features[0])
  }, [features.length])
 
  const chartData = data
    .filter(row => row[selected] !== null && row[selected] !== undefined)
    .map(row => ({ date: row.date, value: parseFloat(row[selected]) }))
 
  const dates = chartData.map(d => d.date)
  const ticks = pickTicks(dates)
 
  return (
    <>
      <style>{styles}</style>
      <div className="trend-plot-card">
        <div className="trend-plot-header">
            <span className="trend-plot-title">{title}</span>
            {extraDropdown}
            {features.length > 0 && (
              <select
                className="trend-select"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                {features.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            )}
      </div>
 
        {loading ? (
          <div className="trend-loading">loading...</div>
        ) : chartData.length === 0 ? (
          <div className="trend-loading">no data</div>
        ) : (
          <div className="trend-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(155,132,204,0.12)" />
                <XAxis
                  dataKey="date"
                  ticks={ticks}
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: '#a89cc8', fontFamily: 'DM Sans' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#a89cc8', fontFamily: 'DM Sans' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip feature={selected} color={color} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  )
}