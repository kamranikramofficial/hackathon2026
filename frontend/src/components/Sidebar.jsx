import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, FileText, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = {
        Admin: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
            { name: 'Doctors', icon: Users, path: '/admin/doctors' },
            { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ],
        Doctor: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/doctor' },
            { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
            { name: 'Patients', icon: Users, path: '/doctor/patients' },
            { name: 'AI Symptom Checker', icon: Activity, path: '/doctor/ai-check' },
        ],
        Receptionist: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/receptionist' },
            { name: 'Appointments', icon: Calendar, path: '/receptionist/appointments' },
            { name: 'Patients', icon: Users, path: '/receptionist/patients' },
        ],
        Patient: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/patient' },
            { name: 'My History', icon: FileText, path: '/patient/history' },
        ],
    };

    const links = user ? menuItems[user.role] : [];

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
            <h2 className="text-2xl font-bold text-center text-primary mb-10">AI Clinic</h2>

            <div className="flex-1">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-xl transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-gray-500 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-4 border-t">
                <div className="flex items-center px-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl mr-3">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
