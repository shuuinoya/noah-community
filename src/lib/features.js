// Google sign-in requires a Google Cloud OAuth client (see README). Until
// VITE_GOOGLE_LOGIN_ENABLED=true is set, the button stays hidden so users
// aren't shown a login option that isn't wired up yet.
export const GOOGLE_LOGIN_ENABLED = import.meta.env.VITE_GOOGLE_LOGIN_ENABLED === 'true';
