export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}
