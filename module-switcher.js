export function switchModule(name) {
  const status = document.getElementById("apc-status");
  status.textContent = `${name} Ready`;
  console.log(`Module switched to: ${name}`);
}
