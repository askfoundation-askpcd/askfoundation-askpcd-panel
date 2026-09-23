export async function loadFoundation() {
  const response = await fetch("./foundation.json");
  const data = await response.json();
  return data;
}
