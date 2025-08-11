export async function submitSuggestionRemote(payload) {
  try {
    const url = import.meta.env.VITE_SUGGESTIONS_WEBHOOK_URL;
    const secret = import.meta.env.VITE_SUGGESTIONS_WEBHOOK_SECRET;
    if (!url) return { ok: false, error: 'No webhook url configured' };
    
    const res = await fetch(url, {
      method: 'POST',
      // CORS: Make webhooks обычно не возвращают CORS-заголовки.
      // Используем no-cors, чтобы не блокировать отправку; ответ будет opaque.
      mode: 'no-cors',
      headers: { 
        'Content-Type': 'application/json',
        'X-Webhook-Secret': secret || ''
      },
      body: JSON.stringify({
        ...payload,
        secret: secret || '',
        timestamp: new Date().toISOString()
      }),
    });
    // При no-cors ответ всегда opaque; считаем отправленным.
    try {
      if (res.type === 'opaque') return { ok: true };
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { ok: false, error: `HTTP ${res.status}: ${text}` };
      }
      const data = await res.json().catch(() => ({}));
      return { ok: true, data };
    } catch (_) {
      return { ok: true };
    }
  } catch (e) {
    console.warn('submitSuggestionRemote error', e);
    return { ok: false, error: e?.message || 'unknown' };
  }
}


