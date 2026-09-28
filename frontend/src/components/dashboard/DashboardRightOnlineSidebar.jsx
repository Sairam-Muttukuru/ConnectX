import { useState } from 'react';
import { Phone, PhoneOff, MoreHorizontal, Video } from 'lucide-react';

export default function DashboardRightOnlineSidebar({ onCallAction }) {
  const [isCallActive, setIsCallActive] = useState(true);

  const onlineContacts = [
    { id: 1, name: 'Rahul Kumar', status: 'Online', avatar: '/images/dashboard/user_rahul.png' },
    { id: 2, name: 'Priya Sharma', status: 'Online', avatar: '/images/dashboard/priya_avatar.png' },
    { id: 3, name: 'Arjun Mehta', status: 'Online', avatar: '/images/dashboard/arjun_avatar.png' },
    { id: 4, name: 'Tanya Roy', status: 'Online', avatar: '/images/dashboard/user_sneha.png' },
    { id: 5, name: 'Rohit Deshmukh', status: 'Online', avatar: '/images/dashboard/user_rohit.png' },
    { id: 6, name: 'Rohan Patil', status: 'Online', avatar: '/images/dashboard/user_aditya.png' },
    { id: 7, name: 'Tanya Roy', status: 'Online', avatar: '/images/dashboard/user_anjali.png' },
    { id: 8, name: 'Sameer Khan', status: 'Online', avatar: '/images/dashboard/user_kiran.png' },
  ];

  return (
    <aside className="w-full space-y-4">
      {/* Online Now (28) Card */}
      <div className="rounded-3xl p-5 bg-white dark:bg-[#0E1330] border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Online Now</h3>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">(28)</span>
          </div>
          <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            See all
          </button>
        </div>

        <div className="space-y-2">
          {onlineContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/15"
                    onError={(e) => {
                      e.target.src = '/images/dashboard/user_avatar.jpg';
                    }}
                  />
                  {/* Glowing Green Online Status Dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0E1330]" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                    {contact.name}
                  </h4>
                  <p className="text-[10px] text-emerald-500 font-medium">
                    {contact.status}
                  </p>
                </div>
              </div>

              <button
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active/Incoming Audio & Video Call Banner */}
      {isCallActive && (
        <div className="rounded-3xl p-4 bg-gradient-to-r from-[#0C122D] via-[#10193E] to-[#0A0F26] border border-[#232D65] shadow-lg text-white relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse border border-emerald-500/30">
              <Phone className="w-5 h-5 fill-emerald-400 text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                Audio/Video call with Priya Sharma...
              </h4>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                Incoming call • High Quality Encrypted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                if (onCallAction) onCallAction('accept');
                alert('Connected to Priya Sharma! Audio/Video call started.');
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Accept</span>
            </button>

            <button
              onClick={() => {
                setIsCallActive(false);
                if (onCallAction) onCallAction('decline');
              }}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-red-500/80 text-slate-300 hover:text-white font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
