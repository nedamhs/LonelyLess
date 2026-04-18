import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// cols to exclude across modalities
const EXCLUDE = new Set(['id', 'user_id', 'date', 'timestamp', 'surveyindex',
  'sleep_bedtime_start', 'sleep_bedtime_end'])

const MODALITIES = [
  { key: 'emaDaily',      label: 'EMA daily' },
  { key: 'emaWeekly',     label: 'EMA weekly' },
  { key: 'ouraActivity',  label: 'Oura activity' },
  { key: 'ouraReadiness', label: 'Oura readiness' },
  { key: 'ouraSleep',     label: 'Oura sleep' },
  { key: 'hrv5min',       label: 'HRV 5 min' },
  { key: 'hrv12min',      label: 'HRV 12 min' },
  { key: 'aware',         label: 'AWARE' },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --lavender-bg-1: #e8e0f5;
    --lavender-bg-2: #d4c8ee;
    --lavender-bg-3: #c4b5e8;
    --purple-dark: #6b4fa0;
    --purple-mid: #8b6fc0;
    --purple-border: #9b84cc;
    --pistachio: #8bbe6a;
    --card-bg: #f5f1fc;
    --text-dark: #3d2d6b;
    --text-mid: #7a6a9a;
    --text-light: #a89cc8;
  }

  .compare-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(ellipse at 20% 20%, var(--lavender-bg-3) 0%, var(--lavender-bg-2) 35%, var(--lavender-bg-1) 65%, #ede8f8 100%);
    position: relative;
  }

  .brand {
    position: absolute;
    top: 32px;
    left: 40px;
  }

  .brand-name {
    font-size: 52px;
    font-weight: 600;
    color: var(--text-dark);
    letter-spacing: -0.3px;
  }

  .brand-green { color: var(--pistachio); }

  .back-btn {
    position: absolute;
    top: 52px;
    right: 40px;
    font-size: 12px;
    color: var(--purple-dark);
    background: #eeedfe;
    border: 0.5px solid var(--purple-border);
    border-radius: 6px;
    padding: 5px 12px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .compare-content {
    padding: 130px 40px 60px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 6px;
  }

  .page-sub {
    font-size: 15px;
    color: var(--text-mid);
    margin-bottom: 36px;
  }

  .controls-row {
    display: flex;
    align-items: flex-end;
    gap: 125px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .control-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-dark);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .compare-select {
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark);
    background: rgba(255,255,255,0.75);
    border: 0.5px solid var(--purple-border);
    border-radius: 7px;
    padding: 8px 14px;
    cursor: pointer;
    outline: none;
    min-width: 180px;
  }

  .compare-select.f1 {
  border-color: #2ec4b6;
  background: rgba(255,255,255,0.75);
}

  .compare-select.f2 {
    border-color: #6b4fa0;
    background: rgba(255,255,255,0.75);
  }

  .compare-select:focus { border-color: var(--purple-dark); }

  .vs-label {
    font-size: 13px;
    color: var(--text-mid);
    padding-bottom: 7px;
  }

  .feature-pair {
    display: flex;
    align-items: flex-end;
    gap: 50px;
  }

  .loading-msg {
    font-size: 13px;
    color: var(--text-light);
    padding: 40px 0;
  }

  /* chart section */
  .chart-layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .chart-main {
    flex: 0 0 80%;
  }

  .chart-sidebar {
    flex: 0 0 20%;
  }

  .chart-card {
    background: rgba(255,255,255,0.7);
    border: 0.5px solid var(--purple-border);
    border-radius: 14px;
    padding: 16px 20px;
  }

  .chart-title {
    font-size: 12px;
    font-weight: 500;
    color: #534AB7;
    margin-bottom: 14px;
  }

  .chart-area {
    height: 300px;
  }

  .chart-legend {
    display: flex;
    gap: 16px;
    margin-top: 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-mid);
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* loneliness pairs card */
  .loneliness-card {
    background: rgba(255,255,255,0.7);
    border: 0.5px solid var(--purple-border);
    border-radius: 10px;
    padding: 12px 16px;
    width: 600px;
    margin-top: 24px;
  }

  .loneliness-card-title {
    font-size: 10px;
    font-weight: 500;
    color: var(--purple-mid);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .corr-divider {
    height: 0.5px;
    background: #e8e0f5;
    margin: 4px 0;
  }

  .corr-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
  }

  .corr-label {
    font-size: 12px;
    color: var(--text-mid);
  }

  .corr-stats {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .corr-r {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-dark);
  }

  .corr-p {
    font-size: 11px;
    color: #a89cc8;
  }

  .corr-sig {
    font-size: 10px;
    color: #8bbe6a;
  }
`
// convert unix time to date format 
function addDateCol(data) {
  return data.map(row => ({
    ...row,
    date: new Date(row.timestamp).toISOString().split('T')[0]
  }))
}

// exclude some cols 
function getFeatures(data) {
  if (!data.length) return []
  return Object.keys(data[0]).filter(k => !EXCLUDE.has(k) && k !== 'date')
}

// gives us a sorted union of all dates , w corresponding values for both feutures, null if a feuture has no data 
function alignData(data1, feat1, data2, feat2) {
  const map1 = {}
  data1.forEach(row => {
    if (row[feat1] !== null && row[feat1] !== undefined)
      map1[row.date] = parseFloat(row[feat1])
  })

  const map2 = {}
  data2.forEach(row => {
    if (row[feat2] !== null && row[feat2] !== undefined)
      map2[row.date] = parseFloat(row[feat2])
  })

  const allDates = [...new Set([...Object.keys(map1), ...Object.keys(map2)])].sort()

  return allDates.map(date => ({
    date,
    val1: map1[date] ?? null,
    val2: map2[date] ?? null,
  }))
}

  // computes the Pearson correlation coefficient between two arrays of numbers.
  function pearsonR(x, y) {
      const n = x.length
      if (n < 2) return null
      const mx = x.reduce((a, b) => a + b, 0) / n
      const my = y.reduce((a, b) => a + b, 0) / n
      const num = x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0)
      const den = Math.sqrt(
        x.reduce((sum, xi) => sum + (xi - mx) ** 2, 0) *
        y.reduce((sum, yi) => sum + (yi - my) ** 2, 0)
      )
      return den === 0 ? null : num / den
    }

  // estimates the p-value from the correlation and sample size,
  function pValue(r, n) {
      if (r === null || n < 3) return null
      const t = r * Math.sqrt((n - 2) / (1 - r * r))
      const x = (n - 2) / ((n - 2) + t * t)
      // beta incomplete function approximation
      let betai = 0
      for (let i = 0; i < 200; i++) {
        betai += Math.pow(x, i) * (1 - x) / (i + (n - 2) / 2)
      }
      return Math.min(1, Math.abs(betai))
    }

  // filters out rows where either feature is null, then computes r and p-value for that specific pair of columns.
  function computePair(data, key1, key2) {
      const paired = data.filter(r =>
        r[key1] !== null && r[key1] !== undefined &&
        r[key2] !== null && r[key2] !== undefined
      )
      const x = paired.map(r => parseFloat(r[key1]))
      const y = paired.map(r => parseFloat(r[key2]))
      const r = pearsonR(x, y)
      const p = pValue(r, paired.length)
      return { r, p, n: paired.length }
    }

export default function Compare()
{
  const navigate = useNavigate()  
  const token = window._authToken || sessionStorage.getItem('token') // auth

  //  holds all fetched datasets, one array per modality, initially empty
  const [allData, setAllData] = useState({
    emaDaily: [], emaWeekly: [],
    ouraActivity: [], ouraReadiness: [], ouraSleep: [],
    hrv5min: [], hrv12min: [],
    aware: []
  })

  const [loading, setLoading] = useState(true) //data loading 
  const [mod1, setMod1] = useState('emaDaily')   //selected modlity 1 
  const [mod2, setMod2] = useState('emaDaily')   //selected modlity 2
  const [feat1, setFeat1] = useState('')     //selected feat 1 
  const [feat2, setFeat2] = useState('')     //selected feat 2

  // Fetches all 8 datasets in parallel, sorts them, and loads them into state.
  useEffect(() => {
    if (!token) return
    const h = { Authorization: `Bearer ${token}` }
    const sort = (data) => [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
    const sortTs = (data) => addDateCol([...data].sort((a, b) => a.timestamp - b.timestamp))

    Promise.all([
      fetch('http://localhost:8000/ema/daily', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/ema/weekly', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/oura/activity', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/oura/readiness', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/oura/sleep', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/hrv/5min', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/hrv/12min', { headers: h }).then(r => r.json()),
      fetch('http://localhost:8000/aware/features', { headers: h }).then(r => r.json()),
    ]).then(([ed, ew, oa, or_, os, h5, h12, aw]) => {
      setAllData({
        emaDaily:      sort(ed),
        emaWeekly:     sort(ew),
        ouraActivity:  sort(oa),
        ouraReadiness: sort(or_),
        ouraSleep:     sort(os),
        hrv5min:       sortTs(h5),
        hrv12min:      sortTs(h12),
        aware:         sortTs(aw),
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [token])

  // set default features when data loads
    useEffect(() => {
    const features1 = getFeatures(allData[mod1])
    if (features1.length) {
      const def = features1.includes('feel_lonely') ? 'feel_lonely' : features1[0]
      setFeat1(def)
    }
  }, [mod1, allData])

  useEffect(() => {
    const features2 = getFeatures(allData[mod2])
    if (features2.length) {
      const def = features2.includes('feel_isolated') ? 'feel_isolated' : features2[0]
      setFeat2(def)
    }
  }, [mod2, allData])

  // get feutures for selected modalities 
  const features1 = getFeatures(allData[mod1])
  const features2 = getFeatures(allData[mod2])

  // Builds a shared date axis for both selected features, cached until the user changes a dropdown.
  const alignedData = useMemo(() => {
      if (!feat1 || !feat2) return []
      return alignData(allData[mod1], feat1, allData[mod2], feat2)
    }, [mod1, mod2, feat1, feat2, allData])


  // computes the 3 pairwise correlations between the loneliness labels.
  const lonelinessPairs = useMemo(() => {
    const d = allData.emaDaily
    if (!d.length) return null
    return {
      lonIso: computePair(d, 'feel_lonely', 'feel_isolated'),
      lonCon: computePair(d, 'feel_lonely', 'feel_connected'),
      isoCon: computePair(d, 'feel_isolated', 'feel_connected'),
    }
  }, [allData.emaDaily])


  return (
    <>
      <style>{styles}</style>   
      <div className="compare-root">    

              <div className="brand">    {/* logo */}
                <span className="brand-name">Lonely<span className="brand-green">Less</span></span>
              </div>

              {/* back button */}
              <button className="back-btn" onClick={() => navigate('/dashboard')}>
                ← back to dashboard
              </button>

              <div className="compare-content">
                    <p className="page-title">feature comparison</p>
                    <p className="page-sub">compare two features across any modality and explore their correlation</p>

                    {/* 2 drop downs for item 1 */}
                    {loading ? (
                      <p className="loading-msg">loading data...</p>
                    ) : (
                      <div className="controls-row">
                        <div className="feature-pair">
                          <div className="control-group">
                            <label className="control-label">modality 1</label>
                            <select
                              className="compare-select f1"
                              value={mod1}
                              onChange={e => setMod1(e.target.value)}
                            >
                              {MODALITIES.map(m => (
                                <option key={m.key} value={m.key}>{m.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="control-group">
                            <label className="control-label">feature 1</label>
                            <select
                              className="compare-select f1"
                              value={feat1}
                              onChange={e => setFeat1(e.target.value)}
                            >
                              {features1.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="vs-label">vs</div>

                        {/* 2 drop downs for item 2 */}
                        <div className="feature-pair">
                          <div className="control-group">
                            <label className="control-label">modality 2</label>
                            <select
                              className="compare-select f2"
                              value={mod2}
                              onChange={e => setMod2(e.target.value)}
                            >
                              {MODALITIES.map(m => (
                                <option key={m.key} value={m.key}>{m.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="control-group">
                            <label className="control-label">feature 2</label>
                            <select
                              className="compare-select f2"
                              value={feat2}
                              onChange={e => setFeat2(e.target.value)}
                            >
                              {features2.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                        {/* trend plot */}
                        {alignedData.length > 0 && (
                        <div className="chart-layout">
                          <div className="chart-main">
                            <div className="chart-card">
                              <p className="chart-title">
                                {feat1} vs {feat2}
                              </p>
                              <div className="chart-area">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={alignedData} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2ec4b6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2ec4b6" stopOpacity={0} />
                                      </linearGradient>
                                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6b4fa0" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6b4fa0" stopOpacity={0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="rgba(155,132,204,0.12)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a89cc8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#a89cc8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={28} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="val1" stroke="#2ec4b6" strokeWidth={2} fill="url(#grad1)" dot={false} connectNulls={false} name={feat1} />
                                    <Area type="monotone" dataKey="val2" stroke="#6b4fa0" strokeWidth={2} fill="url(#grad2)" dot={false} connectNulls={false} name={feat2} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="chart-legend">
                                <div className="legend-item">
                                  <div className="legend-dot" style={{ background: '#2ec4b6' }} />
                                  {feat1}
                                </div>
                                <div className="legend-item">
                                  <div className="legend-dot" style={{ background: '#6b4fa0' }} />
                                  {feat2}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="chart-sidebar">
                            {/* stats cards here later for showing corr of selected feautures */}
                          </div>
                        </div>
                      )}

                 {/* corr and p-values for the three loneliness label pairs */}
                  {lonelinessPairs && (
                    <div className="loneliness-card">
                      <p className="loneliness-card-title">loneliness labels</p>

                      {[
                        { label: 'lonely ↔ isolated', data: lonelinessPairs.lonIso },
                        { label: 'lonely ↔ connected', data: lonelinessPairs.lonCon },
                        { label: 'isolated ↔ connected', data: lonelinessPairs.isoCon },
                      ].map(({ label, data }, i) => (
                        <div key={i}>
                          {i > 0 && <div className="corr-divider" />}
                          <div className="corr-row">
                            <span className="corr-label">{label}</span>
                            <div className="corr-stats">
                              <span className="corr-r">
                                r = {data.r?.toFixed(2) ?? '—'}
                              </span>
                              <span className="corr-p">
                                p = {data.p < 0.001 ? '< 0.001' : data.p?.toFixed(3) ?? '—'}
                              </span>
                              <span className="corr-sig">
                                {data.p < 0.05 ? '✓ significant' : '✗ not significant'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

              </div>

      </div>
    </>
  )
}