export async function onRequestGet({ request, env }) {
  const token = String(env.ADMIN_TOKEN || '');
  const auth = request.headers.get('authorization') || '';

  if (!token || auth !== `Bearer ${token}`) {
    return json({ error: 'Akses admin tidak diizinkan.' }, 401);
  }
  if (!env.DB) return json({ error: 'Database RSVP belum terhubung.' }, 503);

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 200, 1), 1000);

  const summary = await env.DB.prepare(`
    SELECT
      SUM(CASE WHEN attendance = 'Hadir' THEN 1 ELSE 0 END) AS hadir,
      SUM(CASE WHEN attendance = 'Tidak Hadir' THEN 1 ELSE 0 END) AS tidak_hadir,
      COALESCE(SUM(CASE WHEN attendance = 'Hadir' THEN guest_count ELSE 0 END), 0) AS total_tamu,
      COUNT(*) AS total_rsvp
    FROM guestbook
  `).first();

  const { results = [] } = await env.DB.prepare(`
    SELECT id, name, attendance, guest_count, message, gift_type, created_at
    FROM guestbook
    ORDER BY id DESC
    LIMIT ?
  `).bind(limit).all();

  return json({
    summary: {
      hadir: Number(summary?.hadir || 0),
      tidak_hadir: Number(summary?.tidak_hadir || 0),
      total_tamu: Number(summary?.total_tamu || 0),
      total_rsvp: Number(summary?.total_rsvp || 0)
    },
    entries: results
  });
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
