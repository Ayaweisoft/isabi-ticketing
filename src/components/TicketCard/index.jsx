import React, { useState } from 'react'
import { useTicketContext } from '../../hooks/useTicketContext';

const BADGE_MAP = {
  vip: { label: 'VIP', cls: 'from-yellow-400 to-amber-500 text-black' },
  early: { label: 'Best Deal', cls: 'from-[#22c55e] to-[#16a34a] text-white' },
  table: { label: 'Premium', cls: 'from-purple-400 to-violet-500 text-white' },
};

const getBadge = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('vip')) return BADGE_MAP.vip;
  if (t.includes('early')) return BADGE_MAP.early;
  if (t.includes('table')) return BADGE_MAP.table;
  return null;
};

const TicketCard = ({ data, handleClick }) => {
  const [numberOfTicket, setNumberOfTicket] = useState(0);
  const [error, setError] = useState(null);
  const { dispatch } = useTicketContext();

  const remaining = data.capacity != null ? data.capacity - (data.purchased || 0) : null;
  const isSoldOut = remaining !== null && remaining <= 0;
  const isLow = remaining !== null && remaining > 0 && remaining <= 10;

  const handleInsideClick = () => {
    if (isSoldOut) return;
    if (numberOfTicket === 0) { setError('Select at least 1 ticket'); return; }
    dispatch({ type: 'SET_TICKET', payload: { ...data, numberOfTicket } });
    handleClick(data._id);
  };

  const increase = () => {
    if (isSoldOut) return;
    if (error) setError(null);
    setNumberOfTicket(p => p + 1);
  };

  const decrease = () => {
    if (numberOfTicket === 0) return;
    if (error) setError(null);
    setNumberOfTicket(p => p - 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    if (error) setError(null);
    setNumberOfTicket(Math.max(0, val));
  };

  const total = numberOfTicket * (data.amount || 0);
  const badge = getBadge(data.ticketType);
  const isSelected = numberOfTicket > 0;

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300
        ${isSoldOut
          ? 'ring-1 ring-white/[0.05] opacity-60'
          : isSelected
            ? 'ring-2 ring-[#22c55e] shadow-[0_0_24px_rgba(34,197,94,0.15)]'
            : 'ring-1 ring-white/[0.07] hover:ring-white/[0.15] hover:shadow-lg hover:shadow-black/40'
        }
        bg-gradient-to-b from-[#161616] to-[#111111]
      `}
    >
      {/* Selected accent line */}
      {isSelected && <div className="h-[2px] w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" />}

      {/* Header — type + price */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-black text-sm leading-snug line-clamp-2">{data.ticketType}</h3>
          {badge && !isSoldOut && (
            <span className={`inline-flex mt-1.5 px-2 py-[2px] rounded-full text-[9px] font-black bg-gradient-to-r ${badge.cls} shadow-sm`}>
              {badge.label}
            </span>
          )}
          {isSoldOut && (
            <span className="inline-flex mt-1.5 px-2 py-[2px] rounded-full text-[9px] font-black bg-white/10 border border-white/15 text-white/50">
              Sold Out
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className={`font-black text-lg leading-none ${isSoldOut ? 'text-white/25' : 'text-[#22c55e]'}`}>
            ₦{Number(data.amount || 0).toLocaleString()}
          </p>
          <p className="text-white/20 text-[9px] mt-0.5">per ticket</p>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Low availability */}
        {isLow && !isSoldOut && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 animate-[pulseDot_1.5s_ease-in-out_infinite]" />
            <span className="text-orange-400 text-[10px] font-bold">Only {remaining} left!</span>
          </div>
        )}

        {/* Quantity stepper — grid ensures both buttons are always equal width */}
        <div className={`grid grid-cols-[2.75rem_1fr_2.75rem] rounded-xl overflow-hidden border transition-all duration-200 ${
          isSoldOut
            ? 'border-white/[0.05] opacity-40'
            : isSelected
              ? 'border-[#22c55e]/40 bg-[#22c55e]/5'
              : 'border-white/[0.08] bg-white/[0.03]'
        }`}>
          <button
            onClick={decrease}
            disabled={isSoldOut || numberOfTicket === 0}
            className="h-11 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all border-r border-white/[0.06]"
            aria-label="Decrease"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="text"
            inputMode="numeric"
            className="h-11 text-center text-white font-bold text-sm bg-transparent focus:outline-none w-full"
            value={numberOfTicket}
            onChange={handleInputChange}
            disabled={isSoldOut}
            aria-label="Number of tickets"
          />
          <button
            onClick={increase}
            disabled={isSoldOut || (remaining !== null && numberOfTicket >= remaining)}
            className="h-11 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all border-l border-white/[0.06]"
            aria-label="Increase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wide">Total</p>
          <p className={`font-black text-base tabular-nums ${total > 0 ? 'text-white' : 'text-white/20'}`}>
            {total > 0 ? `₦${total.toLocaleString()}` : '—'}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleInsideClick}
          disabled={isSoldOut}
          className={`w-full flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-xs
            transition-all duration-200 active:scale-95
            ${isSoldOut
              ? 'bg-white/5 text-white/25 cursor-not-allowed'
              : 'text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          {isSoldOut ? 'Sold Out' : 'Get Tickets'}
        </button>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-[fadeIn_0.2s_ease-out]">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
