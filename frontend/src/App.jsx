import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerPortal from './pages/CustomerPortal'
import AdminPortal from './pages/AdminPortal'
import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/customer/*" element={<CustomerPortal />} />
      <Route path="/admin/*" element={<AdminPortal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
