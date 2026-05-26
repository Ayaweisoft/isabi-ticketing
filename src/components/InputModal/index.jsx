import React from 'react'

const FIELDS = [
  {
    name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
];

const InputModal = ({ setModal, handleSubmit, setFormData, formData }) => {
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={() => setModal(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#22c55e]" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
            <div>
              <h2 className="text-white font-black text-xl">Checkout</h2>
              <p className="text-white/35 text-xs mt-0.5">Complete your details to proceed</p>
            </div>
            <button
              onClick={() => setModal(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/40 hover:text-white transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {FIELDS.map(({ name, label, type, placeholder, icon }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                  <input
                    type={type}
                    required
                    name={name}
                    placeholder={placeholder}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
              </div>
            ))}

            <div className="pt-1 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm
                  bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d]
                  shadow-lg shadow-green-500/25 hover:shadow-green-500/35
                  transition-all duration-200 active:scale-[0.99]
                  flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Payment
              </button>

              <p className="text-center text-white/20 text-[11px] flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                SSL Encrypted · Secured by i-Sabi
              </p>

              {/* PIN / OTP hint */}
              <div className="flex gap-2.5 p-3 rounded-xl bg-[#22c55e]/[0.06] border border-[#22c55e]/20">
                <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  On the next screen, you will be asked for your <span className="text-[#22c55e] font-bold">card PIN</span> (your 4-digit ATM PIN — not an SMS code), then an <span className="text-[#22c55e] font-bold">OTP</span> sent to your bank-registered number.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
