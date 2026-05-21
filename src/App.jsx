import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import CassaPage from './pages/CassaPage'
import KDSPage from './pages/KDSPage'
import BarPage from './pages/BarPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: '#1a1a2e',
        alignItems: 'center'
      }}>
        <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem', marginRight: '1rem' }}>
          🍽️ POS System
        </span>
        {[
          { to: '/',      label: '🧾 Cassa' },
          { to: '/cucina', label: '🍳 Cucina' },
          { to: '/bar',   label: '☕ Bar' },
          { to: '/admin', label: '⚙️ Admin' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              background: isActive ? '#e94560' : '#16213e',
              color: isActive ? '#fff' : '#aab',
              transition: 'all 0.2s'
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/"       element={<CassaPage />} />
        <Route path="/cucina" element={<KDSPage />} />
        <Route path="/bar"    element={<BarPage />} />
        <Route path="/admin"  element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}