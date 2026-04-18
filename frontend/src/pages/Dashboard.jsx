import { useState, useEffect } from 'react'

import EMASection from '../components/EMASection'
import OuraSection from '../components/OuraSection'
import HRVSection from '../components/HRVSection'
import AWARESection from '../components/AwareSection'

import Calendar from '../components/Calendar'

import { useNavigate } from 'react-router-dom'

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
    --pistachio-dark: #72a352;
    --card-bg: #f5f1fc;
    --text-dark: #3d2d6b;
    --text-mid: #7a6a9a;
    --text-light: #a89cc8;
  }

  .dash-root {
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

  .brand-green {
  color: var(--pistachio);
 }

  .dash-content {
    padding: 130px 40px 60px;
  }

  .welcome {
    font-size: 26px;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 6px;
  }

  .welcome span {
    color: var(--purple-dark);
  }

  .subtitle {
    font-size: 20px;
    color: var(--text-mid);
    font-weight: 400;
    margin-bottom: 40px;
  }

  .cards-row {
    display: flex;
    gap: 20px;
    margin-bottom: 0px;
    width: fit-content;
    margin-top: auto;
  }

  .score-card {
    width: 220px;
    height: 160px;
    background: var(--card-bg);
    border: 1.5px solid var(--purple-border);
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(114, 163, 82, 0.55), 0 2px 6px rgba(107, 79, 160, 0.08);
    animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .score-card:nth-child(2) { animation-delay: 0.08s; }
  .score-card:nth-child(3) { animation-delay: 0.16s; }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .card-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--purple-dark);
  margin-bottom: 16px;
  letter-spacing: 0.1px;
}

  .card-score {
  font-size: 36px;
  font-weight: 600;
  color: var(--purple-dark);
  letter-spacing: -1px;
  line-height: 1;
}

  .card-score-loading {
    font-size: 32px;
    color: var(--text-light);
  }

  .card-days {
  font-size: 15px;
  color: var(--text-mid);
  font-weight: 400;
  margin-top: 4px;
}

 .card-stats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--text-light);
  font-weight: 400;
  margin-top: 4px;
}

 .section-label {
  font-size: 20px;
  font-weight: 500;
  color: var(--purple-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.section-divider {
  border: none;
  border-top: 0.5px solid var(--purple-border);
  opacity: 0.7;
  margin: 24px 0;
  width: 80%;     
}

.summary-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 0;
  height: 200px;
}


.left-summary {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;  /* push cards left, button right */
  gap: 8px;
  height: 100%;
  width: 100%;  /* make sure it stretches full width */
}

.compare-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  color: var(--purple-dark);
  background: #eeedfe;
  border: 0.5px solid var(--purple-border);
  border-radius: 7px;
  padding: 8px 50px;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--pistachio);
  display: inline-block;
}

.logout-btn {
  position: absolute;
  top: 42px;
  right: 50px;
  font-size: 12px;
  color: var(--purple-dark);
  background: #eeedfe;
  border: 0.5px solid var(--purple-border);
  border-radius: 6px;
  padding: 10px 15px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}

`

// handles logout from dashboard
const handleLogout = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('participant')
  window.location.href = '/'
}

export default function Dashboard()
{
  const raw = sessionStorage.getItem('participant') || ''
  const participant = raw.replace('pers', '') /* only keep number */
  const token = window._authToken || sessionStorage.getItem('token')

  const [means, setMeans] = useState({ lonely: null, isolated: null, connected: null ,  days: null})   /* initialized to null */

  const [emaData, setEmaData] = useState([])  /* store ema */ 

  const navigate = useNavigate()

  useEffect(() => {
  if (!token) return
  fetch('http://localhost:8000/ema/daily', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(data => {

      const avg = (key) => {
        const vals = data.map(d => d[key]).filter(v => v !== null && v !== undefined)
        if (!vals.length) return null
        return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
      }

      const std = (key) => {
        const vals = data.map(d => d[key]).filter(v => v !== null && v !== undefined)
        if (!vals.length) return null
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length
        return Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length).toFixed(1)
      }

      const min = (key) => {
        const vals = data.map(d => d[key]).filter(v => v !== null && v !== undefined)
        return vals.length ? Math.min(...vals).toFixed(1) : null
      }

      const max = (key) => {
        const vals = data.map(d => d[key]).filter(v => v !== null && v !== undefined)
        return vals.length ? Math.max(...vals).toFixed(1) : null
      }

      setMeans({
        lonely: avg('feel_lonely'),
        isolated: avg('feel_isolated'),
        connected: avg('feel_connected'),
        days: data.filter(d => d['feel_lonely'] !== null && d['feel_lonely'] !== undefined).length,
        lonelyMin: min('feel_lonely'), lonelyMax: max('feel_lonely'), lonelyStd: std('feel_lonely'),
        isolatedMin: min('feel_isolated'), isolatedMax: max('feel_isolated'), isolatedStd: std('feel_isolated'),
        connectedMin: min('feel_connected'), connectedMax: max('feel_connected'), connectedStd: std('feel_connected'),
      })
      setEmaData(data)
    })
}, [token])

  return (
    <>
      <style>{styles}</style>    {/* css stuff */}
      <div className="dash-root">

        <div className="brand">   {/* logo */}
          <span className="brand-name">Lonely<span className="brand-green">Less</span></span>
          {/* <p className="brand-sub">a mental health monitoring platform</p> */}
        </div>

        <button className="logout-btn" onClick={handleLogout}>logout</button>

        <div className="dash-content">     {/* dashboard */}

          <h1 className="welcome">Hello, participant <span>{participant}</span>!</h1>
          <p className="subtitle">Here is your personalized summary</p>

          <p className="section-label">Summary</p>     {/* section header */}

          <div className="summary-row">
          <div className="left-summary" style={{ width: '80%' }}>
            <div className="cards-row">
              <div className="score-card">
                <div className="card-label">Mean Loneliness</div>
                <div className={`card-score ${means.lonely === null ? 'card-score-loading' : ''}`}>
                  {means.lonely ?? '—'}
                </div>
                <div className="card-days">across {means.days ?? '—'} days</div>
                <div className="card-stats">
                  <span>min {means.lonelyMin ?? '—'}</span>
                  <span>max {means.lonelyMax ?? '—'}</span>
                  <span>std {means.lonelyStd ?? '—'}</span>
                </div>
              </div>

              <div className="score-card">
                <div className="card-label">Mean Isolation</div>
                <div className={`card-score ${means.isolated === null ? 'card-score-loading' : ''}`}>
                  {means.isolated ?? '—'}
                </div>
                <div className="card-days">across {means.days ?? '—'} days</div>
                <div className="card-stats">
                  <span>min {means.isolatedMin ?? '—'}</span>
                  <span>max {means.isolatedMax ?? '—'}</span>
                  <span>std {means.isolatedStd ?? '—'}</span>
                </div>
              </div>

              <div className="score-card">
                <div className="card-label">Mean Connection</div>
                <div className={`card-score ${means.connected === null ? 'card-score-loading' : ''}`}>
                  {means.connected ?? '—'}
                </div>
                <div className="card-days">across {means.days ?? '—'} days</div>
                <div className="card-stats">
                  <span>min {means.connectedMin ?? '—'}</span>
                  <span>max {means.connectedMax ?? '—'}</span>
                  <span>std {means.connectedStd ?? '—'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="compare-btn" onClick={() => navigate('/compare')}>
                      <span className="dot"></span> compare features
                </button>
            </div>
          </div>

            <Calendar data={emaData} />

        </div>

          <hr className="section-divider" style={{ width: '100%' }} />
          <p className="section-label">Ecological Momentary Assessment (EMA)</p>
          <EMASection token={token} />     {/* EMA Trend Plot */}

          <hr className="section-divider" />
          <p className="section-label">Oura Ring</p>
          <OuraSection token={token} />     {/* Oura Trend Plot */}

          <hr className="section-divider" />
          <p className="section-label">HRV</p>
          <HRVSection token={token} />       {/* HRV Trend Plot */}

          <hr className="section-divider" />
          <p className="section-label">AWARE</p>
          <AWARESection token={token} />       {/* AWARE Trend Plot */}

        </div>
      </div>
    </>
  )

}