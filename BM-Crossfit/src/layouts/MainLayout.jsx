import "./MainLayout.css"
import Navbar from "../components/Navbar/Navbar"
import Table from "../components/Table/Table"
import Footer from "../components/footer/Footer"

function MainLayout() {
  return (
    <div>
        <Navbar/>
        <div className="content">
        <Table/>
        </div>
        <Footer/>
    </div>
  )
}

export default MainLayout