const $ = (id) => document.getElementById(id);
let plan = JSON.parse(localStorage.getItem("teaPlan") || "null");
let preferences = localStorage.getItem("teaPreferences") || "";
let checked = new Set(JSON.parse(localStorage.getItem("teaChecked") || "[]"));
let activeMealIndex = 0;

function save() {
  localStorage.setItem("teaPlan", JSON.stringify(plan));
  localStorage.setItem("teaChecked", JSON.stringify([...checked]));
}
function money(n) { return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:2}).format(n); }
function showStatus(msg, error=false) { $("status").textContent=msg; $("status").classList.toggle("error",error); }
function render() {
  if (!plan) return;
  $("planSection").hidden=false;
  $("weekTitle").textContent=plan.weekTitle || "Your family tea plan";
  $("budget").textContent=plan.budgetEstimate || "£45–£55";
  $("budgetNote").textContent=plan.budgetNote || "Estimated prices; check your local supermarket.";
  $("meals").innerHTML=plan.meals.map((m,i)=>`<article class="meal"><div class="meal-top"><span class="day">${esc(m.day.toUpperCase())}</span><span class="cost">${money(m.estimatedCost)}</span></div><h3>${esc(m.name)}</h3><p>${esc(m.description)}</p><div class="meal-foot"><span>◷ ${esc(m.prepTime)}</span><button data-recipe="${i}">View recipe →</button></div></article>`).join("");
  $("shopping").innerHTML=groupShopping(plan.shopping);
  $("meals").querySelectorAll("[data-recipe]").forEach(b=>b.addEventListener("click",()=>openRecipe(Number(b.dataset.recipe))));
  $("shopping").querySelectorAll("input[type=checkbox]").forEach(c=>c.addEventListener("change",()=>{const k=c.dataset.key;c.checked?checked.add(k):checked.delete(k);save();renderShoppingProgress();c.closest(".shop-item").classList.toggle("checked",c.checked);}));
  renderShoppingProgress(); save();
}
function groupShopping(items) {
  const groups={}; items.forEach((x,i)=>{(groups[x.category] ||= []).push({...x,key:`${x.category}|${x.item}|${i}`});});
  return Object.entries(groups).map(([name,arr])=>`<section class="shop-group"><h3>${esc(name)}</h3>${arr.map(x=>`<label class="shop-item ${checked.has(x.key)?"checked":""}"><input type="checkbox" data-key="${esc(x.key)}" ${checked.has(x.key)?"checked":""}><span>${esc(x.item)}<small>${esc(x.quantity)}</small></span></label>`).join("")}</section>`).join("");
}
function renderShoppingProgress(){const total=plan?.shopping?.length||0;const done=checked.size;$("progress").textContent=`${done} of ${total} items ticked off`;}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function makePlan(extra={}, button=$("generateBtn")) {
  button.disabled=true;button.textContent="Creating your week…";showStatus("Your AI chef is planning seven dinners and combining the shopping list…");
  try {
    const r=await fetch(extra.swap?"/api/swap":"/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({preferences,...extra})});
    const data=await r.json();if(!r.ok)throw new Error(data.error||"Something went wrong.");
    plan=data;checked.clear();save();render();showStatus("Your new family tea plan is ready. Enjoy!");$("planSection").scrollIntoView({behavior:"smooth",block:"start"});
  } catch(e){showStatus(e.message,true);}
  finally{button.disabled=false;button.textContent="✦ Make my week";}
}
function openRecipe(i){activeMealIndex=i;const m=plan.meals[i];$("recipeDay").textContent=m.day;$("recipeName").textContent=m.name;$("recipeDescription").textContent=m.description;$("recipeMeta").innerHTML=`<span>◷ ${esc(m.prepTime)}</span><span>£${Number(m.estimatedCost).toFixed(2)} estimated</span>`;$("recipeIngredients").innerHTML=m.ingredients.map(x=>`<li>${esc(x)}</li>`).join("");$("recipeMethod").innerHTML=m.method.map(x=>`<li>${esc(x)}</li>`).join("");$("recipeDialog").showModal();}
$("generateBtn").addEventListener("click",()=>makePlan({previousMeals:plan?.meals?.map(m=>m.name)||[]}));
$("newWeekBtn").addEventListener("click",()=>makePlan({previousMeals:plan?.meals?.map(m=>m.name)||[]},$("newWeekBtn")));
$("settingsBtn").addEventListener("click",()=>{$("preferences").value=preferences;$("settingsDialog").showModal();});
$("saveSettings").addEventListener("click",()=>{preferences=$("preferences").value.trim();localStorage.setItem("teaPreferences",preferences);});
$("closeRecipe").addEventListener("click",()=>$("recipeDialog").close());
$("swapBtn").addEventListener("click",()=>{const m=plan.meals[activeMealIndex];$("recipeDialog").close();makePlan({swap:true,day:m.day,currentMeal:m.name,previousMeals:plan.meals.map(x=>x.name)},$("generateBtn"));});
$("copyBtn").addEventListener("click",async()=>{const text=plan.shopping.map(x=>`${x.category}: ${x.item} — ${x.quantity}`).join("\n");try{await navigator.clipboard.writeText(text);$("copyBtn").textContent="Copied ✓";setTimeout(()=>$("copyBtn").textContent="Copy list",1600);}catch{$("copyBtn").textContent="Copy unavailable";}});
if(plan){render();showStatus("Your saved plan is ready.");}
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));