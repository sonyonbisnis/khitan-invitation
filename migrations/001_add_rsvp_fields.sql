-- Add RSVP fields to the existing guestbook table.
-- Run this once in Cloudflare D1 database: khitan-guestbook
ALTER TABLE guestbook ADD COLUMN attendance TEXT NOT NULL DEFAULT 'Hadir';
ALTER TABLE guestbook ADD COLUMN guest_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE guestbook ADD COLUMN gift_type TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_guestbook_attendance
ON guestbook(attendance);
