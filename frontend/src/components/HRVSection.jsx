import { useState, useEffect } from 'react'
import TrendPlot from './TrendPlot'

const BURGUNDY = '#7b2d8b'
const EXCLUDE = ['id', 'user_id', 'timestamp', 'date']

const styles = `
  .hrv-section {
    max-width: 80%;
  }

  .hrv-plots-row {
    display: flex;
    gap: 12px;
  }
`

function addDateCol(data) {
  return data.map(row => ({
    ...row,
    date: new Date(row.timestamp).toISOString().split('T')[0]
  }))
}

export default function HRVSection({ token }) {
  const [data5min, setData5min] = useState([])
  const [data12min, setData12min] = useState([])
  const [loading5min, setLoading5min] = useState(true)
  const [loading12min, setLoading12min] = useState(true)

  useEffect(() => {
    if (!token) return

    fetch('http://localhost:8000/hrv/5min', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const processed = addDateCol(data).sort((a, b) => new Date(a.date) - new Date(b.date))
        setData5min(processed)
        setLoading5min(false)
      })
      .catch(() => setLoading5min(false))

    fetch('http://localhost:8000/hrv/12min', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const processed = addDateCol(data).sort((a, b) => new Date(a.date) - new Date(b.date))
        setData12min(processed)
        setLoading12min(false)
      })
      .catch(() => setLoading12min(false))

  }, [token])

  return (
    <>
      <style>{styles}</style>
      <div className="hrv-section">
        <div className="hrv-plots-row">
          <TrendPlot
            title="HRV — 5 min"
            data={data5min}
            loading={loading5min}
            color={BURGUNDY}
            gradientId="hrv5min"
            exclude={EXCLUDE}
          />
          <TrendPlot
            title="HRV — 12 min"
            data={data12min}
            loading={loading12min}
            color={BURGUNDY}
            gradientId="hrv12min"
            exclude={EXCLUDE}
          />
        </div>
      </div>
    </>
  )
}