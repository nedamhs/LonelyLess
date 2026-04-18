import { useState, useEffect } from 'react'
import TrendPlot from './TrendPlot'
 
const TEAL = '#2ec4b6'
const EXCLUDE = ['id', 'user_id', 'date', 'timestamp', 'surveyindex']
 
const styles = `
  .ema-section {
    max-width: 80%;
  }
 
  .ema-plots-row {
    display: flex;
    gap: 12px;
  }
`
 
export default function EMASection({ token }) {
  const [dailyData, setDailyData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loadingDaily, setLoadingDaily] = useState(true)
  const [loadingWeekly, setLoadingWeekly] = useState(true)
 
  useEffect(() => {
    if (!token) return
 
    // get daily ema data 
    fetch('http://localhost:8000/ema/daily', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setDailyData([...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoadingDaily(false)
      })
      .catch(() => setLoadingDaily(false))
 
    // get weekly ema data 
    fetch('http://localhost:8000/ema/weekly', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setWeeklyData([...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoadingWeekly(false)
      })
      .catch(() => setLoadingWeekly(false))
 
  }, [token])
 
  return (
    <>
      <style>{styles}</style>
      <div className="ema-section">
        <div className="ema-plots-row">
          {/* daily ema trend plot */}
          <TrendPlot
            title="daily EMA"
            data={dailyData}
            loading={loadingDaily}
            color={TEAL}
            gradientId="emaDaily"
            exclude={EXCLUDE}
          />

          {/* weekly ema trend plot */}
          <TrendPlot
            title="weekly EMA"
            data={weeklyData}
            loading={loadingWeekly}
            color={TEAL}
            gradientId="emaWeekly"
            exclude={EXCLUDE}
          />
        </div>
      </div>
    </>
  )
}