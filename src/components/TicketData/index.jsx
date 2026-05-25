import React from 'react'

const FIELDS = [
  { key: 'name', label: 'Name', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'phone', label: 'Phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { key: 'ticketType', label: 'Ticket Type', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { key: 'amount', label: 'Amount Paid', format: (v) => `₦${parseFloat(v || 0).toLocaleString()}`, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { key: 'numberOfTicket', label: 'Tickets', format: (v, d) => `${v} total · ${d.numberOfTicketUsed || 0} used`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

const statusStyle = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'valid') return 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20';
  if (s === 'used') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  return 'text-red-400 bg-red-500/10 border-red-500/20';
};

const TicketData = ({ data }) => {
  return (
    <div className="w-full max-w-sm bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-black text-base">Ticket Details</h3>
          {data.status && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${statusStyle(data.status)}`}>
              {data.status}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {FIELDS.map(({ key, label, icon, format }) => {
            const val = format ? format(data[key], data) : data[key];
            if (!val) return null;
            return (
              <div key={key} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] font-medium">{label}</p>
                  <p className="text-white font-semibold text-sm truncate">{val}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TicketData;
