const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const store = getStore("karaoke-rooms");
  const params = event.queryStringParameters || {};
  const { bucket, key } = params;

  const headers = { "Content-Type": "application/json" };

  if (!bucket || !key) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing bucket or key" }) };
  }

  const storeKey = `${bucket}:${key}`;

  if (event.httpMethod === "GET") {
    const value = await store.get(storeKey);
    return { statusCode: 200, headers, body: value || "null" };
  }

  if (event.httpMethod === "POST") {
    await store.set(storeKey, event.body || "null");
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
