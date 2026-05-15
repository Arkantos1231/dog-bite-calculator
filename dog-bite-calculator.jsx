import { useState, useCallback } from "react";

// ─── State Dog Bite Liability Law ─────────────────────────────────────────────
const DOG_BITE_LAWS = {
  "Alabama":        { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable only if they knew or should have known the dog was dangerous." },
  "Alaska":         { system: "Strict Liability",         liability: "strict",     note: "Owner strictly liable for bites in public or lawfully on private property." },
  "Arizona":        { system: "Strict Liability",         liability: "strict",     note: "Owner strictly liable regardless of prior knowledge. ARS §11-1025." },
  "Arkansas":       { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable if they had prior knowledge of dangerous propensity." },
  "California":     { system: "Strict Liability",         liability: "strict",     note: "Strict liability regardless of prior knowledge. Civil Code §3342." },
  "Colorado":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability for serious bodily injury. CRS §13-21-124." },
  "Connecticut":    { system: "Strict Liability",         liability: "strict",     note: "Strict liability regardless of prior knowledge or viciousness." },
  "Delaware":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability for bites in public or lawfully on private property." },
  "Florida":        { system: "Strict Liability",         liability: "strict",     note: "Strict liability. §767.04. Comparative negligence applies." },
  "Georgia":        { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable if they had knowledge of vicious propensity and victim was not at fault." },
  "Hawaii":         { system: "Strict Liability",         liability: "strict",     note: "Strict liability for dog bites." },
  "Idaho":          { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable based on negligence and prior knowledge of dangerous tendencies." },
  "Illinois":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability. Animal Control Act §16. No prior knowledge required." },
  "Indiana":        { system: "Strict Liability",         liability: "strict",     note: "Strict liability under IC 15-20-1-3." },
  "Iowa":           { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Iowa Code §351.28." },
  "Kansas":         { system: "Strict Liability",         liability: "strict",     note: "Strict liability under KSA §47-646." },
  "Kentucky":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability under KRS §258.235." },
  "Louisiana":      { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Civil Code Art. 2321." },
  "Maine":          { system: "Strict Liability",         liability: "strict",     note: "Strict liability under 7 MRS §3961." },
  "Maryland":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability — presumption of knowledge of vicious propensity." },
  "Massachusetts":  { system: "Strict Liability",         liability: "strict",     note: "Strict liability under MGL c.140 §155. No prior knowledge required." },
  "Michigan":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability under MCL §287.351." },
  "Minnesota":      { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Minn. Stat. §347.22." },
  "Mississippi":    { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable based on negligence and prior knowledge." },
  "Missouri":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Mo. Rev. Stat. §273.036." },
  "Montana":        { system: "One-Bite Rule",           liability: "negligence", note: "Negligence standard — prior knowledge required." },
  "Nebraska":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Neb. Rev. Stat. §54-601." },
  "Nevada":         { system: "One-Bite Rule",           liability: "negligence", note: "Negligence and prior knowledge (scienter) required." },
  "New Hampshire":  { system: "Strict Liability",         liability: "strict",     note: "Strict liability under RSA 466:19." },
  "New Jersey":     { system: "Strict Liability",         liability: "strict",     note: "Strict liability under NJSA 4:19-16." },
  "New Mexico":     { system: "Strict Liability",         liability: "strict",     note: "Strict liability under NMSA §77-1-3." },
  "New York":       { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable only if they knew of the dog's vicious propensity. Prior bite history is essential." },
  "North Carolina": { system: "Strict Liability",         liability: "strict",     note: "Strict liability for dangerous dogs under NCGS §67-4.4." },
  "North Dakota":   { system: "Strict Liability",         liability: "strict",     note: "Strict liability under NDCC §42-03-01." },
  "Ohio":           { system: "Strict Liability",         liability: "strict",     note: "Strict liability under ORC §955.28. Comparative negligence applies." },
  "Oklahoma":       { system: "Strict Liability",         liability: "strict",     note: "Strict liability under 4 OS §42.1." },
  "Oregon":         { system: "Strict Liability",         liability: "strict",     note: "Strict liability under ORS §31.360." },
  "Pennsylvania":   { system: "Mixed — Strict/Negligence",liability: "mixed",     note: "Strict liability limited to medical costs on first bite. Full damages if owner knew of viciousness." },
  "Rhode Island":   { system: "Strict Liability",         liability: "strict",     note: "Strict liability under RIGL §4-13-16." },
  "South Carolina": { system: "Strict Liability",         liability: "strict",     note: "Strict liability under SC Code §47-3-110." },
  "South Dakota":   { system: "Strict Liability",         liability: "strict",     note: "Strict liability under SDCL §40-34-1." },
  "Tennessee":      { system: "Strict Liability",         liability: "strict",     note: "Strict liability under TCA §44-8-413." },
  "Texas":          { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable if they knew of the dog's dangerous propensity." },
  "Utah":           { system: "Strict Liability",         liability: "strict",     note: "Strict liability under UCA §18-1-1." },
  "Vermont":        { system: "Strict Liability",         liability: "strict",     note: "Strict liability under 20 VSA §3452." },
  "Virginia":       { system: "One-Bite Rule",           liability: "negligence", note: "Owner liable only if they had prior knowledge of dangerous propensity." },
  "Washington":     { system: "Strict Liability",         liability: "strict",     note: "Strict liability under RCW §16.08.040." },
  "Washington D.C.":{ system: "Strict Liability",         liability: "strict",     note: "Strict liability — owner liable regardless of prior knowledge." },
  "West Virginia":  { system: "One-Bite Rule",           liability: "negligence", note: "Negligence standard with scienter requirement." },
  "Wisconsin":      { system: "Strict Liability",         liability: "strict",     note: "Strict liability under Wis. Stat. §174.02. Double damages possible on second bite." },
  "Wyoming":        { system: "One-Bite Rule",           liability: "negligence", note: "Negligence standard — prior knowledge of viciousness required." },
};

// ─── Punitive Damages by State ────────────────────────────────────────────────
// Based on whether punitive damages are available in personal injury / dog bite cases
const PUNITIVE_RULES = {
  "Nebraska":       { available: false, note: "Punitive damages are unconstitutional under Nebraska law." },
  "Washington":     { available: false, note: "Punitive damages are generally not recoverable in Washington tort cases." },
  "Massachusetts":  { available: false, note: "Punitive damages not available in personal injury in MA (only wrongful death under specific statutes)." },
  "Michigan":       { available: "limited", note: "Punitive damages very limited in Michigan — courts generally award actual damages only." },
  "Louisiana":      { available: true,  note: "Punitive damages available only for DWI-related injuries under CC Art. 2315.4; limited in standard dog bite." },
  "Oregon":         { available: true,  note: "Punitive damages available but capped. Clear and convincing evidence of malice or reckless indifference required." },
  "Colorado":       { available: true,  note: "Punitive damages capped at amount of actual damages. Clear and convincing evidence required. CRS §13-21-102." },
  "Florida":        { available: true,  note: "Punitive damages available. Must prove intentional misconduct or gross negligence. §768.72." },
  "Kansas":         { available: true,  note: "Punitive damages available but capped. Wanton conduct required." },
  "Illinois":       { available: true,  note: "Punitive damages available for willful and wanton conduct." },
  "Texas":          { available: true,  note: "Exemplary damages available. Requires malice, fraud, or gross negligence. Capped under CPRC §41.008." },
  "Georgia":        { available: true,  note: "Punitive damages available for willful misconduct, fraud, malice, or wanton conduct. Capped at $250,000 in most cases." },
  "Nevada":         { available: true,  note: "Punitive damages available for oppression, fraud, or malice. Caps apply based on defendant's net worth." },
  // Default for all other states: generally available with clear and convincing standard
};

const getPunitiveRule = (state) => {
  return PUNITIVE_RULES[state] || { available: true, note: "Punitive damages generally available upon clear and convincing evidence of willful, wanton, or reckless conduct by the owner." };
};

// ─── Scar Locations ───────────────────────────────────────────────────────────
const SCAR_LOCATIONS = [
  { value: "face",   label: "Face / Head",      icon: "😶", baseBonus: 3.0, childBonus: 5.0, note: "Highest value — permanent visible disfigurement at all times" },
  { value: "neck",   label: "Neck",              icon: "🔴", baseBonus: 2.0, childBonus: 3.5, note: "Highly visible — significant daily impact" },
  { value: "hands",  label: "Hands / Fingers",   icon: "✋", baseBonus: 1.5, childBonus: 2.5, note: "Visible + functional impairment risk" },
  { value: "arms",   label: "Arms",              icon: "💪", baseBonus: 1.0, childBonus: 1.75,note: "Visible in warm weather / short sleeves" },
  { value: "legs",   label: "Legs",              icon: "🦵", baseBonus: 0.75,childBonus: 1.25,note: "Partially visible" },
  { value: "torso",  label: "Torso / Covered",   icon: "👕", baseBonus: 0.5, childBonus: 0.75,note: "Lower visibility reduces non-economic impact" },
];

const US_STATES = Object.keys(DOG_BITE_LAWS).sort();

const STEPS = [
  { id: 1, label: "Jurisdiction", icon: "⚖️" },
  { id: 2, label: "Location",     icon: "📍" },
  { id: 3, label: "Incident",     icon: "🐕" },
  { id: 4, label: "Dog & Owner",  icon: "🏷️" },
  { id: 5, label: "Injuries",     icon: "🩹" },
  { id: 6, label: "Medical $",    icon: "🏥" },
  { id: 7, label: "Scarring",     icon: "🔴" },
  { id: 8, label: "Psychology",   icon: "🧠" },
  { id: 9, label: "MMI Status",   icon: "📋" },
  { id: 10, label: "Impact",      icon: "💼" },
];

const initialData = {
  state: "", incidentDate: "",
  location: "", locationAnalysis: null, locationLoading: false,
  victimAge: "", incidentDesc: "", provocation: "",
  dogBreed: "", ownerKnown: "", priorBiteHistory: "", dogVaccinated: "",
  injuryDesc: "", nerveInjury: "", nerveInjuryDesc: "", rabiesVaccine: "",
  erTreatment: "", surgeriesPerformed: "", surgeriesRecommended: "",
  plasticSurgery: "", plasticSurgeryDesc: "", plasticSurgeryFuture: "",
  totalMedBills: "", futureMedExpected: "", futureMedAmount: "",
  hasScarring: "", scarLocation: "", scarSeverity: "", scarPermanent: "",
  psychEffects: "", inTherapy: "", psychPermanent: "",
  atMMI: "", permanentRating: "", ongoingTreatment: "",
  lifeImpact: "", permanentLimitations: "", missedWork: "",
  occupation: "", exactLostWages: "", lossOfEarningCapacity: "",
};

// ─── Settlement Calculation ───────────────────────────────────────────────────
function calculateSettlement(d) {
  const medBills  = parseFloat(d.totalMedBills)   || 0;
  const futureMed = d.futureMedExpected === "yes" ? (parseFloat(d.futureMedAmount) || 0) : 0;
  const lostWages = parseFloat(d.exactLostWages)  || 0;
  const totalEcon = medBills + futureMed + lostWages;

  let mLow = 1.5, mMid = 2.5, mHigh = 4.0;

  // Surgery
  if (d.surgeriesPerformed  === "yes") { mLow += 0.75; mMid += 1.25; mHigh += 2.0; }
  if (d.surgeriesRecommended=== "yes") { mLow += 0.5;  mMid += 0.75; mHigh += 1.0; }

  // Plastic surgery — very high value, especially future reconstruction
  if (d.plasticSurgery      === "yes") { mLow += 0.75; mMid += 1.5;  mHigh += 2.5; }
  if (d.plasticSurgeryFuture=== "yes") { mLow += 0.5;  mMid += 1.0;  mHigh += 1.75;}

  // Nerve injury — permanent functional loss, very high value
  if (d.nerveInjury         === "yes") { mLow += 0.75; mMid += 1.25; mHigh += 2.0; }

  // Permanent impairment
  if (d.permanentRating     === "yes") { mLow += 0.5;  mMid += 0.75; mHigh += 1.0; }

  // Rabies vaccine
  if (d.rabiesVaccine       === "yes") { mLow += 0.25; mMid += 0.5;  mHigh += 0.75;}

  // Psych
  if ((d.psychEffects || "").trim().length > 5) { mLow += 0.25; mMid += 0.5;  mHigh += 1.0; }
  if (d.psychPermanent      === "yes") { mLow += 0.5;  mMid += 0.75; mHigh += 1.0; }
  if (d.inTherapy           === "yes") { mLow += 0.1;  mMid += 0.25; mHigh += 0.5; }

  // Scarring — location + severity + permanency + child factor
  if (d.hasScarring === "yes") {
    const scarDef = SCAR_LOCATIONS.find(s => s.value === d.scarLocation);
    const isChild = parseInt(d.victimAge) < 18;
    const baseBonus = scarDef ? (isChild ? scarDef.childBonus : scarDef.baseBonus) : 0.5;
    const severityMult = d.scarSeverity === "severe" ? 1.0 : d.scarSeverity === "moderate" ? 0.6 : 0.3;
    const permMult = d.scarPermanent === "yes" ? 1.0 : 0.5;
    const scarAdd = baseBonus * severityMult * permMult;
    mLow  += scarAdd * 0.5;
    mMid  += scarAdd;
    mHigh += scarAdd * 1.5;
  }

  // Child victim base boost
  const age = parseInt(d.victimAge);
  if (!isNaN(age) && age < 18) { mLow += 0.5;  mMid += 0.75; mHigh += 1.25; }
  if (!isNaN(age) && age < 10) { mLow += 0.5;  mMid += 0.75; mHigh += 1.0;  }

  // Prior bite history
  if (d.priorBiteHistory === "yes") { mLow += 0.5; mMid += 1.0; mHigh += 2.0; }

  // One-bite rule without prior history — reduce confidence
  const law = DOG_BITE_LAWS[d.state];
  if (law?.liability === "negligence" && d.priorBiteHistory !== "yes") {
    mLow -= 0.5; mMid -= 0.5;
  }

  // Loss of earning capacity
  if (d.lossOfEarningCapacity === "yes") { mLow += 0.25; mMid += 0.5; mHigh += 0.75; }
  if ((d.permanentLimitations || "").trim().length > 5) { mLow += 0.25; mMid += 0.5; mHigh += 0.5; }

  // AI location weight
  const locWeight = d.locationAnalysis?.weight || 1.0;
  mLow  *= locWeight;
  mMid  *= locWeight;
  mHigh *= locWeight;

  mLow  = Math.max(0.5, mLow);
  mMid  = Math.max(1.0, mMid);
  mHigh = Math.max(1.5, mHigh);

  const low  = Math.round((totalEcon + medBills * mLow)  / 500) * 500;
  const mid  = Math.round((totalEcon + medBills * mMid)  / 500) * 500;
  const high = Math.round((totalEcon + medBills * mHigh) / 500) * 500;

  const punitive = getPunitiveRule(d.state);

  return { low, mid, high, mLow, mMid, mHigh, totalEcon, law, locWeight, punitive };
}

const fmt = n => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// ─── AI Location Analysis ─────────────────────────────────────────────────────
async function fetchLocationAnalysis(state, locationType) {
  const locationLabels = {
    private_residence: "private residence (house owned by dog owner)",
    apartment_complex: "apartment complex (tenant as dog owner — renter's insurance situation)",
    business:          "business or commercial location",
    public_park:       "public park or street",
    other:             "other location",
  };

  const prompt = `You are a personal injury legal analyst specializing in dog bite cases.

Analyze the insurance landscape and recovery potential for a dog bite that occurred at: ${locationLabels[locationType]}
State: ${state}

Consider:
1. Typical insurance coverage available at this location type in ${state}
2. Likely policy limits and coverage gaps
3. Whether additional defendants (landlord, property manager, business) can be pursued
4. The realistic recovery potential given the insurance environment
5. Any ${state}-specific laws affecting this location type

Respond ONLY with a JSON object, no markdown, no explanation:
{
  "weight": <number between 0.5 and 1.5, where 1.0 is baseline private homeowner>,
  "coverageLabel": "<short label like 'Homeowner's Insurance' or 'Renter's Insurance (often absent)'>",
  "typicalLimits": "<e.g. '$100,000–$500,000' or 'Often uninsured or $10,000–$25,000'>",
  "recoveryRisk": "<low|medium|high>",
  "analysis": "<2-3 sentences explaining the insurance landscape and recovery strategy for this specific state and location>",
  "additionalDefendants": "<null or a short description of who else can be sued>"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DogBiteCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [showResults, setShowResults] = useState(false);

  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const triggerLocationAnalysis = useCallback(async (state, location) => {
    if (!state || !location) return;
    set("locationLoading", true);
    set("locationAnalysis", null);
    try {
      const result = await fetchLocationAnalysis(state, location);
      set("locationAnalysis", result);
    } catch (e) {
      set("locationAnalysis", { weight: 1.0, coverageLabel: "Unknown", typicalLimits: "Unknown", recoveryRisk: "medium", analysis: "Unable to load analysis. Using baseline weight.", additionalDefendants: null });
    }
    set("locationLoading", false);
  }, []);

  // ─── Design Tokens ──
  const C = {
    bg: "#FAF7F2", surface: "#FFFFFF", surface2: "#F5F0E8",
    border: "#E8DFD0", accent: "#C0392B", accentSoft: "rgba(192,57,43,0.08)",
    accentBorder: "rgba(192,57,43,0.25)", text: "#1C1410",
    textMid: "#5C4A3A", textSoft: "#9C8878", gold: "#9B6A2F",
    green: "#1E7E4A", amber: "#D97706", blue: "#1D6FA4",
  };

  const base = { width:"100%", boxSizing:"border-box", padding:"11px 14px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:15, outline:"none", fontFamily:"inherit" };
  const lbl  = { display:"block", fontSize:12, fontWeight:700, color:C.textMid, marginBottom:6, letterSpacing:"0.06em", textTransform:"uppercase" };
  const fo = e => e.target.style.borderColor = C.accent;
  const bl = e => e.target.style.borderColor = C.border;

  const Input = ({ label, field, type="text", placeholder="" }) => (
    <div style={{ marginBottom:16 }}>
      <label style={lbl}>{label}</label>
      <input type={type} value={data[field]} onChange={e=>set(field,e.target.value)} placeholder={placeholder} style={base} onFocus={fo} onBlur={bl} />
    </div>
  );

  const Textarea = ({ label, field, placeholder="", rows=3 }) => (
    <div style={{ marginBottom:16 }}>
      <label style={lbl}>{label}</label>
      <textarea value={data[field]} onChange={e=>set(field,e.target.value)} placeholder={placeholder} rows={rows} style={{...base,resize:"vertical"}} onFocus={fo} onBlur={bl} />
    </div>
  );

  const Radio = ({ label, field, options }) => (
    <div style={{ marginBottom:16 }}>
      <label style={lbl}>{label}</label>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {options.map(o => (
          <button key={o.value} onClick={()=>set(field,o.value)} style={{
            padding:"9px 18px", borderRadius:8, border:"1px solid",
            borderColor: data[field]===o.value ? C.accent : C.border,
            background:  data[field]===o.value ? C.accentSoft : C.surface2,
            color:       data[field]===o.value ? C.accent : C.textMid,
            fontSize:14, cursor:"pointer", fontWeight: data[field]===o.value ? 700 : 400,
            transition:"all 0.15s", fontFamily:"inherit",
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );

  const Select = ({ label, field, options }) => (
    <div style={{ marginBottom:16 }}>
      <label style={lbl}>{label}</label>
      <select value={data[field]} onChange={e=>set(field,e.target.value)} style={{...base, color: data[field]?C.text:C.textSoft}}>
        <option value="">Select...</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const InfoBox = ({ text, color="neutral" }) => (
    <div style={{ padding:"11px 14px", background: color==="warning"?"rgba(192,57,43,0.06)": color==="gold"?"rgba(155,106,47,0.08)": C.surface2, border:`1px solid ${ color==="warning"?C.accentBorder: color==="gold"?"rgba(155,106,47,0.25)":C.border}`, borderRadius:8, fontSize:13, color:C.textMid, marginTop:4, lineHeight:1.6 }}>{text}</div>
  );

  const LOCATION_OPTIONS = [
    { key:"private_residence", label:"Private residence (house)",        icon:"🏠" },
    { key:"apartment_complex", label:"Apartment complex",                 icon:"🏢" },
    { key:"business",          label:"Business or commercial location",   icon:"🏪" },
    { key:"public_park",       label:"Public park or street",             icon:"🌳" },
    { key:"other",             label:"Other",                             icon:"📍" },
  ];

  const riskColor = (r) => r==="low" ? C.accent : r==="medium" ? C.amber : C.green;
  const riskLabel = (r) => r==="low" ? "Lower Recovery Risk" : r==="medium" ? "Moderate Recovery" : "Strong Recovery";

  const sh = { margin:"0 0 6px 0", fontSize:22, fontWeight:700, color:C.text, fontFamily:"'Cormorant Garamond', Georgia, serif", letterSpacing:"-0.02em" };
  const sp = { margin:"0 0 24px 0", fontSize:14, color:C.textSoft, lineHeight:1.5 };

  const content = () => {
    switch(step) {

      case 1: return (<>
        <h2 style={sh}>Jurisdiction & Date</h2>
        <p style={sp}>State law determines whether strict liability or the one-bite rule applies — this governs the entire liability analysis.</p>
        <Select label="State where bite occurred" field="state" options={US_STATES} />
        {data.state && DOG_BITE_LAWS[data.state] && (
          <div style={{ padding:"12px 16px", background:C.accentSoft, border:`1px solid ${C.accentBorder}`, borderRadius:8, marginBottom:16 }}>
            <div style={{ fontSize:13, color:C.accent, fontWeight:700 }}>⚖️ {DOG_BITE_LAWS[data.state].system}</div>
            <div style={{ fontSize:13, color:C.textMid, marginTop:4 }}>{DOG_BITE_LAWS[data.state].note}</div>
          </div>
        )}
        <Input label="Date of incident" field="incidentDate" type="date" />
      </>);

      case 2: return (<>
        <h2 style={sh}>Location of Incident</h2>
        <p style={sp}>Location determines available insurance coverage and potential defendants — this is AI-analyzed for your specific state.</p>
        <label style={lbl}>Where did the bite occur?</label>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
          {LOCATION_OPTIONS.map(loc => (
            <button key={loc.key} onClick={async()=>{
              set("location", loc.key);
              if(data.state) await triggerLocationAnalysis(data.state, loc.key);
              else { set("locationLoading",false); set("locationAnalysis",null); }
            }} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 18px", borderRadius:10, border:"1px solid", textAlign:"left", cursor:"pointer",
              borderColor: data.location===loc.key ? C.accent : C.border,
              background:  data.location===loc.key ? C.accentSoft : C.surface2,
              transition:"all 0.15s", fontFamily:"inherit",
            }}>
              <span style={{ fontSize:22 }}>{loc.icon}</span>
              <span style={{ fontSize:15, fontWeight: data.location===loc.key?700:500, color: data.location===loc.key?C.accent:C.text }}>{loc.label}</span>
            </button>
          ))}
        </div>

        {/* AI Analysis Panel */}
        {data.location && !data.state && (
          <InfoBox text="⚠️ Select a state on Step 1 first to enable AI insurance analysis for this location." color="warning" />
        )}
        {data.locationLoading && (
          <div style={{ padding:"20px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, textAlign:"center" }}>
            <div style={{ fontSize:13, color:C.textSoft }}>🤖 Analyzing insurance landscape for {data.state}...</div>
            <div style={{ marginTop:8, height:3, background:C.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:"60%", background:C.accent, borderRadius:2, animation:"pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        )}
        {data.locationAnalysis && !data.locationLoading && (
          <div style={{ padding:"20px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, boxShadow:"0 2px 12px rgba(28,20,16,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>🤖 AI Insurance Analysis — {data.state}</div>
                <div style={{ fontSize:12, color:C.textSoft, marginTop:2 }}>{data.locationAnalysis.coverageLabel}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, fontWeight:700, color:riskColor(data.locationAnalysis.recoveryRisk), padding:"3px 10px", border:`1px solid ${riskColor(data.locationAnalysis.recoveryRisk)}`, borderRadius:20, display:"inline-block" }}>
                  {riskLabel(data.locationAnalysis.recoveryRisk)}
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div style={{ padding:"10px 12px", background:C.surface2, borderRadius:8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.textSoft, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Typical Coverage</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginTop:4 }}>{data.locationAnalysis.typicalLimits}</div>
              </div>
              <div style={{ padding:"10px 12px", background:C.surface2, borderRadius:8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.textSoft, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Value Weight</div>
                <div style={{ fontSize:14, fontWeight:700, color: data.locationAnalysis.weight >= 1.2 ? C.green : data.locationAnalysis.weight <= 0.8 ? C.accent : C.gold, marginTop:4 }}>{data.locationAnalysis.weight.toFixed(2)}x baseline</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:C.textMid, lineHeight:1.6, marginBottom: data.locationAnalysis.additionalDefendants ? 12 : 0 }}>
              {data.locationAnalysis.analysis}
            </div>
            {data.locationAnalysis.additionalDefendants && (
              <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(29,111,164,0.07)", border:"1px solid rgba(29,111,164,0.2)", borderRadius:8, fontSize:13, color:C.blue }}>
                <strong>Additional defendants to evaluate:</strong> {data.locationAnalysis.additionalDefendants}
              </div>
            )}
          </div>
        )}
      </>);

      case 3: return (<>
        <h2 style={sh}>Incident Description</h2>
        <p style={sp}>Victim age and a clear account of the attack are both critical to establishing liability and valuing the claim.</p>
        <Input label="Victim's age at time of incident" field="victimAge" type="number" placeholder="e.g. 8" />
        {data.victimAge && parseInt(data.victimAge) < 18 && (
          <div style={{ padding:"10px 14px", background:"rgba(155,106,47,0.1)", border:"1px solid rgba(155,106,47,0.3)", borderRadius:8, marginBottom:16, fontSize:13, color:C.gold, fontWeight:600 }}>
            👦 Child victim — significantly elevated damage value. Scarring and psychological injuries carry substantially higher jury awards for minors.
          </div>
        )}
        <Textarea label="Describe exactly what happened" field="incidentDesc" rows={4}
          placeholder="e.g. Victim was walking past neighbor's yard when dog charged through an open gate and bit the victim on the left arm and face without warning. Owner was present on the porch but did not intervene or restrain the dog." />
        <Radio label="Was the victim provoking the dog at the time of the attack?" field="provocation"
          options={[{value:"no",label:"No"},{value:"yes",label:"Yes"},{value:"disputed",label:"Disputed"}]} />
        {data.provocation==="yes" && (
          <InfoBox text="⚠️ Provocation is the primary defense in all dog bite cases. It can reduce or eliminate recovery depending on the state. Children are held to a lower provocation standard than adults." color="warning" />
        )}
      </>);

      case 4: return (<>
        <h2 style={sh}>The Dog & Owner</h2>
        <p style={sp}>Prior bite history is the most important liability fact in one-bite rule states — and supports punitive damages everywhere.</p>
        <Input label="Dog breed" field="dogBreed" placeholder="e.g. German Shepherd, Pit Bull Terrier, Rottweiler" />
        <Radio label="Is the dog owner known and identifiable?" field="ownerKnown"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
        <Radio label="Does the dog have a prior bite history or known aggressive behavior?" field="priorBiteHistory"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
        {data.priorBiteHistory==="yes" && (
          <InfoBox text="⚠️ Prior bite history establishes owner knowledge — critical for one-bite rule states. In all states, prior history supports enhanced damages and may trigger punitive damage exposure where available." color="warning" />
        )}
        <Radio label="Was the dog licensed and vaccinated?" field="dogVaccinated"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
      </>);

      case 5: return (<>
        <h2 style={sh}>Injuries</h2>
        <p style={sp}>Document every injury precisely — number of bites, locations, wound types, and any functional damage are all separate value drivers.</p>
        <Textarea label="Describe all injuries in detail" field="injuryDesc" rows={4}
          placeholder="e.g. Three deep puncture wounds to left forearm, two lacerations to face near jaw, avulsed skin on right hand, significant bruising from fall during attack." />
        <Radio label="Is there nerve damage or nerve injury?" field="nerveInjury"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Being evaluated"}]} />
        {data.nerveInjury==="yes" && (
          <Textarea label="Describe the nerve injury and any functional loss" field="nerveInjuryDesc"
            placeholder="e.g. Radial nerve damage to right hand — permanent reduced grip strength, numbness in thumb and index finger, drop wrist when fatigued." rows={2} />
        )}
        {data.nerveInjury==="yes" && (
          <InfoBox text="⚡ Nerve damage is a high-value injury — especially when permanent. Functional loss to hands significantly impacts earning capacity and daily life, and juries respond strongly to nerve injury testimony." color="warning" />
        )}
        <Radio label="Was the rabies vaccine series required?" field="rabiesVaccine"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Unknown"}]} />
        {data.rabiesVaccine==="yes" && (
          <InfoBox text="💉 The rabies vaccine series (4–5 painful injections over 14 days) is a recognized source of additional physical trauma and psychological distress and increases case value." color="warning" />
        )}
      </>);

      case 6: return (<>
        <h2 style={sh}>Medical Treatment & Bills</h2>
        <p style={sp}>Use the gross billed amount — not what insurance paid or adjusted. This is the multiplier base.</p>
        <Radio label="Was the victim treated at an ER or urgent care?" field="erTreatment"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        <Radio label="Any surgeries performed? (debridement, wound closure, reconstructive)" field="surgeriesPerformed"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        <Radio label="Any non-cosmetic surgeries recommended but not yet performed?" field="surgeriesRecommended"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />

        {/* Plastic Surgery — own dedicated section */}
        <div style={{ margin:"20px 0 8px", borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textMid, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Plastic & Reconstructive Surgery</div>
        </div>
        <Radio label="Was plastic or reconstructive surgery performed?" field="plasticSurgery"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        {data.plasticSurgery==="yes" && (
          <Textarea label="Describe the plastic/reconstructive procedures performed" field="plasticSurgeryDesc"
            placeholder="e.g. Facial laceration repair with plastic surgeon, skin graft to right forearm, scar revision surgery performed 6 months post-injury." rows={2} />
        )}
        <Radio label="Is future plastic surgery or scar revision anticipated?" field="plasticSurgeryFuture"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Under evaluation"}]} />
        {(data.plasticSurgery==="yes" || data.plasticSurgeryFuture==="yes") && (
          <InfoBox text="🔬 Plastic surgery — especially to the face — is one of the strongest value drivers in dog bite cases. Future scar revision procedures create ongoing economic damages and demonstrate the permanent nature of the injury." color="warning" />
        )}

        <div style={{ marginTop:20 }}>
          <Input label="Total medical bills to date — GROSS billed ($)" field="totalMedBills" type="number" placeholder="e.g. 22000" />
          <Radio label="Are future medical expenses anticipated?" field="futureMedExpected"
            options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
          {data.futureMedExpected==="yes" && (
            <Input label="Estimated future medical costs ($)" field="futureMedAmount" type="number" placeholder="e.g. 15000" />
          )}
        </div>
      </>);

      case 7: return (<>
        <h2 style={sh}>Scarring & Disfigurement</h2>
        <p style={sp}>Scarring is a standalone damage category. Visibility is the primary value driver — facial scarring on a child can exceed all other damages combined.</p>
        <Radio label="Is there permanent scarring or disfigurement?" field="hasScarring"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"unknown",label:"Too early to determine"}]} />
        {data.hasScarring==="yes" && (<>
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Location of scarring</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {SCAR_LOCATIONS.map(s => {
                const isChild = parseInt(data.victimAge) < 18;
                const bonus = isChild ? s.childBonus : s.baseBonus;
                return (
                  <button key={s.value} onClick={()=>set("scarLocation",s.value)} style={{
                    padding:"12px 14px", borderRadius:10, border:"1px solid", textAlign:"left", cursor:"pointer",
                    borderColor: data.scarLocation===s.value ? C.accent : C.border,
                    background:  data.scarLocation===s.value ? C.accentSoft : C.surface2,
                    transition:"all 0.15s", fontFamily:"inherit",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:14, fontWeight:700, color: data.scarLocation===s.value?C.accent:C.text }}>{s.icon} {s.label}</span>
                      <span style={{ fontSize:11, fontWeight:700, color: bonus >= 2.0 ? C.accent : bonus >= 1.0 ? C.gold : C.textSoft, padding:"2px 7px", border:`1px solid ${ bonus >= 2.0 ? C.accentBorder : "rgba(155,106,47,0.3)"}`, borderRadius:12 }}>+{bonus.toFixed(1)}x{isChild?" 👦":""}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textSoft, marginTop:4 }}>{s.note}</div>
                  </button>
                );
              })}
            </div>
          </div>
          {data.scarLocation==="face" && parseInt(data.victimAge) < 18 && (
            <div style={{ padding:"12px 14px", background:"rgba(192,57,43,0.1)", border:`1px solid ${C.accentBorder}`, borderRadius:8, marginBottom:16, fontSize:13, color:C.accent, fontWeight:600 }}>
              🔴 Facial scarring on a minor — this is the highest-value damage category in dog bite litigation. Jury awards for permanent facial disfigurement in children frequently reach six to seven figures regardless of medical bills.
            </div>
          )}
          <Radio label="Scar severity" field="scarSeverity"
            options={[{value:"minor",label:"Minor"},{value:"moderate",label:"Moderate"},{value:"severe",label:"Severe / disfiguring"}]} />
          <Radio label="Has a physician confirmed the scarring is permanent?" field="scarPermanent"
            options={[{value:"yes",label:"Yes — permanent"},{value:"no",label:"No / resolving"},{value:"unknown",label:"Too early to determine"}]} />
        </>)}
      </>);

      case 8: return (<>
        <h2 style={sh}>Psychological Impact</h2>
        <p style={sp}>Psychological injuries are often the most valuable component — particularly cynophobia and PTSD in children, which can last a lifetime.</p>
        <Textarea label="Describe any psychological effects (fear of dogs, PTSD, anxiety, depression, nightmares)" field="psychEffects"
          placeholder="e.g. Victim developed severe cynophobia, refuses to go outside, nightmares 3-4x weekly, withdrawn from school activities, diagnosed with PTSD by treating psychologist." rows={3} />
        <Radio label="Is the victim currently in therapy or psychological treatment?" field="inTherapy"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        <Radio label="Has a treating provider indicated the psychological injuries are permanent?" field="psychPermanent"
          options={[{value:"yes",label:"Yes — permanent"},{value:"no",label:"No / expected to resolve"},{value:"unknown",label:"Not yet determined"}]} />
        {data.psychPermanent==="yes" && (
          <InfoBox text="📌 Permanent psychological injury — especially in children — often becomes the single largest damage category, surpassing all physical damages. A life care plan for ongoing therapy costs can add significant future economic damages." color="warning" />
        )}
      </>);

      case 9: return (<>
        <h2 style={sh}>MMI Status</h2>
        <p style={sp}>Physical MMI anchors when the full damage picture is known and a demand can be made with confidence.</p>
        <Radio label="Has the victim reached MMI for physical injuries?" field="atMMI"
          options={[{value:"yes",label:"Yes — reached MMI"},{value:"no",label:"No — still treating (2+ years post-incident)"}]} />
        {data.atMMI==="yes" && (
          <Radio label="Is there a permanent impairment rating on file?" field="permanentRating"
            options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        )}
        {data.atMMI==="no" && (
          <Textarea label="Describe ongoing physical treatment" field="ongoingTreatment"
            placeholder="e.g. Monthly wound care, PT twice weekly, awaiting scar revision surgery consultation, ongoing plastic surgery evaluations every 3 months" />
        )}
      </>);

      case 10: return (<>
        <h2 style={sh}>Life Disruption & Lost Wages</h2>
        <p style={sp}>Document the full human and economic toll of the attack — daily life impact and permanency are critical to non-economic damages.</p>
        <Textarea label="How has the incident affected daily life, activities, sleep, and relationships?" field="lifeImpact"
          placeholder="e.g. Cannot take children to the park, avoids any outdoor activities, quit youth sports coaching, wakes with nightmares, marriage strained due to constant anxiety" rows={3} />
        <Textarea label="Permanent limitations documented by a physician or therapist, if any" field="permanentLimitations"
          placeholder="e.g. Therapist states victim will require lifelong treatment for cynophobia; orthopedist notes permanent reduced grip strength in left hand due to nerve damage" rows={2} />
        <Radio label="Did the victim miss work due to the attack?" field="missedWork"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
        {data.missedWork==="yes" && (<>
          <Input label="Occupation / Job Title" field="occupation" placeholder="e.g. Teacher, Delivery Driver, Software Engineer" />
          <Input label="Total lost wages — exact verified amount ($)" field="exactLostWages" type="number" placeholder="e.g. 8400" />
        </>)}
        <Radio label="Has the injury affected long-term earning capacity?" field="lossOfEarningCapacity"
          options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} />
      </>);

      default: return null;
    }
  };

  const result = showResults ? calculateSettlement(data) : null;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans', sans-serif", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#F5F0E8; } ::-webkit-scrollbar-thumb { background:#D4C4B0; border-radius:3px; }
        select option { background:#fff; }
        @keyframes pulse { 0%,100%{opacity:0.4;width:40%} 50%{opacity:1;width:80%} }
      `}</style>

      {/* Header */}
      <div style={{ background:"#1C1410", borderBottom:`3px solid ${C.accent}`, padding:"20px 32px" }}>
        <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:10, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🐕</div>
          <div>
            <div style={{ fontSize:19, fontWeight:700, fontFamily:"'Cormorant Garamond', serif", color:"#FAF7F2" }}>Dog Bite Settlement Calculator</div>
            <div style={{ fontSize:12, color:"#6C5A4A" }}>Personal Injury · Animal Attack Valuation · AI-Powered Insurance Analysis</div>
          </div>
          <div style={{ marginLeft:"auto", fontSize:11, color:"#6C5A4A", textAlign:"right", flexShrink:0 }}>
            <div style={{ color:C.accent, fontWeight:700 }}>DISCLAIMER</div>
            <div>Educational only. Not legal advice.</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"28px 20px" }}>

        {/* Step nav */}
        {!showResults && (
          <div style={{ display:"flex", gap:4, marginBottom:28, overflowX:"auto", paddingBottom:4 }}>
            {STEPS.map(s => (
              <button key={s.id} onClick={()=>setStep(s.id)} style={{
                flex:1, minWidth:52, padding:"8px 4px", borderRadius:8, border:"1px solid", cursor:"pointer",
                borderColor: step===s.id?C.accent: s.id<step?"rgba(192,57,43,0.25)":C.border,
                background:  step===s.id?C.accentSoft: s.id<step?"rgba(192,57,43,0.04)":C.surface,
                display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontFamily:"inherit",
              }}>
                <span style={{ fontSize:15 }}>{s.icon}</span>
                <span style={{ fontSize:9, color:step===s.id?C.accent:C.textSoft, fontWeight:step===s.id?700:400, textAlign:"center", lineHeight:1.2 }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Card */}
        {!showResults ? (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"30px 34px", boxShadow:"0 8px 40px rgba(28,20,16,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:26 }}>
              <div style={{ fontSize:11, color:C.textSoft, fontWeight:700, letterSpacing:"0.1em", whiteSpace:"nowrap" }}>Q {step} / {STEPS.length}</div>
              <div style={{ height:3, flex:1, margin:"0 14px", background:C.border, borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(step/STEPS.length)*100}%`, background:C.accent, borderRadius:2, transition:"width 0.3s" }} />
              </div>
              <div style={{ fontSize:11, color:C.accent, fontWeight:700, whiteSpace:"nowrap" }}>{Math.round((step/STEPS.length)*100)}%</div>
            </div>
            {content()}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, gap:12 }}>
              <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{ padding:"11px 26px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:step===1?C.border:C.textMid, cursor:step===1?"not-allowed":"pointer", fontSize:14, fontWeight:600, fontFamily:"inherit" }}>← Back</button>
              {step<STEPS.length
                ? <button onClick={()=>setStep(s=>s+1)} style={{ padding:"11px 30px", borderRadius:10, border:"none", background:C.accent, color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"inherit" }}>Continue →</button>
                : <button onClick={()=>setShowResults(true)} style={{ padding:"11px 30px", borderRadius:10, border:"none", background:C.accent, color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"inherit" }}>Calculate Value ⚖️</button>
              }
            </div>
          </div>

        ) : (
          <div>
            {/* Results Header */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"30px 34px", boxShadow:"0 8px 40px rgba(28,20,16,0.08)", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <h2 style={{ margin:0, fontSize:24, fontFamily:"'Cormorant Garamond', serif", color:C.text, letterSpacing:"-0.02em" }}>Settlement Analysis</h2>
                  <div style={{ fontSize:13, color:C.textSoft, marginTop:4 }}>
                    {data.state}{DOG_BITE_LAWS[data.state] ? ` · ${DOG_BITE_LAWS[data.state].system}` : ""}
                    {data.victimAge && ` · ${parseInt(data.victimAge)<18?"Minor Victim (Age "+data.victimAge+")":"Adult Victim (Age "+data.victimAge+")"}`}
                  </div>
                </div>
                <button onClick={()=>setShowResults(false)} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.textMid, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Edit</button>
              </div>

              {/* One-bite warning */}
              {result.law?.liability==="negligence" && data.priorBiteHistory!=="yes" && (
                <div style={{ padding:"13px 16px", background:"rgba(192,57,43,0.07)", border:`1px solid ${C.accentBorder}`, borderRadius:10, marginBottom:20 }}>
                  <div style={{ fontSize:13, color:C.accent, fontWeight:700, marginBottom:3 }}>⚠️ One-Bite Rule State — Liability Must Be Established</div>
                  <div style={{ fontSize:13, color:C.textMid }}>{data.state} requires proof the owner knew of the dog's dangerous propensity. Without documented prior bite history, liability may be difficult to prove. Values below assume liability can be established.</div>
                </div>
              )}

              {/* Settlement Range */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
                {[
                  { label:"Conservative", val:result.low,  color:C.textSoft, sub:"Early offer / adjuster", m:result.mLow  },
                  { label:"Probable Range",val:result.mid, color:C.accent,   sub:"Likely settlement", hl:true, m:result.mMid  },
                  { label:"Strong Case",  val:result.high, color:C.green,   sub:"Trial / max demand", m:result.mHigh },
                ].map(r => (
                  <div key={r.label} style={{ padding:18, borderRadius:12, border:"1px solid", borderColor:r.hl?C.accentBorder:C.border, background:r.hl?C.accentSoft:C.surface2, textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textSoft, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7 }}>{r.label}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:r.color, fontFamily:"'Cormorant Garamond', serif" }}>{fmt(r.val)}</div>
                    <div style={{ fontSize:11, color:C.textSoft, marginTop:3 }}>{r.m.toFixed(1)}x multiplier</div>
                    <div style={{ fontSize:11, color:C.textSoft, marginTop:1 }}>{r.sub}</div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.textSoft, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>Damage Breakdown</div>
                {[
                  ["Medical Bills (Gross)", parseFloat(data.totalMedBills)||0],
                  ["Future Medical Costs",  data.futureMedExpected==="yes"?parseFloat(data.futureMedAmount)||0:0],
                  ["Lost Wages (Verified)", parseFloat(data.exactLostWages)||0],
                ].filter(([,v])=>v>0).map(([label,val])=>(
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, color:C.textMid }}>{label}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{fmt(val)}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Total Economic Damages</span>
                  <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{fmt(result.totalEcon)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:14, color:C.textMid }}>Pain & Suffering Multiplier (mid)</span>
                  <span style={{ fontSize:14, fontWeight:600, color:C.accent }}>{result.mMid.toFixed(1)}x gross medicals</span>
                </div>
                {data.locationAnalysis && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, color:C.textMid }}>AI Location Weight ({data.locationAnalysis.coverageLabel})</span>
                    <span style={{ fontSize:14, fontWeight:600, color: result.locWeight>=1.2?C.green:result.locWeight<=0.8?C.accent:C.gold }}>{result.locWeight.toFixed(2)}x</span>
                  </div>
                )}
                {data.hasScarring==="yes" && data.scarLocation && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, color:C.textMid }}>Scar Location Premium</span>
                    <span style={{ fontSize:14, fontWeight:600, color:C.accent }}>{SCAR_LOCATIONS.find(s=>s.value===data.scarLocation)?.label} — {parseInt(data.victimAge)<18?"child":"adult"} rate</span>
                  </div>
                )}
                {data.nerveInjury==="yes" && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, color:C.textMid }}>Nerve Injury Premium</span>
                    <span style={{ fontSize:14, fontWeight:600, color:C.accent }}>↑ applied</span>
                  </div>
                )}
                {data.plasticSurgery==="yes" && (
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:14, color:C.textMid }}>Plastic Surgery Premium</span>
                    <span style={{ fontSize:14, fontWeight:600, color:C.accent }}>↑ applied</span>
                  </div>
                )}

                {/* Punitive Damages Section */}
                {data.priorBiteHistory==="yes" && (() => {
                  const p = result.punitive;
                  return (
                    <div style={{ marginTop:16, padding:"14px 16px", background: p.available===false?"rgba(100,100,100,0.06)": p.available==="limited"?"rgba(217,119,6,0.07)":"rgba(29,111,164,0.07)", border:`1px solid ${p.available===false?"#d0d0d0": p.available==="limited"?"rgba(217,119,6,0.3)":"rgba(29,111,164,0.25)"}`, borderRadius:10 }}>
                      <div style={{ fontSize:13, fontWeight:700, color: p.available===false?"#888": p.available==="limited"?C.amber:C.blue, marginBottom:4 }}>
                        {p.available===false?"🚫 Punitive Damages NOT Available":p.available==="limited"?"⚠️ Punitive Damages Severely Limited":"⚡ Punitive Damages — Potentially Available"}
                      </div>
                      <div style={{ fontSize:13, color:C.textMid }}>{p.note}</div>
                      {p.available===true && <div style={{ fontSize:12, color:C.textSoft, marginTop:6 }}>Prior bite history documented — consult attorney regarding punitive exposure if owner failed to take corrective action after the prior incident.</div>}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Flags */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 34px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.textSoft, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>⚠️ Key Flags to Review</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {[
                  result.law?.liability==="negligence" && data.priorBiteHistory!=="yes" && `⚠️ One-bite rule state (${data.state}) — no documented prior bite history. Liability proof required through other evidence of owner knowledge.`,
                  data.ownerKnown==="no" && "🔍 Dog owner not identified — recovery may be severely limited without an identifiable defendant.",
                  data.provocation==="yes" && "⚠️ Alleged provocation — primary defense. Can reduce or eliminate recovery. Children held to lower standard.",
                  data.nerveInjury==="yes" && "⚡ Nerve damage documented — permanent functional loss is a high-value injury and may affect long-term earning capacity.",
                  data.plasticSurgery==="yes" && "🔬 Plastic surgery performed — significantly strengthens non-economic damage value and demonstrates severity.",
                  data.plasticSurgeryFuture==="yes" && "🔬 Future plastic surgery anticipated — creates ongoing economic damages and reinforces permanency of injuries.",
                  data.hasScarring==="yes" && data.scarLocation==="face" && parseInt(data.victimAge)<18 && "🔴 HIGHEST VALUE: Facial scarring on a minor — jury awards frequently reach six to seven figures in severe cases.",
                  data.hasScarring==="yes" && data.scarLocation==="face" && parseInt(data.victimAge)>=18 && "🔴 Facial scarring documented — highest visibility scar location, substantial non-economic value.",
                  data.hasScarring==="yes" && data.scarLocation==="hands" && "✋ Hand/finger scarring — both visible and functionally impairing. Evaluate nerve damage and grip strength.",
                  data.priorBiteHistory==="yes" && result.punitive?.available===true && "💥 Prior bite history + strict liability state — evaluate punitive damages if owner failed to act after prior incident.",
                  data.priorBiteHistory==="yes" && result.punitive?.available===false && `🚫 Prior bite history present but punitive damages are NOT available in ${data.state}.`,
                  data.psychPermanent==="yes" && "🧠 Permanent psychological injury — may exceed physical damages. Consider life care plan for ongoing therapy costs.",
                  data.rabiesVaccine==="yes" && "💉 Rabies vaccine series required — document each injection date and side effects as independent trauma damages.",
                  data.location==="apartment_complex" && data.locationAnalysis && `🏢 ${data.locationAnalysis.analysis?.split(".")[0]}.`,
                  data.location==="business" && "🏪 Business location — pursue premises liability and negligent security claims against the business entity in addition to the dog owner.",
                  data.dogVaccinated==="no" && "⚕️ Dog was not vaccinated — supports negligence claim and strengthens additional damages.",
                  data.surgeriesRecommended==="yes" && "🔪 Surgery recommended but not yet performed — strongly consider completing prior to settlement.",
                  data.missedWork==="yes" && (!data.exactLostWages || parseFloat(data.exactLostWages)===0) && "💵 Missed work indicated but $0 wages entered — obtain paystubs or employer verification.",
                ].filter(Boolean).map((flag,i)=>(
                  <div key={i} style={{ padding:"9px 13px", background:C.surface2, borderRadius:8, fontSize:13, color:C.textMid, border:`1px solid ${C.border}`, lineHeight:1.5 }}>{flag}</div>
                ))}
              </div>
              <div style={{ marginTop:18, padding:"13px 15px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, fontSize:12, color:C.textSoft, lineHeight:1.6 }}>
                <strong style={{ color:C.gold }}>Disclaimer:</strong> {window.dbcAjax?.disclaimer || 'This tool provides an educational estimate only. It does not constitute legal advice. Actual settlement value depends on jurisdiction-specific jury verdicts, quality of documentation, liability evidence, insurance availability, and attorney skill. Always consult a licensed personal injury attorney before making any settlement decision.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
