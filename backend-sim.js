export async function askPCDoctorBrain(question) {
  // Simulated processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Simple routing logic (placeholder)
  if (question.toLowerCase().includes("windows")) {
    return "It looks like you’re asking about Windows. Here’s a quick diagnostic: try checking Event Viewer for recent errors.";
  }

  if (question.toLowerCase().includes("network")) {
    return "Network issues can often be traced to DNS. Try switching temporarily to 8.8.8.8 and see if stability improves.";
  }

  // Default simulated response
  return "Your question has been processed by the AskPCDoctor simulation engine. The full backend will be connected soon.";
}
