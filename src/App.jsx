import { Routes , Route } from "react-router-dom";
import Login from "./components/Login";
import Dashbourd from "./components/Dashbourd";
import Register from "./components/Register";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";
import Boxes from "./pages/boxes";
import Class from "./pages/classes";
import Attendence from "./pages/Attendence";
import ReadAttendence from "./pages/ReadAttendence";
import ProtectedRoute from "./components/ProtectedRoute";
import DashbourdTeachers from "./components/DashbourdTeachers";
import Period from "./pages/Period";
import Finance from "./pages/Finance";
import Header from "./components/Header";
import FinanceRead from "./pages/FinanceRead";

const App = () =>{
  return <>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/DashbourdTeachers" element={<DashbourdTeachers />} />
        <Route path="/header" element={<Header />} />

        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashbourd />
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute>
            <Student />
          </ProtectedRoute>
        } />
        <Route path="/teacher" element={
          <ProtectedRoute>
            <Teacher />
          </ProtectedRoute>
        } />
        <Route path="/boxes" element={
          <ProtectedRoute>
            <Boxes />
          </ProtectedRoute>
        } />
        <Route path="/class" element={
          <ProtectedRoute>
            <Class />
          </ProtectedRoute>
        } />
     
        <Route path="/Attendence" element={
          <ProtectedRoute>
            <Attendence/>
          </ProtectedRoute>
        } />
        <Route path="/ReadAttendence" element={
          <ProtectedRoute>
            <ReadAttendence/>
          </ProtectedRoute>
        } />
        <Route path="/period" element={
          <ProtectedRoute>
            <Period />
          </ProtectedRoute>
        } />
        <Route path="/finance" element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        } />
        <Route path="/FinanceRead" element={
          <ProtectedRoute>
            <FinanceRead />
          </ProtectedRoute>
        } />
      </Routes> 
  </>
}

export default App;