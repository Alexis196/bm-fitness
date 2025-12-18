import "./MainLayout.css"
import Navbar from "../components/Navbar/Navbar"
import Table from "../components/Table/Table"

function MainLayout() {
  return (
    <div>
        <Navbar/>
        <div className="content">
            <Table/>
        </div>
    </div>
  )
}

export default MainLayout