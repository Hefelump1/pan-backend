import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${BACKEND_URL}/api/bookings/${bookingId}/status`,
        null,
        {
          params: { status: newStatus },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`Booking ${newStatus}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="text-gray-600">Review and manage hall booking requests</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === status
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'pending' && bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-white text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{booking.name}</h3>
                    <p className="text-gray-600">{booking.email}</p>
                    <p className="text-gray-600">{booking.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Event Type</p>
                    <p className="text-gray-900">{booking.event_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Number of Guests</p>
                    <p className="text-gray-900">{booking.guests} people</p>
                  </div>
                  {booking.date && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Preferred Date</p>
                      <p className="text-gray-900">{new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Submitted</p>
                    <p className="text-gray-900">{new Date(booking.created_at).toLocaleDateString('en-AU')}</p>
                  </div>
                </div>

                {booking.message && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Message</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{booking.message}</p>
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'approved')}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircle size={20} className="mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'rejected')}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <XCircle size={20} className="mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
