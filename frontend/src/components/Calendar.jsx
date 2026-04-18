import { useState, useMemo, useEffect } from 'react'
 
const COLORS = ['#e8e0f5', '#c4b5e8', '#9b84cc', '#8b6fc0', '#6b4fa0']
const EMPTY_COLOR = 'rgba(155,132,204,0.08)'
 
const styles = `
  .cal-card {
    background: rgba(255,255,255,0.7);
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 10px;
    padding: 8px 10px;
    width: 18%;
    margin: 0 auto;
    transform: scale(0.75);
    transform-origin: bottom center;
  }
 
  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 8px;
  }
 
  .cal-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-dark, #3d2d6b);
    white-space: nowrap;
  }
 
  .cal-arrows {
    display: flex;
    gap: 3px;
  }
 
  .cal-arrow {
    font-size: 12px;
    color: var(--purple-mid, #8b6fc0);
    background: #eeedfe;
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.6;
  }
 
  .cal-arrow:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
 
  .cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 1px;   
  row-gap: 4px;      
}
 
  .cal-day-label {
    font-size: 10px;
    color: var(--text-light, #a89cc8);
    text-align: center;
    padding-bottom: 2px;
  }
 
  .cal-cell {
  width: 90%;
  aspect-ratio: 1;
  border-radius: 2px;
  cursor: default;
  position: relative;
  margin: 0 auto;
}
 
  .cal-cell.has-data {
    cursor: pointer;
  }
 
  .cal-cell.has-data:hover .cal-tooltip {
    display: block;
  }
 
  .cal-tooltip {
    display: none;
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.97);
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 6px;
    padding: 3px 7px;
    font-size: 9px;
    color: var(--text-dark, #3d2d6b);
    white-space: nowrap;
    z-index: 10;
    font-family: 'DM Sans', sans-serif;
    pointer-events: none;
  }
 
  .cal-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 3px solid transparent;
    border-top-color: var(--purple-border, #9b84cc);
  }
 
  .cal-legend {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
 
  .cal-legend-label {
    font-size: 15px;
    color: var(--text-light, #a89cc8);
  }
 
  .cal-legend-cells {
    display: flex;
    gap: 2px;
  }
 
  .cal-legend-cell {
    width: 8px;
    height: 8px;
    border-radius: 1px;
  }
`
 
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
 
function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}
 
function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
 
function getColorIndex(value, min, max) {
  if (value === null || value === undefined) return null
  if (max === min) return 2
  const normalized = (value - min) / (max - min)
  return Math.min(4, Math.floor(normalized * 5))
}
 
export default function Calendar({ data }) {
  const [currentYear, setCurrentYear] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(null)
 
  const dailyAvgs = useMemo(() => {
    const map = {}
    data.forEach(row => {
      if (row.feel_lonely === null || row.feel_lonely === undefined) return
      if (!map[row.date]) map[row.date] = { sum: 0, count: 0 }
      map[row.date].sum += row.feel_lonely
      map[row.date].count += 1
    })
    const result = {}
    Object.entries(map).forEach(([date, { sum, count }]) => {
      result[date] = sum / count
    })
    return result
  }, [data])
 
  const dates = Object.keys(dailyAvgs).sort()
  const firstDate = dates.length ? new Date(dates[0]) : null
  const lastDate = dates.length ? new Date(dates[dates.length - 1]) : null
 
  useEffect(() => {
    if (dates.length && currentYear === null) {
      setCurrentYear(firstDate.getFullYear())
      setCurrentMonth(firstDate.getMonth())
    }
  }, [dates.length])
 
  const values = Object.values(dailyAvgs)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 5
 
  if (currentYear === null) return <div className="cal-card" style={{ minHeight: 80, minWidth: 120 }} />
 
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
 
  const canGoPrev = new Date(currentYear, currentMonth, 1) > new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
  const canGoNext = new Date(currentYear, currentMonth, 1) < new Date(lastDate.getFullYear(), lastDate.getMonth(), 1)
 
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
 
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }
 
  const formatDate = (day) => {
    const d = new Date(currentYear, currentMonth, day)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
 
  const getDateKey = (day) => {
    const d = new Date(currentYear, currentMonth, day)
    return d.toISOString().split('T')[0]
  }
 
  return (
    <>
      <style>{styles}</style>
      <div className="cal-card">
        <div className="cal-header">
          <div className="cal-title">{formatMonthYear(currentYear, currentMonth)}</div>
          <div className="cal-arrows">
            <button className="cal-arrow" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
            <button className="cal-arrow" onClick={nextMonth} disabled={!canGoNext}>›</button>
          </div>
        </div>
 
        <div className="cal-grid">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="cal-day-label">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-cell" style={{ background: 'transparent' }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateKey = getDateKey(day)
            const value = dailyAvgs[dateKey]
            const colorIdx = value !== undefined ? getColorIndex(value, min, max) : null
            const bg = colorIdx !== null ? COLORS[colorIdx] : EMPTY_COLOR
            const hasData = value !== undefined
            return (
              <div
                key={day}
                className={`cal-cell ${hasData ? 'has-data' : ''}`}
                style={{ background: bg }}
              >
                {hasData && (
                  <div className="cal-tooltip">
                    {formatDate(day)} — {value.toFixed(2)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
 
        <div className="cal-legend">
          <div className="cal-legend-label">low</div>
          <div className="cal-legend-cells">
            {COLORS.map((c, i) => (
              <div key={i} className="cal-legend-cell" style={{ background: c }} />
            ))}
          </div>
          <div className="cal-legend-label">high</div>
        </div>
      </div>
    </>
  )
}