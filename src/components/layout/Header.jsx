import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  IndianRupee,
  GraduationCap,
  X,
  ExternalLink,
} from 'lucide-react';
import { mockStore } from '../../data/store';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Filter students on query change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = mockStore.students
      .filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q) ||
          s.phone.includes(q)
      )
      .slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Fee Payment Received',
      desc: '₹5,000 logged via UPI for Aarav Sharma (Jr. KG - A)',
      time: '15m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Attendance Incomplete',
      desc: 'Nursery B register not yet submitted for today.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'New Admission Enrolled',
      desc: 'Reyansh Deshmukh registered in Class 2 - A',
      time: '2h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Contextual Campus Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="font-semibold text-slate-800">
            {mockStore.settings.schoolName}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
            AY {mockStore.settings.academicSession}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, ID, or guardian..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs lg:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Matching Students ({searchResults.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {searchResults.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => {
                    navigate(`/students/${stu.id}`);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {stu.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {stu.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {stu.studentId} • {stu.classSection}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-medium text-slate-600">
                      {stu.parentName}
                    </div>
                    <div className="text-[10px] text-slate-400">{stu.phone}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              onClick={() => {
                navigate('/students');
                setShowSearchDropdown(false);
              }}
              className="p-2 bg-slate-50 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer border-t border-slate-100 flex items-center justify-center gap-1"
            >
              <span>View all students directory</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Right Actions: Quick Record Fee, Add Student, Notifications */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate('/fees')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200/50"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Collect Fee</span>
        </button>

        <button
          onClick={() => navigate('/students/add')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Student</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Campus Notifications
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer">
                  Mark read
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition-colors hover:bg-slate-50 ${
                      n.unread ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
