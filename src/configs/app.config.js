const appConfig = {
    // In dev: Vite proxies /api → https://api.i-sabi.com.ng (no CORS)
    // In prod build: uses the full URL directly
    apiPrefix: import.meta.env.VITE_API_PREFIX || "https://api.i-sabi.com.ng/api",

    devAppUrl: "https://ticketing.i-sabi.com.ng/",
    appUrl: "https://i-sabi.app",
    paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_75b7957655199a457f85ff985808d2d1dfbaacfd",
}

export default appConfig;
