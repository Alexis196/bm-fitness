import "./MainLayout.css"
import Navbar from "../components/Navbar/Navbar"
import Table from "../components/Table/Table"
import Functions from '../components/Functions/Functions'

function MainLayout() {
  return (
    <div>
        <Navbar/>
        <div className="content">
            <Functions/>
            <Table/>
        </div>
    </div>
  )
}

export default MainLayout