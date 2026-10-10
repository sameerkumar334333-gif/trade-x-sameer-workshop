# Trade X Sameer Workshop

Mobile-friendly landing page for a free beginner trading workshop with Sameer Sharma.
Sunday, 11 October 2026 at 6 PM IST.

## Run or host

Static HTML, CSS and JavaScript. Serve this repository root on any static host. No build command is required.

## Registration setup

Run `supabase-setup.sql` in the Supabase SQL Editor before accepting registrations. The supplied browser anon key is public by design. Never add service-role keys.

The `register_workshop` function validates submissions and prevents duplicate emails for the same workshop. RLS and revoked direct table access keep attendee details private. After successful registration, visitors receive the Telegram channel link.

View registrations in Supabase Table Editor under `workshop_registrations`.

No automated email/WhatsApp messages are configured. The host shares the joining link on Telegram. Basic honeypot protection is included; CAPTCHA and server-side rate limiting are not configured.

JavaScript form checks passed. Live database setup and browser visual verification remain unconfirmed.
