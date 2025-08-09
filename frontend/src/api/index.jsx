export async function getRecommendation() {
    const res = await fetch("/api/ai/recommendation", {
      method: "POST",
      credentials: "include", // send cookies for Flask session auth
      headers: { "Content-Type": "application/json" }
    });
  
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
  
    return await res.json(); // { grade, summary, quick_tips, suggested_actions }
  }
  