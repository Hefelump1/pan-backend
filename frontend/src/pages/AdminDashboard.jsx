import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Users, Building2, BookOpen, LogOut, Plus, 
  CheckCircle, XCircle, Clock, TrendingUp, Newspaper, UsersRound, Home, ClipboardList,
  Settings, Key, X, Eye, EyeOff, FileText
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ events: 0, bookings: 0, pendingBookings: 0, committee: 0, groups: 0, news: 0, activities: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [eventsRes, bookingsRes, committeeRes, groupsRes, newsRes, activitiesRes] = await Promise.allSettled([
        axios.get(`${BACKEND_URL}/api/events`),
        axios.get(`${BACKEND_URL}/api/bookings`, config),
        axios.get(`${BACKEND_URL}/api/committee`),
        axios.get(`${BACKEND_URL}/api/groups`),
        axios.get(`${BACKEND_URL}/api/news`),
        axios.get(`${BACKEND_URL}/api/activities`)
      ]);

      const getData = (result) => result.status === 'fulfilled' ? result.value.data : [];
      const bookingsData = getData(bookingsRes);
      const pendingCount = Array.isArray(bookingsData) ? bookingsData.filter(b => b.status === 'pending').length : 0;

      setStats({
        events: getData(eventsRes).length || 0,
        bookings: bookingsData.length || 0,
        pendingBookings: pendingCount,
        committee: getData(committeeRes).length || 0,
        groups: getData(groupsRes).length || 0,
        news: getData(newsRes).length || 0,
        activities: getData(activitiesRes).length || 0
      });

      setRecentBookings(Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${BACKEND_URL}/api/auth/change-password`, {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Polish Association of Newcastle - Content Management</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  data-testid="settings-btn"
                >
                  <Settings size={18} className="mr-2" />
                  Settings
                </button>
                {showSettingsMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSettingsMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <button
                        onClick={() => {
                          setShowSettingsMenu(false);
                          setShowPasswordModal(true);
                        }}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        data-testid="change-password-btn"
                      >
                        <Key size={16} className="mr-3 text-gray-500" />
                        Change Password
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                data-testid="logout-btn"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Newspaper size={24} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.news}</p>
            <p className="text-gray-600 text-sm mt-1">News Articles</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Calendar size={24} className="text-red-600" />
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
            <p className="text-gray-600 text-sm mt-1">Events</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Clock size={24} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
            <p className="text-gray-600 text-sm mt-1">Booking Requests</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <ClipboardList size={24} className="text-orange-600" />
              <span className="text-sm font-medium text-gray-500">Weekly</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activities}</p>
            <p className="text-gray-600 text-sm mt-1">Activities</p>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/homepage"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-homepage-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Home size={24} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Home Page</h3>
              <p className="text-sm text-gray-600">Edit hero & welcome content</p>
            </Link>

            <Link
              to="/admin/hallhire"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-hallhire-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                  <Building2 size={24} className="text-cyan-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Hall Hire Images</h3>
              <p className="text-sm text-gray-600">Manage hall gallery photos</p>
            </Link>

            <Link
              to="/admin/documents"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-documents-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <FileText size={24} className="text-amber-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Governance Documents</h3>
              <p className="text-sm text-gray-600">Manage PDF & Word documents</p>
            </Link>

            <Link
              to="/admin/agm"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-agm-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                  <Calendar size={24} className="text-rose-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">AGM Notice</h3>
              <p className="text-sm text-gray-600">Edit AGM announcement</p>
            </Link>

            <Link
              to="/admin/activities"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-activities-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <ClipboardList size={24} className="text-orange-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Weekly Activities</h3>
              <p className="text-sm text-gray-600">{stats.activities} activities</p>
            </Link>

            <Link
              to="/admin/news"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-news-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Newspaper size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">News</h3>
              <p className="text-sm text-gray-600">{stats.news} articles</p>
            </Link>

            <Link
              to="/admin/events"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-events-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Calendar size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Events</h3>
              <p className="text-sm text-gray-600">{stats.events} events</p>
            </Link>

            <Link
              to="/admin/committee"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-committee-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Committee</h3>
              <p className="text-sm text-gray-600">{stats.committee} members</p>
            </Link>

            <Link
              to="/admin/groups"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              data-testid="manage-groups-link"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <UsersRound size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Groups</h3>
              <p className="text-sm text-gray-600">{stats.groups} groups</p>
            </Link>
          </div>
        </div>

        {/* Quick Actions & Recent Bookings */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/news"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Newspaper size={20} className="text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Add News Article</span>
                </div>
                <Plus size={20} className="text-gray-400" />
              </Link>
              <Link
                to="/admin/events"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Calendar size={20} className="text-red-600 mr-3" />
                  <span className="font-medium text-gray-900">Add Event</span>
                </div>
                <Plus size={20} className="text-gray-400" />
              </Link>
              <Link
                to="/admin/bookings"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Building2 size={20} className="text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Review Bookings</span>
                </div>
                {stats.pendingBookings > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {stats.pendingBookings}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">{booking.event_type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{booking.guests} guests</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/admin/bookings"
              className="block mt-4 text-center text-red-600 hover:text-red-700 font-medium"
            >
              View All Bookings →
            </Link>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter current password"
                    data-testid="current-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter new password (min 6 characters)"
                    data-testid="new-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  data-testid="confirm-password-input"
                />
              </div>

              {passwordForm.new_password && passwordForm.confirm_password && 
               passwordForm.new_password !== passwordForm.confirm_password && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword || passwordForm.new_password !== passwordForm.confirm_password}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="submit-password-change"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
