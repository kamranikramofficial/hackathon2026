import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, FileText, Settings, LogOut, Pill, Brain, BarChart3, X, Heart, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = {
        Admin: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
            { name: 'Profile', icon: UserCircle, path: '/profile' },
        ],
        Doctor: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/doctor' },
            { name: 'Profile', icon: UserCircle, path: '/profile' },
        ],
        Receptionist: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/receptionist' },
            { name: 'Profile', icon: UserCircle, path: '/profile' },
        ],
        Patient: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/patient' },
            { name: 'Profile', icon: UserCircle, path: '/profile' },
        ],
    };

    const links = user ? (menuItems[user.role] || []) : [];

    const roleColors = {
        Admin: { bg: 'from-purple-600 to-indigo-600', accent: 'text-purple-600', activeBg: 'bg-purple-50 text-purple-700', ring: 'ring-purple-200' },
        Doctor: { bg: 'from-indigo-600 to-purple-600', accent: 'text-indigo-600', activeBg: 'bg-indigo-50 text-indigo-700', ring: 'ring-indigo-200' },
        Receptionist: { bg: 'from-green-600 to-emerald-600', accent: 'text-green-600', activeBg: 'bg-green-50 text-green-700', ring: 'ring-green-200' },
        Patient: { bg: 'from-teal-600 to-green-600', accent: 'text-teal-600', activeBg: 'bg-teal-50 text-teal-700', ring: 'ring-teal-200' },
    };

    const colors = roleColors[user?.role] || roleColors.Admin;

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-6 bg-white border-r border-slate-200 shadow-sm">
            {/* Logo + close button */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                        AC
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">AI Clinic Pro</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-100 lg:hidden"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Role badge */}
            <div className="px-3 mb-6">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors.activeBg}`}>
                    {user?.role}
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <ul className="space-y-1">
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                end
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? `${colors.activeBg} font-semibold`
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User info + logout */}
            <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center px-3 mb-4">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-sm mr-3`}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
