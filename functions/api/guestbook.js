export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'Database RSVP belum terhubung.' }, 503);

  const { results = [] } = await env.DB.prepare(
    `SELECT id, name, message, created_at
     FROM guestbook
     WHERE approved = 1 AND message <> ''
     ORDER BY id DESC
     LIMIT 50`
  ).all();

  return json({ entries: results });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'Database RSVP belum terhubung.' }, 503);
  if (request.headers.get('content-type')?.includes('application/json') !== true) {
    return json({ error: 'Format data tidak valid.' }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: 'Data tidak valid.' }, 400);
  }

  const name = String(body?.name || '').trim().slice(0, 80);
  const attendance = String(body?.attendance || '').trim().slice(0, 30);
  const guestCountRaw = Number(body?.guest_count);
  const message = String(body?.message || '').trim().slice(0, 500);
  const giftType = String(body?.gift_type || '').trim().slice(0, 30);

  if (!name) return json({ error: 'Nama wajib diisi.' }, 400);
  if (!attendance) return json({ error: 'Kehadiran wajib dipilih.' }, 400);
  if (!message || message.length < 3) return json({ error: 'Ucapan & Doa wajib diisi.' }, 400);

  const isAbsent = /tidak\s*hadir/i.test(attendance);
  const guestCount = isAbsent ? 0 : (Number.isFinite(guestCountRaw) ? Math.floor(guestCountRaw) : 1);
  if (!isAbsent && (guestCount < 1 || guestCount > 20)) {
    return json({ error: 'Jumlah tamu harus antara 1 dan 20.' }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO guestbook (name, message, attendance, guest_count, gift_type, approved, created_at)
     VALUES (?, ?, ?, ?, ?, 1, datetime('now'))`
  ).bind(name, message, attendance, guestCount, giftType).run();

  return json({ ok: true }, 201);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}
