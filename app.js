const SUPABASE_URL = 'https://hephnjottsmijfoyfmdp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlcGhuam90dHNtaWpmb3lmbWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzA4NTcsImV4cCI6MjEwNzIwNjg1N30.Ia-6JlnTNYq-PBLj3Qz_BedckjkaIRGG9Cfszl1kP10';
const form = document.getElementById('registration-form');
const button = document.getElementById('submit-button');
const status = document.getElementById('form-status');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity() || button.disabled) return;
  const fields = new FormData(form);
  if (fields.get('website')) return;
  const name = String(fields.get('full_name')).trim();
  const email = String(fields.get('email')).trim().toLowerCase();
  let phone = String(fields.get('whatsapp')).trim().replace(/[\s()\-]/g, '');
  if (/^[6-9]\d{9}$/.test(phone)) phone = '+91' + phone;
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    status.textContent = 'Please enter a valid WhatsApp number with country code, e.g. +91 98765 43210.';
    document.getElementById('whatsapp').focus(); return;
  }
  if (name.length < 2) { status.textContent = 'Please enter your full name.'; return; }
  button.disabled = true; button.textContent = 'Saving your registration…'; status.textContent = '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/register_workshop`, {
      method: 'POST', signal: controller.signal,
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_full_name: name, p_email: email, p_whatsapp: phone })
    });
    if (!response.ok) {
      status.textContent = 'Registration could not be saved. Please try again shortly.';
      return;
    }
    const result = await response.json();
    if (!result || result.ok !== true) throw new Error('Registration not confirmed');
    document.getElementById('form-view').hidden = true;
    const success = document.getElementById('success-view');
    success.hidden = false; success.focus();
    success.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    form.reset();
  } catch (error) {
    status.textContent = error.name === 'AbortError' ? 'The connection timed out. Please try again.' : 'Unable to confirm your registration. Check your connection and try again.';
  } finally {
    clearTimeout(timeout); button.disabled = false; button.innerHTML = 'Register for free <span>↗</span>';
  }
});
