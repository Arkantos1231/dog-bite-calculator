/**
 * Dog Bite Settlement Calculator — Vanilla JS (WordPress-compatible)
 * 10-step multi-step form with lead gate and AI analysis
 */
(function () {
  'use strict';

  /* ========== DOG BITE LAW DATA ========== */

  var DOG_BITE_LAWS = {
    'Alabama':         { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable only if they knew or should have known the dog was dangerous.' },
    'Alaska':          { system: 'Strict Liability',          liability: 'strict',     note: 'Owner strictly liable for bites in public or lawfully on private property.' },
    'Arizona':         { system: 'Strict Liability',          liability: 'strict',     note: 'Owner strictly liable regardless of prior knowledge. ARS §11-1025.' },
    'Arkansas':        { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable if they had prior knowledge of dangerous propensity.' },
    'California':      { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability regardless of prior knowledge. Civil Code §3342.' },
    'Colorado':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability for serious bodily injury. CRS §13-21-124.' },
    'Connecticut':     { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability regardless of prior knowledge or viciousness.' },
    'Delaware':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability for bites in public or lawfully on private property.' },
    'Florida':         { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability. §767.04. Comparative negligence applies.' },
    'Georgia':         { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable if they had knowledge of vicious propensity and victim was not at fault.' },
    'Hawaii':          { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability for dog bites.' },
    'Idaho':           { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable based on negligence and prior knowledge of dangerous tendencies.' },
    'Illinois':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability. Animal Control Act §16. No prior knowledge required.' },
    'Indiana':         { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under IC 15-20-1-3.' },
    'Iowa':            { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Iowa Code §351.28.' },
    'Kansas':          { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under KSA §47-646.' },
    'Kentucky':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under KRS §258.235.' },
    'Louisiana':       { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Civil Code Art. 2321.' },
    'Maine':           { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under 7 MRS §3961.' },
    'Maryland':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability — presumption of knowledge of vicious propensity.' },
    'Massachusetts':   { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under MGL c.140 §155. No prior knowledge required.' },
    'Michigan':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under MCL §287.351.' },
    'Minnesota':       { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Minn. Stat. §347.22.' },
    'Mississippi':     { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable based on negligence and prior knowledge.' },
    'Missouri':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Mo. Rev. Stat. §273.036.' },
    'Montana':         { system: 'One-Bite Rule',            liability: 'negligence', note: 'Negligence standard — prior knowledge required.' },
    'Nebraska':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Neb. Rev. Stat. §54-601.' },
    'Nevada':          { system: 'One-Bite Rule',            liability: 'negligence', note: 'Negligence and prior knowledge (scienter) required.' },
    'New Hampshire':   { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under RSA 466:19.' },
    'New Jersey':      { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under NJSA 4:19-16.' },
    'New Mexico':      { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under NMSA §77-1-3.' },
    'New York':        { system: 'One-Bite Rule',            liability: 'negligence', note: "Owner liable only if they knew of the dog's vicious propensity. Prior bite history is essential." },
    'North Carolina':  { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability for dangerous dogs under NCGS §67-4.4.' },
    'North Dakota':    { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under NDCC §42-03-01.' },
    'Ohio':            { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under ORC §955.28. Comparative negligence applies.' },
    'Oklahoma':        { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under 4 OS §42.1.' },
    'Oregon':          { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under ORS §31.360.' },
    'Pennsylvania':    { system: 'Mixed — Strict/Negligence', liability: 'mixed',      note: 'Strict liability limited to medical costs on first bite. Full damages if owner knew of viciousness.' },
    'Rhode Island':    { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under RIGL §4-13-16.' },
    'South Carolina':  { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under SC Code §47-3-110.' },
    'South Dakota':    { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under SDCL §40-34-1.' },
    'Tennessee':       { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under TCA §44-8-413.' },
    'Texas':           { system: 'One-Bite Rule',            liability: 'negligence', note: "Owner liable if they knew of the dog's dangerous propensity." },
    'Utah':            { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under UCA §18-1-1.' },
    'Vermont':         { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under 20 VSA §3452.' },
    'Virginia':        { system: 'One-Bite Rule',            liability: 'negligence', note: 'Owner liable only if they had prior knowledge of dangerous propensity.' },
    'Washington':      { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under RCW §16.08.040.' },
    'Washington D.C.': { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability — owner liable regardless of prior knowledge.' },
    'West Virginia':   { system: 'One-Bite Rule',            liability: 'negligence', note: 'Negligence standard with scienter requirement.' },
    'Wisconsin':       { system: 'Strict Liability',          liability: 'strict',     note: 'Strict liability under Wis. Stat. §174.02. Double damages possible on second bite.' },
    'Wyoming':         { system: 'One-Bite Rule',            liability: 'negligence', note: 'Negligence standard — prior knowledge of viciousness required.' },
  };

  var PUNITIVE_RULES = {
    'Nebraska':      { available: false,     note: 'Punitive damages are unconstitutional under Nebraska law.' },
    'Washington':    { available: false,     note: 'Punitive damages are generally not recoverable in Washington tort cases.' },
    'Massachusetts': { available: false,     note: 'Punitive damages not available in personal injury in MA (only wrongful death under specific statutes).' },
    'Michigan':      { available: 'limited', note: 'Punitive damages very limited in Michigan — courts generally award actual damages only.' },
    'Louisiana':     { available: true,      note: 'Punitive damages available only for DWI-related injuries under CC Art. 2315.4; limited in standard dog bite.' },
    'Oregon':        { available: true,      note: 'Punitive damages available but capped. Clear and convincing evidence of malice or reckless indifference required.' },
    'Colorado':      { available: true,      note: 'Punitive damages capped at amount of actual damages. Clear and convincing evidence required. CRS §13-21-102.' },
    'Florida':       { available: true,      note: 'Punitive damages available. Must prove intentional misconduct or gross negligence. §768.72.' },
    'Kansas':        { available: true,      note: 'Punitive damages available but capped. Wanton conduct required.' },
    'Illinois':      { available: true,      note: 'Punitive damages available for willful and wanton conduct.' },
    'Texas':         { available: true,      note: 'Exemplary damages available. Requires malice, fraud, or gross negligence. Capped under CPRC §41.008.' },
    'Georgia':       { available: true,      note: 'Punitive damages available for willful misconduct, fraud, malice, or wanton conduct. Capped at $250,000 in most cases.' },
    'Nevada':        { available: true,      note: "Punitive damages available for oppression, fraud, or malice. Caps apply based on defendant's net worth." },
  };

  function getPunitiveRule(stateName) {
    return PUNITIVE_RULES[stateName] || { available: true, note: 'Punitive damages generally available upon clear and convincing evidence of willful, wanton, or reckless conduct by the owner.' };
  }

  var SCAR_LOCATIONS = [
    { value: 'face',  label: 'Face / Head',    icon: '😶', baseBonus: 3.0,  childBonus: 5.0  },
    { value: 'neck',  label: 'Neck',            icon: '🔴', baseBonus: 2.0,  childBonus: 3.5  },
    { value: 'hands', label: 'Hands / Fingers', icon: '✋', baseBonus: 1.5,  childBonus: 2.5  },
    { value: 'arms',  label: 'Arms',            icon: '💪', baseBonus: 1.0,  childBonus: 1.75 },
    { value: 'legs',  label: 'Legs',            icon: '🦵', baseBonus: 0.75, childBonus: 1.25 },
    { value: 'torso', label: 'Torso / Covered', icon: '👕', baseBonus: 0.5,  childBonus: 0.75 },
  ];

  var US_STATES = Object.keys(DOG_BITE_LAWS).sort();

  var LOCATION_OPTIONS_EN = [
    { key: 'private_residence', label: 'Private residence (house)',      icon: '🏠' },
    { key: 'apartment_complex', label: 'Apartment complex',               icon: '🏢' },
    { key: 'business',          label: 'Business or commercial location', icon: '🏪' },
    { key: 'public_park',       label: 'Public park or street',           icon: '🌳' },
    { key: 'other',             label: 'Other',                           icon: '📍' },
  ];

  var LOCATION_OPTIONS_ES = [
    { key: 'private_residence', label: 'Residencia privada (casa)',       icon: '🏠' },
    { key: 'apartment_complex', label: 'Complejo de apartamentos',        icon: '🏢' },
    { key: 'business',          label: 'Negocio o local comercial',       icon: '🏪' },
    { key: 'public_park',       label: 'Parque público o calle',          icon: '🌳' },
    { key: 'other',             label: 'Otro',                            icon: '📍' },
  ];

  /* ========== TRANSLATIONS ========== */

  var TRANSLATIONS = {
    en: {
      steps: [
        { id: 1,  label: 'Jurisdiction', icon: '⚖️' },
        { id: 2,  label: 'Location',     icon: '📍' },
        { id: 3,  label: 'Incident',     icon: '🐕' },
        { id: 4,  label: 'Dog & Owner',  icon: '🏷️' },
        { id: 5,  label: 'Injuries',     icon: '🩹' },
        { id: 6,  label: 'Medical $',    icon: '🏥' },
        { id: 7,  label: 'Scarring',     icon: '🔴' },
        { id: 8,  label: 'Psychology',   icon: '🧠' },
        { id: 9,  label: 'Impact',       icon: '💼' },
      ],
      question_of: 'QUESTION {n} OF {total}',
      back: '← Back', continue: 'Continue →', calculate: 'Calculate Value ⚖️',
      see_results: 'See My Results ⚖️', edit: '← Edit', contact_info: 'CONTACT INFO',
      lead_title: 'Almost There!',
      lead_desc: 'Enter your contact info to receive your personalized settlement estimate and AI case analysis.',
      full_name: 'Full Name', email_label: 'Email Address', phone_label: 'Phone Number',
      consent: 'By submitting, you consent to being contacted about your case. We do not sell your information.',
      step1_title: 'Jurisdiction & Date',
      step1_desc: 'State law determines whether strict liability or the one-bite rule applies — this governs the entire liability analysis.',
      state_label: 'State where bite occurred',
      accident_date: 'Date of incident',
      step2_title: 'Location of Incident',
      step2_desc: 'Location determines available insurance coverage and potential defendants — this is AI-analyzed for your specific state.',
      location_label: 'Where did the bite occur?',
      location_loading: 'Analyzing insurance landscape for',
      location_no_state: '⚠️ Select a state on Step 1 first to enable AI insurance analysis for this location.',
      location_coverage: 'Typical Coverage', location_weight: 'Value Weight',
      location_defendants: 'Additional defendants to evaluate:',
      location_risk_low: 'Lower Recovery Risk', location_risk_medium: 'Moderate Recovery', location_risk_high: 'Strong Recovery',
      step3_title: 'Incident Description',
      step3_desc: 'Victim age and a clear account of the attack are both critical to establishing liability and valuing the claim.',
      victim_age: "Victim's age at time of incident", victim_age_ph: 'e.g. 8',
      child_warning: '👦 Child victim — significantly elevated damage value. Scarring and psychological injuries carry substantially higher jury awards for minors.',
      incident_desc: 'Describe exactly what happened',
      incident_ph: "e.g. Victim was walking past neighbor's yard when dog charged through an open gate and bit the victim on the left arm and face without warning.",
      provocation_label: 'Was the victim provoking the dog at the time of the attack?',
      provocation_warning: '⚠️ Provocation is the primary defense in all dog bite cases. It can reduce or eliminate recovery depending on the state. Children are held to a lower provocation standard than adults.',
      prov_no: 'No', prov_yes: 'Yes', prov_disputed: 'Disputed',
      step4_title: 'The Dog & Owner',
      step4_desc: 'Prior bite history is the most important liability fact in one-bite rule states — and supports punitive damages everywhere.',
      dog_breed: 'Dog breed', dog_breed_ph: 'e.g. German Shepherd, Pit Bull Terrier, Rottweiler',
      owner_known: 'Is the dog owner known and identifiable?',
      prior_bite: 'Does the dog have a prior bite history or known aggressive behavior?',
      prior_bite_warning: '⚠️ Prior bite history establishes owner knowledge — critical for one-bite rule states. In all states, prior history supports enhanced damages and may trigger punitive damage exposure where available.',
      dog_vaccinated: 'Was the dog vaccinated?',
      yes: 'Yes', no: 'No', unknown: 'Unknown',
      step5_title: 'Injuries',
      step5_desc: 'Document every injury precisely — number of bites, locations, wound types, and any functional damage are all separate value drivers.',
      injury_desc: 'Describe all injuries in detail',
      injury_ph: 'e.g. Three deep puncture wounds to left forearm, two lacerations to face near jaw, avulsed skin on right hand, significant bruising from fall during attack.',
      stitch_count: 'How many stitches or staples were required? (if known)',
      stitch_none: 'None / 0', stitch_low: '1–5', stitch_mid: '6–15', stitch_high: '16+',
      nerve_injury: 'Is there nerve damage or nerve injury?', nerve_being_eval: 'Being evaluated',
      nerve_desc: 'Describe the nerve injury and any functional loss',
      nerve_ph: 'e.g. Radial nerve damage to right hand — permanent reduced grip strength, numbness in thumb and index finger.',
      nerve_warning: '⚡ Nerve damage is a high-value injury — especially when permanent. Functional loss to hands significantly impacts earning capacity and daily life.',
      rabies_vaccine: 'Was the rabies vaccine series required?',
      rabies_warning: '💉 The rabies vaccine series (4–5 painful injections over 14 days) is a recognized source of additional physical trauma and psychological distress and increases case value.',
      step6_title: 'Medical Treatment & Bills',
      step6_desc: 'Use the gross billed amount — not what insurance paid or adjusted. This is the multiplier base.',
      er_treatment: 'Was the victim treated at an ER or urgent care?',
      surgeries_performed: 'Any surgeries performed? (debridement, wound closure, reconstructive)',
      surgeries_recommended: 'Any non-cosmetic surgeries recommended but not yet performed?',
      plastic_surgery_section: 'Plastic & Reconstructive Surgery',
      plastic_surgery: 'Was plastic or reconstructive surgery performed?',
      plastic_surgery_desc: 'Describe the plastic/reconstructive procedures performed',
      plastic_surgery_ph: 'e.g. Facial laceration repair with plastic surgeon, skin graft to right forearm, scar revision surgery 6 months post-injury.',
      plastic_future: 'Is future plastic surgery or scar revision anticipated?',
      plastic_future_opt: 'Under evaluation',
      plastic_warning: '🔬 Plastic surgery — especially to the face — is one of the strongest value drivers in dog bite cases. Future scar revision procedures create ongoing economic damages and demonstrate the permanent nature of the injury.',
      med_bills: 'Total medical bills to date — GROSS billed ($)',
      future_med: 'Are future medical expenses anticipated?', future_med_cost: 'Estimated future medical costs ($)',
      step7_title: 'Scarring & Disfigurement',
      step7_desc: 'Scarring is a standalone damage category. Visibility is the primary value driver — facial scarring on a child can exceed all other damages combined.',
      has_scarring: 'Is there permanent scarring or disfigurement?', scar_too_early: 'Too early to determine',
      scar_location_label: 'Location(s) of scarring — select all that apply',
      scar_face_child_warning: '🔴 Facial scarring on a minor — this is the highest-value damage category in dog bite litigation. Jury awards for permanent facial disfigurement in children frequently reach six to seven figures regardless of medical bills.',
      scar_desc: 'Describe the scar(s) in as much detail as possible',
      scar_desc_ph: 'e.g. About 4 inches long on my forearm, raised and purple/red, very noticeable in short sleeves. It feels tight when I bend my arm.\n\nConsider including:\n• Approximate size (length/width)\n• Color (red, purple, pink, white/faded, dark)\n• Texture (flat, raised, lumpy, indented, keloid)\n• Is it visible in normal daily clothing?\n• Does it cause physical symptoms (tightness, itching, pain)?',
      scar_impact: 'How does the scar make you feel or affect your daily life?',
      scar_impact_ph: 'e.g. I avoid wearing short sleeves, I hate looking in the mirror, my kids ask questions about it, I turned down a job interview.\n\nConsider including:\n• Do you avoid certain clothing, activities, or social situations because of it?\n• Have you noticed changes in confidence or how you feel about your appearance?\n• Has anyone (partner, employer, strangers) made comments about it?',
      step8_title: 'Psychological Impact',
      step8_desc: 'Psychological injuries are often the most valuable component — particularly cynophobia and PTSD in children, which can last a lifetime.',
      psych_effects: 'Describe any psychological effects (fear of dogs, PTSD, anxiety, depression, nightmares)',
      psych_ph: 'e.g. Victim developed severe cynophobia, refuses to go outside, nightmares 3-4x weekly, withdrawn from school activities, diagnosed with PTSD.',
      in_therapy: 'Did the victim attend therapy or psychological treatment?',
      psych_permanent: 'Has a treating provider indicated the psychological injuries are permanent?',
      psych_perm_yes: 'Yes — permanent', psych_perm_no: 'No / expected to resolve', psych_perm_unknown: 'Not yet determined',
      psych_perm_warning: '📌 Permanent psychological injury — especially in children — often becomes the single largest damage category, surpassing all physical damages.',
      step9_title: 'MMI Status',
      step9_desc: 'Physical MMI anchors when the full damage picture is known and a demand can be made with confidence.',
      at_mmi: 'Has the victim reached MMI for physical injuries?',
      at_mmi_yes: 'Yes — reached MMI', at_mmi_no: 'No — still treating (2+ years post-incident)',
      permanent_rating: 'Is there a permanent impairment rating on file?',
      ongoing_treatment: 'Describe ongoing physical treatment',
      ongoing_ph: 'e.g. Monthly wound care, PT twice weekly, awaiting scar revision surgery consultation.',
      step10_title: 'Life Disruption & Lost Wages',
      step10_desc: 'Document the full human and economic toll of the attack — daily life impact and permanency are critical to non-economic damages.',
      life_impact: 'How has the incident affected daily life, activities, sleep, and relationships?',
      life_impact_ph: 'e.g. Cannot take children to the park, avoids outdoor activities, quit youth sports coaching, wakes with nightmares, marriage strained.',
      perm_limits: 'Permanent limitations documented by a physician or therapist, if any',
      perm_ph: 'e.g. Therapist states victim will require lifelong treatment for cynophobia; orthopedist notes permanent reduced grip strength.',
      missed_work: 'Did the victim miss work due to the attack?',
      occupation: 'Occupation / Job Title', lost_income: 'Total lost wages — exact verified amount ($)',
      loss_capacity: 'Has the injury affected long-term earning capacity?',
      settlement_analysis: 'Settlement Analysis',
      conservative: 'Conservative', probable: 'Probable Range', strong: 'Strong Case',
      low_sub: 'Early offer / adjuster', mid_sub: 'Likely settlement', high_sub: 'Trial / max demand',
      multiplier_label: 'multiplier',
      damage_breakdown: 'Damage Breakdown',
      med_bills_gross: 'Medical Bills (Gross)', future_medical: 'Future Medical Costs', lost_wages_label: 'Lost Wages (Verified)',
      total_economic: 'Total Economic Damages', ps_multiplier: 'Pain & Suffering Multiplier (mid)',
      loc_weight_label: 'AI Location Weight', scar_premium_label: 'Scar Location Premium',
      nerve_premium_label: 'Nerve Injury Premium', plastic_premium_label: 'Plastic Surgery Premium',
      punitive_not_available: '🚫 Punitive Damages NOT Available',
      punitive_limited: '⚠️ Punitive Damages Severely Limited',
      punitive_available: '⚡ Punitive Damages — Potentially Available',
      punitive_consult: 'Prior bite history documented — consult attorney regarding punitive exposure if owner failed to take corrective action after the prior incident.',
      one_bite_warning_title: '⚠️ One-Bite Rule State — Liability Must Be Established',
      one_bite_warning_desc: ' requires proof the owner knew of the dog\'s dangerous propensity. Without documented prior bite history, liability may be difficult to prove. Values below assume liability can be established.',
      ai_analysis: '🤖 AI Case Analysis', ai_generating: 'Generating analysis...',
      flags_title: '⚠️ Key Flags to Review', disclaimer_label: 'Disclaimer',
      header_title: 'Dog Bite Settlement Calculator',
      header_sub: 'Personal Injury · Animal Attack Valuation · AI-Powered Insurance Analysis',
      disclaimer_short: 'DISCLAIMER', disclaimer_sub: 'Educational only. Not legal advice.',
      flag_one_bite: '⚠️ One-bite rule state — no documented prior bite history. Liability proof required through other evidence of owner knowledge.',
      flag_owner_unknown: '🔍 Dog owner not identified — recovery may be severely limited without an identifiable defendant.',
      flag_provocation: '⚠️ Alleged provocation — primary defense. Can reduce or eliminate recovery. Children held to lower standard.',
      flag_nerve: '⚡ Nerve damage documented — permanent functional loss is a high-value injury and may affect long-term earning capacity.',
      flag_plastic: '🔬 Plastic surgery performed — significantly strengthens non-economic damage value and demonstrates severity.',
      flag_plastic_future: '🔬 Future plastic surgery anticipated — creates ongoing economic damages and reinforces permanency of injuries.',
      flag_face_child: '🔴 HIGHEST VALUE: Facial scarring on a minor — jury awards frequently reach six to seven figures in severe cases.',
      flag_face_adult: '🔴 Facial scarring documented — highest visibility scar location, substantial non-economic value.',
      flag_hands: '✋ Hand/finger scarring — both visible and functionally impairing. Evaluate nerve damage and grip strength.',
      flag_punitive_avail: '💥 Prior bite history + available punitive damages — evaluate punitive exposure if owner failed to act after prior incident.',
      flag_punitive_not: '🚫 Prior bite history present but punitive damages are NOT available in this state.',
      flag_psych_perm: '🧠 Permanent psychological injury — may exceed physical damages. Consider life care plan for ongoing therapy costs.',
      flag_rabies: '💉 Rabies vaccine series required — document each injection date and side effects as independent trauma damages.',
      flag_apartment: "🏢 Apartment complex — renter's insurance often absent or low limits. Evaluate landlord liability separately.",
      flag_business: '🏪 Business location — pursue premises liability and negligent security claims against the business entity in addition to the dog owner.',
      flag_unvaccinated: '⚕️ Dog was not vaccinated — supports negligence claim and strengthens additional damages.',
      flag_surgery_pending: '🔪 Surgery recommended but not yet performed — strongly consider completing prior to settlement.',
      flag_wages_missing: '💵 Missed work indicated but $0 wages entered — obtain paystubs or employer verification.',
    },

    es: {
      steps: [
        { id: 1,  label: 'Jurisdicción', icon: '⚖️' },
        { id: 2,  label: 'Lugar',        icon: '📍' },
        { id: 3,  label: 'Incidente',    icon: '🐕' },
        { id: 4,  label: 'Perro/Dueño', icon: '🏷️' },
        { id: 5,  label: 'Lesiones',     icon: '🩹' },
        { id: 6,  label: 'Médico $',     icon: '🏥' },
        { id: 7,  label: 'Cicatrices',   icon: '🔴' },
        { id: 8,  label: 'Psicología',   icon: '🧠' },
        { id: 9,  label: 'Impacto',      icon: '💼' },
      ],
      question_of: 'PREGUNTA {n} DE {total}',
      back: '← Atrás', continue: 'Continuar →', calculate: 'Calcular Valor ⚖️',
      see_results: 'Ver Mis Resultados ⚖️', edit: '← Editar', contact_info: 'DATOS DE CONTACTO',
      lead_title: '¡Casi Listo!',
      lead_desc: 'Ingresa tu información de contacto para recibir tu estimado personalizado y análisis de caso con IA.',
      full_name: 'Nombre Completo', email_label: 'Correo Electrónico', phone_label: 'Número de Teléfono',
      consent: 'Al enviar, consientes ser contactado sobre tu caso. No vendemos tu información.',
      step1_title: 'Jurisdicción y Fecha',
      step1_desc: 'La ley estatal determina si aplica responsabilidad estricta o la regla de la primera mordida.',
      state_label: 'Estado donde ocurrió la mordida', accident_date: 'Fecha del incidente',
      step2_title: 'Lugar del Incidente',
      step2_desc: 'El lugar determina la cobertura de seguro disponible y los posibles demandados — analizado con IA.',
      location_label: '¿Dónde ocurrió la mordida?',
      location_loading: 'Analizando panorama de seguros para',
      location_no_state: '⚠️ Selecciona un estado en el Paso 1 primero para habilitar el análisis de seguros con IA.',
      location_coverage: 'Cobertura Típica', location_weight: 'Peso de Valor',
      location_defendants: 'Demandados adicionales a evaluar:',
      location_risk_low: 'Menor Riesgo de Recuperación', location_risk_medium: 'Recuperación Moderada', location_risk_high: 'Recuperación Sólida',
      step3_title: 'Descripción del Incidente',
      step3_desc: 'La edad de la víctima y un relato claro del ataque son críticos para establecer responsabilidad.',
      victim_age: 'Edad de la víctima al momento del incidente', victim_age_ph: 'Ej: 8',
      child_warning: '👦 Víctima menor de edad — valor de daños significativamente elevado. Cicatrices y lesiones psicológicas tienen valores de jurado sustancialmente mayores en menores.',
      incident_desc: 'Describe exactamente lo que ocurrió',
      incident_ph: 'Ej: La víctima caminaba frente al jardín del vecino cuando el perro cruzó por una puerta abierta y mordió a la víctima en el brazo izquierdo y la cara sin advertencia.',
      provocation_label: '¿Estaba la víctima provocando al perro al momento del ataque?',
      provocation_warning: '⚠️ La provocación es la defensa principal en todos los casos de mordida de perro. Puede reducir o eliminar la recuperación. Los niños tienen un estándar de provocación más bajo.',
      prov_no: 'No', prov_yes: 'Sí', prov_disputed: 'En disputa',
      step4_title: 'El Perro y el Dueño',
      step4_desc: 'El historial previo de mordidas es el hecho de responsabilidad más importante en estados con regla de primera mordida.',
      dog_breed: 'Raza del perro', dog_breed_ph: 'Ej: Pastor Alemán, Pit Bull Terrier, Rottweiler',
      owner_known: '¿Es el dueño del perro conocido e identificable?',
      prior_bite: '¿Tiene el perro historial previo de mordidas o comportamiento agresivo conocido?',
      prior_bite_warning: '⚠️ El historial previo de mordidas establece el conocimiento del dueño — crítico en estados con regla de primera mordida.',
      dog_vaccinated: '¿Estaba el perro vacunado?',
      yes: 'Sí', no: 'No', unknown: 'Desconocido',
      step5_title: 'Lesiones',
      step5_desc: 'Documenta cada lesión con precisión — número de mordidas, ubicaciones y daño funcional son factores de valor separados.',
      injury_desc: 'Describe todas las lesiones en detalle',
      injury_ph: 'Ej: Tres heridas punzantes profundas en el antebrazo izquierdo, dos laceraciones en la cara cerca de la mandíbula.',
      stitch_count: '¿Cuántos puntos o grapas fueron necesarios? (si se sabe)',
      stitch_none: 'Ninguno / 0', stitch_low: '1–5', stitch_mid: '6–15', stitch_high: '16+',
      nerve_injury: '¿Hay daño nervioso o lesión nerviosa?', nerve_being_eval: 'En evaluación',
      nerve_desc: 'Describe la lesión nerviosa y cualquier pérdida funcional',
      nerve_ph: 'Ej: Daño al nervio radial en la mano derecha — fuerza de agarre reducida permanentemente.',
      nerve_warning: '⚡ El daño nervioso es una lesión de alto valor — especialmente cuando es permanente.',
      rabies_vaccine: '¿Se requirió la serie de vacuna antirrábica?',
      rabies_warning: '💉 La serie de vacuna antirrábica (4–5 inyecciones dolorosas durante 14 días) es una fuente reconocida de trauma físico adicional.',
      step6_title: 'Tratamiento Médico y Facturas',
      step6_desc: 'Usa el monto bruto facturado — no lo que pagó el seguro. Este es la base del multiplicador.',
      er_treatment: '¿Fue la víctima tratada en urgencias o cuidado urgente?',
      surgeries_performed: '¿Se realizaron cirugías? (desbridamiento, cierre de heridas, reconstructiva)',
      surgeries_recommended: '¿Hay cirugías no cosméticas recomendadas pero aún no realizadas?',
      plastic_surgery_section: 'Cirugía Plástica y Reconstructiva',
      plastic_surgery: '¿Se realizó cirugía plástica o reconstructiva?',
      plastic_surgery_desc: 'Describe los procedimientos plásticos/reconstructivos realizados',
      plastic_surgery_ph: 'Ej: Reparación de laceración facial con cirujano plástico, injerto de piel en antebrazo derecho.',
      plastic_future: '¿Se anticipa cirugía plástica futura o revisión de cicatriz?',
      plastic_future_opt: 'En evaluación',
      plastic_warning: '🔬 La cirugía plástica — especialmente en el rostro — es uno de los factores de valor más fuertes en casos de mordida de perro.',
      med_bills: 'Total de facturas médicas hasta la fecha — BRUTO ($)',
      future_med: '¿Se anticipan gastos médicos futuros?', future_med_cost: 'Costos médicos futuros estimados ($)',
      step7_title: 'Cicatrices y Desfiguración',
      step7_desc: 'Las cicatrices son una categoría de daños independiente. La visibilidad es el principal factor de valor.',
      has_scarring: '¿Hay cicatrices permanentes o desfiguración?', scar_too_early: 'Demasiado pronto para determinar',
      scar_location_label: 'Ubicación(es) de las cicatrices — selecciona todas las que apliquen',
      scar_face_child_warning: '🔴 Cicatriz facial en un menor — esta es la categoría de daños de mayor valor en litigios de mordida de perro.',
      scar_desc: 'Describe las cicatriz(ces) con el mayor detalle posible',
      scar_desc_ph: 'Ej: Aproximadamente 10 cm en mi antebrazo, elevada y de color púrpura/roja, muy notoria con manga corta. Se siente apretada cuando doblo el brazo.\n\nConsidera incluir:\n• Tamaño aproximado (largo/ancho)\n• Color (roja, morada, rosada, blanca/desvanecida, oscura)\n• Textura (plana, elevada, abultada, hundida, queloide)\n• ¿Es visible con ropa normal?\n• ¿Causa síntomas físicos (tensión, picazón, dolor)?',
      scar_impact: '¿Cómo te hace sentir la cicatriz o cómo afecta tu vida diaria?',
      scar_impact_ph: 'Ej: Evito usar mangas cortas, odio verme al espejo, mis hijos preguntan al respecto, rechacé una entrevista de trabajo.\n\nConsidera incluir:\n• ¿Evitas cierta ropa, actividades o situaciones sociales por ello?\n• ¿Has notado cambios en tu confianza o cómo te sientes con tu apariencia?\n• ¿Alguien (pareja, empleador, extraños) ha hecho comentarios al respecto?',
      step8_title: 'Impacto Psicológico',
      step8_desc: 'Las lesiones psicológicas son frecuentemente el componente más valioso — especialmente la cinofobia y el PTSD en niños.',
      psych_effects: 'Describe cualquier efecto psicológico (miedo a perros, PTSD, ansiedad, depresión, pesadillas)',
      psych_ph: 'Ej: La víctima desarrolló cinofobia severa, se niega a salir, pesadillas 3-4 veces por semana, diagnosticada con PTSD.',
      in_therapy: '¿Asistió la víctima a terapia o tratamiento psicológico?',
      psych_permanent: '¿Ha indicado un proveedor de atención que las lesiones psicológicas son permanentes?',
      psych_perm_yes: 'Sí — permanente', psych_perm_no: 'No / se espera resolución', psych_perm_unknown: 'Aún no determinado',
      psych_perm_warning: '📌 La lesión psicológica permanente — especialmente en niños — a menudo se convierte en la categoría de daños más grande.',
      step9_title: 'Estado MMI',
      step9_desc: 'La MMI física determina cuándo se conoce el panorama completo de daños y se puede hacer una demanda con confianza.',
      at_mmi: '¿Ha alcanzado la víctima la MMI para lesiones físicas?',
      at_mmi_yes: 'Sí — alcanzó la MMI', at_mmi_no: 'No — aún en tratamiento (2+ años post-incidente)',
      permanent_rating: '¿Hay una calificación de discapacidad permanente en el expediente?',
      ongoing_treatment: 'Describe el tratamiento físico en curso',
      ongoing_ph: 'Ej: Cuidado de heridas mensual, fisioterapia dos veces por semana, en espera de consulta de revisión de cicatriz.',
      step10_title: 'Interrupción de Vida y Salarios Perdidos',
      step10_desc: 'Documenta el costo humano y económico completo del ataque.',
      life_impact: '¿Cómo ha afectado el incidente la vida diaria, actividades, sueño y relaciones?',
      life_impact_ph: 'Ej: No puede llevar a los hijos al parque, evita actividades al aire libre, despierta con pesadillas, matrimonio tenso.',
      perm_limits: 'Limitaciones permanentes documentadas por un médico o terapeuta, si aplica',
      perm_ph: 'Ej: El terapeuta indica que la víctima requerirá tratamiento de por vida para la cinofobia.',
      missed_work: '¿Faltó la víctima al trabajo debido al ataque?',
      occupation: 'Ocupación / Cargo', lost_income: 'Total de salarios perdidos — monto exacto verificado ($)',
      loss_capacity: '¿Ha afectado la lesión la capacidad de ganancias a largo plazo?',
      settlement_analysis: 'Análisis del Acuerdo',
      conservative: 'Conservador', probable: 'Rango Probable', strong: 'Caso Fuerte',
      low_sub: 'Oferta temprana / ajustador', mid_sub: 'Acuerdo probable', high_sub: 'Juicio / demanda máxima',
      multiplier_label: 'multiplicador',
      damage_breakdown: 'Desglose de Daños',
      med_bills_gross: 'Facturas Médicas (Bruto)', future_medical: 'Costos Médicos Futuros', lost_wages_label: 'Salarios Perdidos (Verificado)',
      total_economic: 'Total de Daños Económicos', ps_multiplier: 'Multiplicador de Dolor y Sufrimiento (medio)',
      loc_weight_label: 'Peso de Ubicación IA', scar_premium_label: 'Prima por Ubicación de Cicatriz',
      nerve_premium_label: 'Prima por Lesión Nerviosa', plastic_premium_label: 'Prima por Cirugía Plástica',
      punitive_not_available: '🚫 Daños Punitivos NO Disponibles',
      punitive_limited: '⚠️ Daños Punitivos Severamente Limitados',
      punitive_available: '⚡ Daños Punitivos — Potencialmente Disponibles',
      punitive_consult: 'Historial previo de mordidas documentado — consulte a un abogado sobre la exposición punitiva si el dueño no tomó medidas correctivas.',
      one_bite_warning_title: '⚠️ Estado con Regla de Primera Mordida — Se Debe Establecer Responsabilidad',
      one_bite_warning_desc: ' requiere prueba de que el dueño conocía la propensión peligrosa del perro. Sin historial documentado, la responsabilidad puede ser difícil de probar.',
      ai_analysis: '🤖 Análisis de Caso con IA', ai_generating: 'Generando análisis...',
      flags_title: '⚠️ Factores Clave a Revisar', disclaimer_label: 'Aviso Legal',
      header_title: 'Calculadora de Reclamo por Mordida de Perro',
      header_sub: 'Lesiones Personales · Valuación de Ataque Animal · Análisis de Seguros con IA',
      disclaimer_short: 'AVISO', disclaimer_sub: 'Solo uso educativo. No es asesoría legal.',
      flag_one_bite: '⚠️ Estado con regla de primera mordida — sin historial documentado de mordidas previas. Se requiere prueba de responsabilidad.',
      flag_owner_unknown: '🔍 Dueño del perro no identificado — la recuperación puede estar severamente limitada.',
      flag_provocation: '⚠️ Provocación alegada — defensa principal. Puede reducir o eliminar la recuperación. Los niños tienen un estándar más bajo.',
      flag_nerve: '⚡ Daño nervioso documentado — la pérdida funcional permanente es una lesión de alto valor.',
      flag_plastic: '🔬 Cirugía plástica realizada — fortalece significativamente el valor de daños no económicos.',
      flag_plastic_future: '🔬 Cirugía plástica futura anticipada — crea daños económicos continuos y refuerza la permanencia.',
      flag_face_child: '🔴 MAYOR VALOR: Cicatriz facial en un menor — los veredictos de jurado frecuentemente alcanzan seis o siete cifras.',
      flag_face_adult: '🔴 Cicatriz facial documentada — ubicación de cicatriz con mayor visibilidad, valor no económico sustancial.',
      flag_hands: '✋ Cicatrices en manos/dedos — visibles y funcionalmente limitantes. Evalúe daño nervioso y fuerza de agarre.',
      flag_punitive_avail: '💥 Historial previo de mordidas + daños punitivos disponibles — evalúe la exposición punitiva si el dueño no actuó.',
      flag_punitive_not: '🚫 Historial previo de mordidas presente pero los daños punitivos NO están disponibles en este estado.',
      flag_psych_perm: '🧠 Lesión psicológica permanente — puede superar los daños físicos. Considere un plan de cuidado de vida.',
      flag_rabies: '💉 Serie de vacuna antirrábica requerida — documente cada fecha de inyección y efectos secundarios.',
      flag_apartment: '🏢 Complejo de apartamentos — el seguro del inquilino frecuentemente está ausente o tiene límites bajos. Evalúe la responsabilidad del arrendador.',
      flag_business: '🏪 Local comercial — persiga reclamaciones de responsabilidad por las instalaciones y seguridad negligente.',
      flag_unvaccinated: '⚕️ El perro no estaba vacunado — apoya la reclamación de negligencia y fortalece los daños adicionales.',
      flag_surgery_pending: '🔪 Cirugía recomendada pero aún no realizada — considere seriamente completarla antes de un acuerdo.',
      flag_wages_missing: '💵 Se indicó trabajo perdido pero se ingresaron $0 en salarios — obtenga comprobantes de pago.',
    }
  };

  var lang = (typeof window !== 'undefined' && window.dbcAjax && window.dbcAjax.lang) ? window.dbcAjax.lang : 'en';
  var T = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  var STEPS = T.steps;

  /* ========== GA4 TRACKING ========== */

  var calculatorInteracted = false;

  function trackCalculatorStart(stateValue) {
    if (!calculatorInteracted) {
      if (typeof gtag === 'function') {
        gtag('event', 'calculator_start', {
          'page_title': document.title,
          'page_location': window.location.href,
          'state_calculator': stateValue || ''
        });
      }
      calculatorInteracted = true;
    }
  }

  document.addEventListener('focus', function (e) {
    if (e.target.matches('.mva-input, .mva-select, .mva-radio-btn')) {
      trackCalculatorStart(state.data.state);
    }
  }, true);

  document.addEventListener('change', function (e) {
    if (e.target.matches('.mva-input, .mva-select')) {
      trackCalculatorStart(state.data.state);
    }
  });

  /* ========== STATE ========== */

  var state = {
    step: 1,
    windowStart: 0,
    windowDir: '',
    showLead: false,
    showResults: false,
    aiLoading: false,
    settlementLow: 0,
    settlementHigh: 0,
    aiError: '',
    disclaimer: '',
    data: {
      state: '', incidentDate: '',
      location: '', locationAnalysis: null, locationLoading: false,
      victimAge: '', incidentDesc: '', provocation: '',
      dogBreed: '', ownerKnown: '', priorBiteHistory: '', dogVaccinated: '',
      injuryDesc: '', stitchCount: '', nerveInjury: '', nerveInjuryDesc: '', rabiesVaccine: '',
      erTreatment: '', surgeriesPerformed: '', surgeriesRecommended: '',
      plasticSurgery: '', plasticSurgeryDesc: '', plasticSurgeryFuture: '',
      totalMedBills: '', futureMedExpected: '', futureMedAmount: '',
      hasScarring: '', scarLocations: [], scarDesc: '', scarImpact: '',
      psychEffects: '', inTherapy: '', psychPermanent: '',
      lifeImpact: '', permanentLimitations: '', missedWork: '',
      occupation: '', exactLostWages: '', lossOfEarningCapacity: '',
    },
    lead: { name: '', email: '', phone: '' },
    mathResult: null,
  };

  /* ========== MATH ========== */

  function calculateSettlement(d) {
    var medBills  = parseFloat(d.totalMedBills)  || 0;
    var futureMed = d.futureMedExpected === 'yes' ? (parseFloat(d.futureMedAmount) || 0) : 0;
    var lostWages = parseFloat(d.exactLostWages) || 0;
    var totalEcon = medBills + futureMed + lostWages;

    var mLow = 1.5, mMid = 2.5, mHigh = 4.0;

    if (d.stitchCount === '1-5')  { mLow += 0.1;  mMid += 0.2;  mHigh += 0.35; }
    if (d.stitchCount === '6-15') { mLow += 0.25; mMid += 0.5;  mHigh += 0.75; }
    if (d.stitchCount === '16+')  { mLow += 0.5;  mMid += 0.75; mHigh += 1.25; }
    if (d.surgeriesPerformed   === 'yes') { mLow += 0.75; mMid += 1.25; mHigh += 2.0;  }
    if (d.plasticSurgery       === 'yes') { mLow += 0.75; mMid += 1.5;  mHigh += 2.5;  }
    if (d.nerveInjury          === 'yes') { mLow += 0.75; mMid += 1.25; mHigh += 2.0;  }
    if (d.permanentRating      === 'yes') { mLow += 0.5;  mMid += 0.75; mHigh += 1.0;  }
    if (d.rabiesVaccine        === 'yes') { mLow += 0.25; mMid += 0.5;  mHigh += 0.75; }
    if (d.psychEffects && d.psychEffects.trim().length > 5) { mLow += 0.25; mMid += 0.5; mHigh += 1.0; }
    if (d.psychPermanent === 'yes') { mLow += 0.5;  mMid += 0.75; mHigh += 1.0; }
    if (d.inTherapy      === 'yes') { mLow += 0.1;  mMid += 0.25; mHigh += 0.5; }

    if (d.hasScarring === 'yes' && Array.isArray(d.scarLocations) && d.scarLocations.length > 0) {
      var scarAge = parseInt(d.victimAge);
      var isChild = !isNaN(scarAge) && scarAge < 18;
      var bestBonus = 0;
      for (var si = 0; si < SCAR_LOCATIONS.length; si++) {
        if (d.scarLocations.indexOf(SCAR_LOCATIONS[si].value) !== -1) {
          var b = isChild ? SCAR_LOCATIONS[si].childBonus : SCAR_LOCATIONS[si].baseBonus;
          if (b > bestBonus) bestBonus = b;
        }
      }
      if (bestBonus === 0) bestBonus = 0.5;
      mLow  += bestBonus * 0.5;
      mMid  += bestBonus;
      mHigh += bestBonus * 1.5;
    }

    var age = parseInt(d.victimAge);
    if (!isNaN(age) && age < 18) { mLow += 0.5;  mMid += 0.75; mHigh += 1.25; }
    if (!isNaN(age) && age < 10) { mLow += 0.5;  mMid += 0.75; mHigh += 1.0;  }

    if (d.priorBiteHistory === 'yes') { mLow += 0.5; mMid += 1.0; mHigh += 2.0; }

    var law = DOG_BITE_LAWS[d.state];
    if (law && law.liability === 'negligence' && d.priorBiteHistory !== 'yes') {
      mLow -= 0.5; mMid -= 0.5;
    }

    if (d.lossOfEarningCapacity === 'yes') { mLow += 0.25; mMid += 0.5; mHigh += 0.75; }
    if (d.permanentLimitations && d.permanentLimitations.trim().length > 5) { mLow += 0.25; mMid += 0.5; mHigh += 0.5; }

    var locWeight = (d.locationAnalysis && d.locationAnalysis.weight) ? d.locationAnalysis.weight : 1.0;
    mLow  *= locWeight;
    mMid  *= locWeight;
    mHigh *= locWeight;

    mLow  = Math.max(0.5, mLow);
    mMid  = Math.max(1.0, mMid);
    mHigh = Math.max(1.5, mHigh);

    var low  = Math.round((totalEcon + medBills * mLow)  / 500) * 500;
    var mid  = Math.round((totalEcon + medBills * mMid)  / 500) * 500;
    var high = Math.round((totalEcon + medBills * mHigh) / 500) * 500;

    return { low: low, mid: mid, high: high, mLow: mLow, mMid: mMid, mHigh: mHigh, totalEcon: totalEcon, law: law, locWeight: locWeight, punitive: getPunitiveRule(d.state) };
  }

  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function getVisibleCount() {
    var w = window.innerWidth;
    if (w < 480) return 3;
    if (w < 768) return 5;
    return 7;
  }

  /* ========== LOCATION ANALYSIS ========== */

  function fetchLocationAnalysis(stateName, locationType) {
    var WP = (typeof window !== 'undefined' && window.dbcAjax) ? window.dbcAjax : null;
    if (!WP) { state.data.locationLoading = false; render(); return; }

    state.data.locationLoading = true;
    state.data.locationAnalysis = null;
    render();

    var body = new FormData();
    body.append('action',       'dbc_location_analysis');
    body.append('nonce',        WP.nonce);
    body.append('state',        stateName);
    body.append('locationType', locationType);

    fetch(WP.ajaxurl, { method: 'POST', body: body })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        state.data.locationLoading = false;
        state.data.locationAnalysis = (json.success && json.data)
          ? json.data
          : { weight: 1.0, coverageLabel: 'Unknown', typicalLimits: 'Unknown', recoveryRisk: 'medium', analysis: 'Analysis unavailable. Using baseline weight.', additionalDefendants: null };
        render();
      })
      .catch(function () {
        state.data.locationLoading = false;
        state.data.locationAnalysis = { weight: 1.0, coverageLabel: 'Unknown', typicalLimits: 'Unknown', recoveryRisk: 'medium', analysis: 'Network error. Using baseline weight.', additionalDefendants: null };
        render();
      });
  }

  /* ========== RENDER HELPERS ========== */

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function input(field, type, placeholder, label) {
    var wrap = el('div', 'mva-field');
    var lbl = el('label', 'mva-label'); lbl.textContent = label;
    var inp = el('input');
    inp.className = 'mva-input'; inp.type = type || 'text';
    inp.placeholder = placeholder || ''; inp.value = state.data[field] || '';
    inp.addEventListener('input', function () { state.data[field] = this.value; });
    wrap.appendChild(lbl); wrap.appendChild(inp);
    return wrap;
  }

  function textarea(field, placeholder, label) {
    var wrap = el('div', 'mva-field');
    var lbl = el('label', 'mva-label'); lbl.textContent = label;
    var ta = el('textarea', 'mva-textarea');
    ta.placeholder = placeholder || ''; ta.textContent = state.data[field] || '';
    ta.addEventListener('input', function () { state.data[field] = this.value; });
    wrap.appendChild(lbl); wrap.appendChild(ta);
    return wrap;
  }

  function radio(field, options, label) {
    var wrap = el('div', 'mva-field');
    var lbl = el('label', 'mva-label'); lbl.textContent = label;
    var group = el('div', 'mva-radio-group');
    options.forEach(function (opt) {
      var btn = el('button', 'mva-radio-btn' + (state.data[field] === opt.value ? ' selected' : ''));
      btn.type = 'button'; btn.textContent = opt.label;
      btn.addEventListener('click', function () { state.data[field] = opt.value; render(); });
      group.appendChild(btn);
    });
    wrap.appendChild(lbl); wrap.appendChild(group);
    return wrap;
  }

  function select(field, options, label) {
    var wrap = el('div', 'mva-field');
    var lbl = el('label', 'mva-label'); lbl.textContent = label;
    var sel = el('select', 'mva-select');
    var def = document.createElement('option'); def.value = ''; def.textContent = 'Select...';
    sel.appendChild(def);
    options.forEach(function (o) {
      var opt = document.createElement('option'); opt.value = o; opt.textContent = o;
      if (state.data[field] === o) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () { state.data[field] = this.value; render(); });
    wrap.appendChild(lbl); wrap.appendChild(sel);
    return wrap;
  }

  function infoBox(text, type) {
    var b = el('div', 'mva-info-box mva-info-' + (type || 'neutral'));
    b.textContent = text; return b;
  }

  /* ========== STEP CONTENT ========== */

  function renderStepContent(frag) {
    var d = state.data, s = state.step;
    var title = el('h2', 'mva-step-title'), desc = el('p', 'mva-step-desc');

    switch (s) {

      case 1:
        title.textContent = T.step1_title; desc.textContent = T.step1_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(select('state', US_STATES, T.state_label));
        if (d.state && DOG_BITE_LAWS[d.state]) {
          var lb = el('div', 'mva-law-box');
          lb.innerHTML = '<div class="mva-law-system">⚖️ ' + DOG_BITE_LAWS[d.state].system + '</div>' +
            '<div class="mva-law-note">' + DOG_BITE_LAWS[d.state].note + '</div>';
          frag.appendChild(lb);
        }
        frag.appendChild(input('incidentDate', 'date', '', T.accident_date));
        break;

      case 2:
        title.textContent = T.step2_title; desc.textContent = T.step2_desc;
        frag.appendChild(title); frag.appendChild(desc);
        var locLbl = el('label', 'mva-label'); locLbl.textContent = T.location_label;
        frag.appendChild(locLbl);
        var locOpts = lang === 'es' ? LOCATION_OPTIONS_ES : LOCATION_OPTIONS_EN;
        var locGrp = el('div', 'mva-location-group');
        locOpts.forEach(function (loc) {
          var btn = el('button', 'mva-location-btn' + (d.location === loc.key ? ' selected' : ''));
          btn.type = 'button';
          btn.innerHTML = '<span class="mva-loc-icon">' + loc.icon + '</span><span class="mva-loc-label">' + loc.label + '</span>';
          btn.addEventListener('click', function () {
            state.data.location = loc.key;
            if (state.data.state) { fetchLocationAnalysis(state.data.state, loc.key); }
            else { state.data.locationAnalysis = null; render(); }
          });
          locGrp.appendChild(btn);
        });
        frag.appendChild(locGrp);
        if (d.location && !d.state) frag.appendChild(infoBox(T.location_no_state, 'warning'));
        if (d.locationLoading) {
          var ll = el('div', 'mva-loc-loading');
          ll.innerHTML = '<div class="mva-loc-loading-text">🤖 ' + T.location_loading + ' ' + (d.state || '') + '...</div>' +
            '<div class="mva-loc-loading-bar"><div class="mva-loc-loading-fill"></div></div>';
          frag.appendChild(ll);
        }
        if (d.locationAnalysis && !d.locationLoading) {
          var la = d.locationAnalysis;
          var lac = el('div', 'mva-loc-analysis-card');
          var riskCls = la.recoveryRisk === 'high' ? 'mva-risk-high' : la.recoveryRisk === 'medium' ? 'mva-risk-medium' : 'mva-risk-low';
          var riskTxt = la.recoveryRisk === 'high' ? T.location_risk_high : la.recoveryRisk === 'medium' ? T.location_risk_medium : T.location_risk_low;
          var wtCol = la.weight >= 1.2 ? '#22c55e' : la.weight <= 0.8 ? '#C0392B' : '#b8922a';
          lac.innerHTML =
            '<div class="mva-loc-analysis-header">' +
              '<div><div class="mva-loc-analysis-title">🤖 AI Insurance Analysis — ' + (d.state || '') + '</div>' +
              '<div class="mva-loc-analysis-sub">' + (la.coverageLabel || '') + '</div></div>' +
              '<div class="mva-risk-badge ' + riskCls + '">' + riskTxt + '</div>' +
            '</div>' +
            '<div class="mva-loc-analysis-grid">' +
              '<div class="mva-loc-cell"><div class="mva-loc-cell-label">' + T.location_coverage + '</div><div class="mva-loc-cell-value">' + (la.typicalLimits || '—') + '</div></div>' +
              '<div class="mva-loc-cell"><div class="mva-loc-cell-label">' + T.location_weight + '</div><div class="mva-loc-cell-value" style="color:' + wtCol + '">' + (la.weight ? la.weight.toFixed(2) : '1.00') + 'x baseline</div></div>' +
            '</div>' +
            '<div class="mva-loc-analysis-text">' + (la.analysis || '') + '</div>' +
            (la.additionalDefendants ? '<div class="mva-loc-defendants"><strong>' + T.location_defendants + '</strong> ' + la.additionalDefendants + '</div>' : '');
          frag.appendChild(lac);
        }
        break;

      case 3:
        title.textContent = T.step3_title; desc.textContent = T.step3_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(input('victimAge', 'number', T.victim_age_ph, T.victim_age));
        var av = parseInt(d.victimAge);
        if (!isNaN(av) && av < 18) frag.appendChild(infoBox(T.child_warning, 'gold'));
        frag.appendChild(textarea('incidentDesc', T.incident_ph, T.incident_desc));
        frag.appendChild(radio('provocation', [
          { value: 'no', label: T.prov_no }, { value: 'yes', label: T.prov_yes }, { value: 'disputed', label: T.prov_disputed }
        ], T.provocation_label));
        if (d.provocation === 'yes') frag.appendChild(infoBox(T.provocation_warning, 'warning'));
        break;

      case 4:
        title.textContent = T.step4_title; desc.textContent = T.step4_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(input('dogBreed', 'text', T.dog_breed_ph, T.dog_breed));
        frag.appendChild(radio('ownerKnown', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.unknown }], T.owner_known));
        frag.appendChild(radio('priorBiteHistory', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.unknown }], T.prior_bite));
        if (d.priorBiteHistory === 'yes') frag.appendChild(infoBox(T.prior_bite_warning, 'warning'));
        frag.appendChild(radio('dogVaccinated', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.unknown }], T.dog_vaccinated));
        break;

      case 5:
        title.textContent = T.step5_title; desc.textContent = T.step5_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(textarea('injuryDesc', T.injury_ph, T.injury_desc));
        frag.appendChild(radio('stitchCount', [{ value: 'none', label: T.stitch_none }, { value: '1-5', label: T.stitch_low }, { value: '6-15', label: T.stitch_mid }, { value: '16+', label: T.stitch_high }], T.stitch_count));
        frag.appendChild(radio('nerveInjury', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.nerve_being_eval }], T.nerve_injury));
        if (d.nerveInjury === 'yes') { frag.appendChild(textarea('nerveInjuryDesc', T.nerve_ph, T.nerve_desc)); frag.appendChild(infoBox(T.nerve_warning, 'warning')); }
        frag.appendChild(radio('rabiesVaccine', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.unknown }], T.rabies_vaccine));
        if (d.rabiesVaccine === 'yes') frag.appendChild(infoBox(T.rabies_warning, 'warning'));
        break;

      case 6:
        title.textContent = T.step6_title; desc.textContent = T.step6_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(radio('erTreatment',        [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.er_treatment));
        frag.appendChild(radio('surgeriesPerformed',  [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.surgeries_performed));
        var pSec = el('div', 'mva-section-divider');
        pSec.innerHTML = '<div class="mva-section-divider-label">' + T.plastic_surgery_section + '</div>';
        frag.appendChild(pSec);
        frag.appendChild(radio('plasticSurgery', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.plastic_surgery));
        if (d.plasticSurgery === 'yes') frag.appendChild(textarea('plasticSurgeryDesc', T.plastic_surgery_ph, T.plastic_surgery_desc));
        if (d.plasticSurgery === 'yes') frag.appendChild(infoBox(T.plastic_warning, 'warning'));
        frag.appendChild(input('totalMedBills', 'number', 'e.g. 22000', T.med_bills));
        frag.appendChild(radio('futureMedExpected', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.future_med));
        if (d.futureMedExpected === 'yes') frag.appendChild(input('futureMedAmount', 'number', 'e.g. 15000', T.future_med_cost));
        break;

      case 7:
        title.textContent = T.step7_title; desc.textContent = T.step7_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(radio('hasScarring', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }, { value: 'unknown', label: T.scar_too_early }], T.has_scarring));
        if (d.hasScarring === 'yes') {
          var sLbl = el('label', 'mva-label'); sLbl.textContent = T.scar_location_label;
          frag.appendChild(sLbl);
          var sGrid = el('div', 'mva-scar-grid');
          var sAge = parseInt(d.victimAge), sChild = !isNaN(sAge) && sAge < 18;
          if (!Array.isArray(d.scarLocations)) d.scarLocations = [];
          SCAR_LOCATIONS.forEach(function (sl) {
            var isSelected = d.scarLocations.indexOf(sl.value) !== -1;
            var sb = el('button', 'mva-scar-btn' + (isSelected ? ' selected' : ''));
            sb.type = 'button';
            sb.innerHTML = '<span class="mva-scar-btn-label">' + sl.icon + ' ' + sl.label + '</span>';
            sb.addEventListener('click', function () {
              if (!Array.isArray(state.data.scarLocations)) state.data.scarLocations = [];
              var idx = state.data.scarLocations.indexOf(sl.value);
              if (idx === -1) state.data.scarLocations.push(sl.value);
              else state.data.scarLocations.splice(idx, 1);
              render();
            });
            sGrid.appendChild(sb);
          });
          frag.appendChild(sGrid);
          if (d.scarLocations.indexOf('face') !== -1 && sChild) frag.appendChild(infoBox(T.scar_face_child_warning, 'warning'));
          frag.appendChild(textarea('scarDesc', T.scar_desc_ph, T.scar_desc));
          frag.appendChild(textarea('scarImpact', T.scar_impact_ph, T.scar_impact));
        }
        break;

      case 8:
        title.textContent = T.step8_title; desc.textContent = T.step8_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(textarea('psychEffects', T.psych_ph, T.psych_effects));
        frag.appendChild(radio('inTherapy', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.in_therapy));
        frag.appendChild(radio('psychPermanent', [{ value: 'yes', label: T.psych_perm_yes }, { value: 'no', label: T.psych_perm_no }, { value: 'unknown', label: T.psych_perm_unknown }], T.psych_permanent));
        if (d.psychPermanent === 'yes') frag.appendChild(infoBox(T.psych_perm_warning, 'warning'));
        break;

      case 9:
        title.textContent = T.step10_title; desc.textContent = T.step10_desc;
        frag.appendChild(title); frag.appendChild(desc);
        frag.appendChild(textarea('lifeImpact', T.life_impact_ph, T.life_impact));
        frag.appendChild(textarea('permanentLimitations', T.perm_ph, T.perm_limits));
        frag.appendChild(radio('missedWork', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.missed_work));
        if (d.missedWork === 'yes') {
          frag.appendChild(input('occupation',    'text',   'e.g. Teacher, Delivery Driver', T.occupation));
          frag.appendChild(input('exactLostWages','number', 'e.g. 8400', T.lost_income));
        }
        frag.appendChild(radio('lossOfEarningCapacity', [{ value: 'yes', label: T.yes }, { value: 'no', label: T.no }], T.loss_capacity));
        break;
    }
  }

  /* ========== LEAD GATE ========== */

  function renderLeadGate(root) {
    var card = el('div', 'mva-card');
    var prog = el('div', 'mva-progress-bar-wrap');
    prog.innerHTML = '<div class="mva-progress-label">' + T.contact_info + '</div>' +
      '<div class="mva-progress-track"><div class="mva-progress-fill" style="width:100%"></div></div>' +
      '<div class="mva-progress-pct">100%</div>';
    card.appendChild(prog);
    var t = el('h2', 'mva-step-title'); t.textContent = T.lead_title; card.appendChild(t);
    var d2 = el('p', 'mva-step-desc'); d2.textContent = T.lead_desc; card.appendChild(d2);

    var form = el('form', 'mva-lead-form');
    [{ key: 'name', label: T.full_name, type: 'text', ph: 'e.g. Jane Smith' },
     { key: 'email', label: T.email_label, type: 'email', ph: 'e.g. jane@email.com' },
     { key: 'phone', label: T.phone_label, type: 'tel', ph: 'e.g. (555) 555-0100' }
    ].forEach(function (f) {
      var lbl = el('label', 'mva-label'); lbl.textContent = f.label;
      var inp = el('input'); inp.type = f.type; inp.placeholder = f.ph; inp.required = true; inp.value = state.lead[f.key] || '';
      inp.addEventListener('input', function () { state.lead[f.key] = this.value; });
      inp.addEventListener('focus', function () { this.style.borderColor = '#C0392B'; });
      inp.addEventListener('blur',  function () { this.style.borderColor = '#334155'; });
      form.appendChild(lbl); form.appendChild(inp);
    });

    var consent = el('p', 'mva-consent-text'); consent.textContent = T.consent; form.appendChild(consent);
    var nav = el('div', 'mva-nav');
    var back = el('button', 'mva-btn-back'); back.type = 'button'; back.textContent = T.back;
    back.addEventListener('click', function () { state.showLead = false; render(); });
    var sub = el('button', 'mva-btn-next'); sub.type = 'submit'; sub.textContent = T.see_results;
    nav.appendChild(back); nav.appendChild(sub); form.appendChild(nav);
    form.addEventListener('submit', function (e) { e.preventDefault(); handleLeadSubmit(); });
    card.appendChild(form); root.appendChild(card);
  }

  /* ========== AJAX SUBMIT ========== */

  function handleLeadSubmit() {
    var math = calculateSettlement(state.data);
    state.mathResult = math; state.showLead = false; state.showResults = true;
    state.aiLoading = true; state.settlementLow = 0; state.settlementHigh = 0; state.aiError = '';

    if (typeof gtag === 'function') {
      gtag('event', 'calculator_complete', {
        'page_title': document.title,
        'page_location': window.location.href,
        'state_calculator': state.data.state || ''
      });
    }

    render();

    var WP = (typeof window !== 'undefined' && window.dbcAjax) ? window.dbcAjax : null;
    if (!WP) { state.aiLoading = false; state.disclaimer = 'Educational use only. Not legal advice.'; render(); return; }

    var body = new FormData();
    body.append('action',     'dbc_calculate');
    body.append('nonce',      WP.nonce);
    body.append('formData',   JSON.stringify(state.data));
    body.append('mathResult', JSON.stringify(math));
    body.append('name',       state.lead.name);
    body.append('email',      state.lead.email);
    body.append('phone',      state.lead.phone);

    fetch(WP.ajaxurl, { method: 'POST', body: body })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        state.aiLoading = false;
        if (json.success) { state.settlementLow = json.data.settlement_low || 0; state.settlementHigh = json.data.settlement_high || 0; state.disclaimer = json.data.disclaimer || ''; }
        else { state.aiError = 'Could not calculate settlement range.'; }
        render();
      })
      .catch(function () { state.aiLoading = false; state.aiError = 'Network error. Math results are shown above.'; render(); });
  }

  /* ========== RESULTS PANEL ========== */

  function renderResults(root) {
    var math = state.mathResult || calculateSettlement(state.data);
    var d = state.data;

    var card = el('div', 'mva-card');

    // Header
    var hdr = el('div', 'mva-result-header');
    hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;';
    var tw = el('div');
    var h2 = el('h2');
    h2.style.cssText = "";
    h2.textContent = T.settlement_analysis;
    var sl = el('div', 'mva-result-state');
    var st = d.state || '';
    if (d.state && DOG_BITE_LAWS[d.state]) st += ' · ' + DOG_BITE_LAWS[d.state].system;
    var an = parseInt(d.victimAge);
    if (!isNaN(an)) st += ' · ' + (an < 18 ? 'Minor Victim (Age ' + an + ')' : 'Adult Victim (Age ' + an + ')');
    sl.textContent = st; tw.appendChild(h2); tw.appendChild(sl);
    var editBtn = el('button', 'mva-edit-btn'); editBtn.type = 'button'; editBtn.textContent = T.edit;
    editBtn.addEventListener('click', function () { state.showResults = false; state.showLead = false; state.aiLoading = false; state.aiAnalysis = ''; state.aiError = ''; render(); });
    hdr.appendChild(tw); hdr.appendChild(editBtn); card.appendChild(hdr);

    // One-bite warning
    if (math.law && math.law.liability === 'negligence' && d.priorBiteHistory !== 'yes') {
      var obw = el('div', 'mva-one-bite-warning');
      obw.innerHTML = '<div class="mva-one-bite-title">' + T.one_bite_warning_title + '</div>' +
        '<div class="mva-one-bite-desc">' + (d.state || '') + T.one_bite_warning_desc + '</div>';
      card.appendChild(obw);
    }

    // Settlement range
    var rangeWrap = el('div', 'mva-range-wrap');
    if (state.aiLoading) {
      rangeWrap.innerHTML = '<div class="mva-ai-loading"><div class="mva-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></div>' + T.ai_generating + '</div>';
    } else if (state.settlementLow && state.settlementHigh) {
      var rangeDiv = el('div', 'mva-range-display');
      rangeDiv.innerHTML =
        '<div class="mva-range-label">Estimated Settlement Range</div>' +
        '<div class="mva-range-value">' + fmt(state.settlementLow) + ' <span class="mva-range-to">to</span> ' + fmt(state.settlementHigh) + '</div>';
      rangeWrap.appendChild(rangeDiv);
      var db = el('div', 'mva-disclaimer-box');
      db.innerHTML = '<strong>' + T.disclaimer_label + ':</strong> ' +
        (state.disclaimer || 'This tool provides an educational estimate only. It does not constitute legal advice. Actual settlement value depends on jurisdiction-specific jury verdicts, quality of documentation, liability evidence, insurance availability, and attorney skill. Always consult a licensed personal injury attorney before making any settlement decision.');
      rangeWrap.appendChild(db);
    } else if (state.aiError) {
      rangeWrap.innerHTML = '<div class="mva-ai-error">' + state.aiError + '</div>';
    } else {
      rangeWrap.innerHTML = '<div class="mva-ai-error">Please complete all the steps to get your settlement range.</div>';
    }
    card.appendChild(rangeWrap);
    root.appendChild(card);
  }

  /* ========== MAIN RENDER ========== */

  function render() {
    var root = document.getElementById('mva-calculator-root');
    if (!root) return;
    root.innerHTML = '';

    var header = el('div', 'mva-header');
    header.innerHTML =
      '<div class="mva-header-inner">' +
        '<div class="mva-header-icon">🐕</div>' +
        '<div><div class="mva-header-title">' + T.header_title + '</div>' +
        '<div class="mva-header-sub">' + T.header_sub + '</div></div>' +
        '<div class="mva-header-disclaimer"><strong>' + T.disclaimer_short + '</strong>' + T.disclaimer_sub + '</div>' +
      '</div>';
    root.appendChild(header);

    var body = el('div', 'mva-body');
    root.appendChild(body);

    if (state.showLead)    { renderLeadGate(body); return; }
    if (state.showResults) { renderResults(body);  return; }

    // Step indicator
    var VISIBLE = getVisibleCount();
    state.windowStart = Math.min(state.windowStart, Math.max(0, STEPS.length - VISIBLE));
    var animClass = state.windowDir ? ' mva-steps-anim-' + state.windowDir : '';
    state.windowDir = '';

    var sw = el('div', 'mva-steps-wrapper');
    var la = el('button', 'mva-steps-arrow'); la.type = 'button'; la.innerHTML = '&#8249;'; la.disabled = (state.windowStart === 0);
    la.addEventListener('click', function () { state.windowStart = Math.max(0, state.windowStart - 1); state.windowDir = 'right'; render(); });

    var sb = el('div', 'mva-steps' + animClass);
    STEPS.slice(state.windowStart, state.windowStart + VISIBLE).forEach(function (s) {
      var btn = el('button', 'mva-step-btn' + (s.id === state.step ? ' active' : s.id < state.step ? ' done' : ''));
      btn.type = 'button';
      btn.innerHTML = '<span class="mva-step-icon">' + s.icon + '</span><span class="mva-step-label">' + s.label + '</span>';
      btn.addEventListener('click', function () { state.step = s.id; render(); });
      sb.appendChild(btn);
    });

    var ra = el('button', 'mva-steps-arrow'); ra.type = 'button'; ra.innerHTML = '&#8250;'; ra.disabled = (state.windowStart + VISIBLE >= STEPS.length);
    ra.addEventListener('click', function () { state.windowStart = Math.min(STEPS.length - VISIBLE, state.windowStart + 1); state.windowDir = 'left'; render(); });

    sw.appendChild(la); sw.appendChild(sb); sw.appendChild(ra); body.appendChild(sw);

    // Card
    var card = el('div', 'mva-card');
    var pct = Math.round((state.step / STEPS.length) * 100);
    var prog = el('div', 'mva-progress-bar-wrap');
    prog.innerHTML = '<div class="mva-progress-label">' + T.question_of.replace('{n}', state.step).replace('{total}', STEPS.length) + '</div>' +
      '<div class="mva-progress-track"><div class="mva-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="mva-progress-pct">' + pct + '%</div>';
    card.appendChild(prog);

    var frag = document.createDocumentFragment();
    renderStepContent(frag);
    card.appendChild(frag);

    var nav = el('div', 'mva-nav');
    var backBtn = el('button', 'mva-btn-back'); backBtn.type = 'button'; backBtn.textContent = T.back; backBtn.disabled = (state.step === 1);
    backBtn.addEventListener('click', function () {
      if (state.step > 1) {
        state.step--;
        if (state.step < state.windowStart + 1) { state.windowStart = Math.max(0, state.windowStart - 1); state.windowDir = 'right'; }
        render();
      }
    });

    var nextBtn = el('button', 'mva-btn-next'); nextBtn.type = 'button';
    if (state.step < STEPS.length) {
      nextBtn.textContent = T.continue;
      nextBtn.addEventListener('click', function () {
        state.step++;
        var vis = getVisibleCount();
        if (state.step > state.windowStart + vis) { state.windowStart = Math.min(STEPS.length - vis, state.windowStart + 1); state.windowDir = 'left'; }
        render();
      });
    } else {
      nextBtn.textContent = T.calculate;
      nextBtn.addEventListener('click', function () { state.showLead = true; render(); });
    }

    nav.appendChild(backBtn); nav.appendChild(nextBtn); card.appendChild(nav);
    body.appendChild(card);
  }

  /* ========== INIT ========== */

  function init() {
    var root = document.getElementById('mva-calculator-root');
    if (!root) return;
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
