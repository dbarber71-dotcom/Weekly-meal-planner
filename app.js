const $ = id => document.getElementById(id);
const saved = $("saved");
try { saved.value = localStorage.getItem("familyTeaPlan") || ""; } catch(e) {}
$("make").addEventListener("click", () => {
  const people = Math.max(1, Number($("people").value) || 4);
  const budget = Math.max(10, Number($("budget").value) || 50);
  const diet = $("diet").value.trim() || "No special dietary requirements";
  const dislikes = $("dislikes").value.trim() || "None specified";
  const likes = $("likes").value.trim() || "Use a good variety";
  const prompt = `Create a realistic, budget-friendly 7-day evening meal plan for a family of ${people}, with a total ingredients budget of £${budget} for all seven meals. Dietary requirements: ${diet}. Foods to avoid: ${dislikes}. Preferred foods or ingredients: ${likes}. Use ordinary UK supermarket ingredients and family-friendly meals. Avoid waste by reusing ingredients across meals. Include for each day: meal name, brief recipe, prep/cook time, and approximate cost. Then give one consolidated shopping list grouped by supermarket section with quantities, and an estimated total. Keep within budget; state any assumptions.`;
  const url = "https://chatgpt.com/?q=" + encodeURIComponent(prompt);
  window.location.href = url;
});
$("save").addEventListener("click", () => {
  try { localStorage.setItem("familyTeaPlan", saved.value); $("status").textContent = "Saved on this iPhone."; }
  catch(e) { $("status").textContent = "Could not save in this browser."; }
});
$("clear").addEventListener("click", () => {
  saved.value = "";
  try { localStorage.removeItem("familyTeaPlan"); } catch(e) {}
  $("status").textContent = "Cleared.";
});
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));