import { useState, useEffect } from 'react'
import TrendPlot from './TrendPlot'

const COLORS = {
  activity: '#8bbe6a',  
  readiness: '#e07d3a',
  sleep: '#c9a84c',
}

const EXCLUDE = ['id', 'user_id', 'date', 'timestamp', 'sleep_bedtime_start', 'sleep_bedtime_end']

const styles = `
  .oura-section {
    max-width: 80%;
  }

  .oura-plots-row {
    display: flex;
    gap: 12px;
  }
`

export default function OuraSection({ token }) {
  const [activityData, setActivityData] = useState([])
  const [readinessData, setReadinessData] = useState([])
  const [sleepData, setSleepData] = useState([])
  const [loadingActivity, setLoadingActivity] = useState(true)
  const [loadingReadiness, setLoadingReadiness] = useState(true)
  const [loadingSleep, setLoadingSleep] = useState(true)

  useEffect(() => {
    if (!token) return

    fetch('http://localhost:8000/oura/activity', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setActivityData([...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoadingActivity(false)
      })
      .catch(() => setLoadingActivity(false))

    fetch('http://localhost:8000/oura/readiness', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setReadinessData([...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoadingReadiness(false)
      })
      .catch(() => setReadinessData(false))

    fetch('http://localhost:8000/oura/sleep', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setSleepData([...data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoadingSleep(false)
      })
      .catch(() => setLoadingSleep(false))

  }, [token])

  return (
    <>
      <style>{styles}</style>
      <div className="oura-section">
        <div className="oura-plots-row">
          <TrendPlot
            title="activity"
            data={activityData}
            loading={loadingActivity}
            color={COLORS.activity}
            gradientId="ouraActivity"
            exclude={EXCLUDE}
          />
          <TrendPlot
            title="readiness"
            data={readinessData}
            loading={loadingReadiness}
            color={COLORS.readiness}
            gradientId="ouraReadiness"
            exclude={EXCLUDE}
          />
          <TrendPlot
            title="sleep"
            data={sleepData}
            loading={loadingSleep}
            color={COLORS.sleep}
            gradientId="ouraSleep"
            exclude={EXCLUDE}
          />
        </div>
      </div>
    </>
  )
}