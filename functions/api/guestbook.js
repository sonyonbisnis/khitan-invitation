export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'Guestbook database belum terhubung.' }, 503);

  const { results = [] } = await env.DB.prepare(
    `SELECT id, name, message, created_at
     FROM guestbook
     WHERE approved = 1
     ORDER BY id DESC
     LIMIT 50`
  ).all();

  return json({ entries: results });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'Guestbook database belum terhubung.' }, 503);
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
  const message = String(body?.message || '').trim().slice(0, 500);

  if (!name || !message) {
    return json({ error: 'Nama dan ucapan wajib diisi.' }, 400);
  }
  if (message.length < 3) {
    return json({ error: 'Ucapan terlalu singkat.' }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO guestbook (name, message, approved, created_at)
     VALUES (?, ?, 1, datetime('now'))`
  ).bind(name, message).run();

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
