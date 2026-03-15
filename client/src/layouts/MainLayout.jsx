import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components/common/index.js'

function MainLayout() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1  ">
        <Outlet />
      </main>
      <Footer />
    </div>

  )
}

export default MainLayout
