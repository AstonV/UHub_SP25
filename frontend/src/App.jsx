import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import AdminDashboard from "./Pages/AdminDashboard.jsx";
import Login from "./Pages/Login.jsx";
import Project from "./Pages/Project.jsx";
import MainLayout from "@/layout/MainLayout.jsx";
import Tasks from "@/Pages/Tasks.jsx";
import User from "@/Pages/User.jsx";
import UserProfile from "@/Pages/UserProfile.jsx";
import Community from "@/Pages/Community.jsx";
import UserProject from "@/Pages/UserProject.jsx";
import LandingPage from "@/Pages/LandingPage.jsx";
import AdminDashboard from "@/Pages/AdminDashboard.jsx";
import Register from "@/Pages/Register.jsx";
import About from "@/components/AboutComponent.jsx";
import ContactUs from "@/components/ContactUsComponent.jsx";
import Calender from "@/Pages/Calender.jsx";
import ProjectCommunity from "@/Pages/ProjectCommunity.jsx";

const App = () => {
    return (
        <>
            <BrowserRouter>

                <Routes>
                    {/*<Route path="/admin" element={<AdminDashboard />} />*/}
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/admin-dashboard" element={<MainLayout><AdminDashboard/></MainLayout>}/>
                    <Route path="/projects" element={<MainLayout><Project/></MainLayout>}/>
                    <Route path="/dashboard" element={<MainLayout><UserProject/></MainLayout>}/>
                    <Route path="/tasks" element={<MainLayout><Tasks/></MainLayout>}/>
                    <Route path="/users" element={<MainLayout><User/></MainLayout>}/>
                    <Route path="/community" element={<MainLayout><Community/></MainLayout>}/>
                    <Route path="/profile" element={<MainLayout><UserProfile/></MainLayout>}/>
                    <Route path="/calender" element={<MainLayout><Calender/></MainLayout>}/>
                    <Route path="/project-chat" element={<MainLayout><ProjectCommunity/></MainLayout>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App
