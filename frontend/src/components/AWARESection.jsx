import { useState, useEffect } from 'react'
import TrendPlot from './TrendPlot'
 
const PINK = '#e86b9a'
 
const CATEGORIES = {
  calls:         f => f.startsWith('call_'),
  notifications: f => f.startsWith('notif_'),
  messages:      f => f.startsWith('mess_'),
  battery:       f => f.startsWith('batt_'),
  touch:         f => f.startsWith('touch_'),
  screen:        f => f.startsWith('screen_'),
  usage:         f => f.startsWith('usage_'),
  location:      f => f.startsWith('loc_'),
}
 
const EXCLUDE = new Set(['id', 'user_id', 'timestamp'])
 
const styles = `
  .aware-section {
    max-width: 80%;
  }
 
  .aware-plot-card {
    background: rgba(255, 255, 255, 0.65);
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 14px;
    padding: 14px 16px 10px;
  }
 
  .aware-plot-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
 
  .aware-plot-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--purple-dark, #6b4fa0);
  }
 
  .aware-select {
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark, #3d2d6b);
    background: #eeedfe;
    border: 0.5px solid var(--purple-border, #9b84cc);
    border-radius: 6px;
    padding: 3px 8px;
    cursor: pointer;
    outline: none;
    max-width: 160px;
  }
 
  .aware-select:focus {
    border-color: var(--purple-mid, #8b6fc0);
  }
 
  .aware-loading {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-light, #a89cc8);
  }
`

// add date col 
function addDateCol(data) {
  return data.map(row => ({
    ...row,
    date: new Date(row.timestamp).toISOString().split('T')[0]
  }))
}

export default function AWARESection({ token }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('calls')
  const [allFeatures, setAllFeatures] = useState([])

  // get aware feuturees 
  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/aware/features', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(raw => {
        const processed = addDateCol(raw).sort((a, b) => new Date(a.date) - new Date(b.date))
        setData(processed)
        if (processed.length) {
          const features = Object.keys(processed[0]).filter(k => !EXCLUDE.has(k) && k !== 'date')
          setAllFeatures(features)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  // chose which aare modality to look at (call, notif, message, etc. )
  const categoryDropdown = (
    <select
      className="trend-select"
      value={selectedCategory}
      onChange={e => setSelectedCategory(e.target.value)}
    >
      {Object.keys(CATEGORIES).map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="aware-section">
        {/* trend plot for aware feutures */}
        <TrendPlot
                title="phone features"
                data={data}
                loading={loading}
                color={PINK}
                gradientId="aware"
                exclude={[...EXCLUDE, ...allFeatures.filter(f => !CATEGORIES[selectedCategory]?.(f)), 'date']}
                extraDropdown={categoryDropdown}
        />
      </div>
    </>
  )
}