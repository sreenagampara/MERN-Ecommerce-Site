import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'


function Layout() {
  return (
    <div>
      <ScrollToTop/>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}

export default Layout
