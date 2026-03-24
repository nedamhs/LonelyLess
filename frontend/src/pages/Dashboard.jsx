import { useState, useEffect } from 'react'
import EMASection from '../components/EMASection'
import OuraSection from '../components/OuraSection'
import HRVSection from '../components/HRVSection'
import AWARESection from '../components/AwareSection'


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
    margin-bottom: 48px;
    width: fit-content;
  }

  .score-card {
    width: 210px;
    height: 140px;
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


`

export default function Dashboard() {
  const raw = sessionStorage.getItem('participant') || ''
  const participant = raw.replace('pers', '') /* only keep number */
  const token = window._authToken || sessionStorage.getItem('token')

  const [means, setMeans] = useState({ lonely: null, isolated: null, connected: null ,  days: null})   /* initialized to null */

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/ema/daily', {     /* calling ema daily api endpoints w jwt token in header to get response*/ 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())   /*  unwraps raw response and parses the JSON */
      .then(data => {
        const avg = (key) => {     /* avg function */ 
          const vals = data.map(d => d[key]).filter(v => v !== null && v !== undefined)
          if (!vals.length) return null
          return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
        }
        setMeans({
          lonely: avg('feel_lonely'),
          isolated: avg('feel_isolated'),
          connected: avg('feel_connected'),
          days: data.filter(d => d['feel_lonely'] !== null && d['feel_lonely'] !== undefined).length
        })
      })
  }, [token])

  return (
    <>
      <style>{styles}</style>  {/* css stuff */}

      <div className="dash-root">

            <div className="brand">     {/* logo */}
                  <span className="brand-name">Lonely<span className="brand-green">Less</span></span>
            </div>

            <div className="dash-content">   {/* dashboard */}
                   <h1 className="welcome">Hello, participant <span>{participant}</span>!</h1>
                   <p className="subtitle">Here is your personalized summary</p>

                   <p className="section-label">Summary</p>   {/* section header */}
                   <div className="cards-row">     {/* avg ema cards */}
                          <div className="score-card">     {/* avg loneliness */}
                            <div className="card-label">Mean Loneliness</div>
                            <div className={`card-score ${means.lonely === null ? 'card-score-loading' : ''}`}>
                              {means.lonely ?? '—'}
                            </div>
                            <div className="card-days">across {means.days} days</div>
                          </div>

                          <div className="score-card">    {/* avg isolation */}
                            <div className="card-label">Mean Isolation</div>
                            <div className={`card-score ${means.isolated === null ? 'card-score-loading' : ''}`}>
                              {means.isolated ?? '—'}
                            </div>
                            <div className="card-days">across {means.days} days</div>
                          </div>

                          <div className="score-card">    {/* avg connection */}
                            <div className="card-label">Mean Connection</div>
                            <div className={`card-score ${means.connected === null ? 'card-score-loading' : ''}`}>
                              {means.connected ?? '—'}
                            </div>
                            <div className="card-days">across {means.days} days</div>
                          </div>
                  </div>

                  <hr className="section-divider" />
                  <p className="section-label">Ecological Momentary Assessment (EMA)</p>
                  <EMASection token={token} />
                

                  <hr className="section-divider" />
                  <p className="section-label">Oura Ring</p>
                  <OuraSection token={token} />

                  <hr className="section-divider" />
                  <p className="section-label">HRV</p>
                  <HRVSection token={token} />

                  <hr className="section-divider" />
                  <p className="section-label">AWARE</p>
                  <AWARESection token={token} />

            </div>

      </div>
    </>
  )
}