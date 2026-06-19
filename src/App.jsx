import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BaarHome from '../baar-home.jsx'
import WorkPage from '../baar-work-page.jsx'
import ShopPage from '../baar-shop-page.jsx'
import ResourcePage from '../baar-resource-page.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaarHome />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/resources" element={<ResourcePage />} />
      </Routes>
    </BrowserRouter>
  )
}
