import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Users, Building2, BookOpen, LogOut, Plus, 
  CheckCircle, XCircle, Clock, TrendingUp 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ events: 0, bookings: 0, pendingBookings: 0, committee: 0, groups: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const [eventsRes, bookingsRes, committeeRes, groupsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/events`),
        axios.get(`${BACKEND_URL}/api/bookings`, config),
        axios.get(`${BACKEND_URL}/api/committee`),
        axios.get(`${BACKEND_URL}/api/groups`)
      ]);

      const pendingCount = bookingsRes.data.filter(b => b.status === 'pending').length;

      setStats({
        events: eventsRes.data.length,
        bookings: bookingsRes.data.length,
        pendingBookings: pendingCount,
        committee: committeeRes.data.length,
        groups: groupsRes.data.length
      });

      setRecentBookings(bookingsRes.data.slice(0, 5));
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Polish Association of Newcastle</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Building2 size={24} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-500">All Time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
            <p className="text-gray-600 text-sm mt-1">Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Clock size={24} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
            <p className="text-gray-600 text-sm mt-1">Awaiting Review</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Users size={24} className="text-green-600" />
              <span className="text-sm font-medium text-gray-500">Active</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.committee + stats.groups}</p>
            <p className="text-gray-600 text-sm mt-1">Committee & Groups</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/events"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Calendar size={20} className="text-red-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Events</span>
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
              <Link
                to="/admin/committee"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Users size={20} className="text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Committee</span>
                </div>
                <Plus size={20} className="text-gray-400" />
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
    </div>
  );
};
