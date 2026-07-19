import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════
   KANAE LIFE OS — Today's Mission + A+ Bootcamp
   Full-screen desktop layout · descriptive tasks · localStorage
   ═══════════════════════════════════════════════════════════ */

const C = {
  void: '#FFF5F8',        /* page — soft pink-white */
  surface: '#FFFFFF',     /* cards */
  border: '#F3CFE0', borderSoft: '#F9E4EE',
  violet: '#EC4899',      /* primary pink */
  violetSoft: '#DB2777',  /* deep pink accents */
  snow: '#2A1220',        /* ink text */
  muted: '#9D7A8C',
  green: '#059669', amber: '#D97706', rose: '#E11D48', blue: '#2563EB', orange: '#EA580C',
}
const MONO = "ui-monospace, 'JetBrains Mono', monospace"

/* ─── 8-week curriculum: [lesson, lesson detail, lab detail] ─── */
const WEEKS = [
  { theme: 'Baseline + Math Foundations', days: [
    ['FULL diagnostic practice test', 'Take a complete timed ASVAB practice test TODAY (March2Success - free, military-made - or ASVAB.com practice). No studying first. This finds your real weak spots so the month attacks the right things.', 'Score every section. Write your AFQT-section results (AR, MK, WK, PC) biggest-gap first. That ranked list IS your month.'],
    ['Arithmetic Reasoning: word problems I', 'AR is word problems: rates, work, age, money. Learn the translate-to-equation method: underline numbers, name the unknown, write the equation BEFORE solving. 20 problems, untimed, method over speed.', 'Redo every miss by writing the equation first, then solving. Say the translation out loud: "per means divide, of means multiply."'],
    ['Math Knowledge: fractions, decimals, percents', 'Drill conversions cold: fraction->decimal->percent both ways, adding/multiplying fractions, percent change. These appear constantly on BOTH math sections.', '30 mixed conversion problems. Anything slow gets 10 more. End: teach percent-change out loud.'],
    ['Ratios, proportions & rates', 'Cross-multiplication for proportions, unit rates, scale problems. AR loves "if 3 workers take 6 hours..." setups.', '20 problems. Then 5 AR word problems mixing today + yesterday.'],
    ['Algebra I: solving for x', 'One and two-step equations, distributing, combining like terms, plugging into expressions. MK bread and butter.', '25 equations. Miss = redo the same TYPE three times. Vocab deck check-in (see verbal task).'],
  ]},
  { theme: 'Math II + Verbal Sharpening', days: [
    ['Algebra II: exponents, roots & inequalities', 'Exponent rules, square roots, simple inequalities, FOIL basics. MK tests these directly.', '25 problems mixed with last week\u2019s algebra. Timed: 15 problems in 15 min.'],
    ['Geometry: angles, area & perimeter', 'Triangles (angles sum 180), area/perimeter of rectangles-triangles-circles, Pythagorean theorem, volume of boxes/cylinders.', 'Draw and solve 20 geometry problems. Memorize the formula sheet - write it from memory twice.'],
    ['Word problems II: mixed AR under time', 'Combine everything: rates, percents, ratios, algebra in word form. Start timing: ~1 min per problem.', '20 AR problems in 25 minutes. Review misses with the write-the-equation method.'],
    ['Word Knowledge deep day', 'WK is vocab: synonyms + words in context. Learn prefix/root/suffix decoding (bene=good, mal=bad, -ology=study of). Your BA gives you a head start - sharpen it.', '50 flashcard words + 20 WK practice questions. Miss = card. Roots list from memory.'],
    ['Paragraph Comprehension day', 'PC: main idea, inference, detail, author\u2019s purpose. Strategy: read the QUESTION first, then hunt. Never answer from outside knowledge - only what the passage says.', '15 PC passages timed. For each miss, underline the exact sentence that proves the right answer.'],
  ]},
  { theme: 'Technical Sections + Mixed Timed Work', days: [
    ['Electronics Information', 'EI feeds IT line scores. Learn: current/voltage/resistance (Ohm\u2019s law V=IR), series vs parallel, AC/DC, common components (resistor, capacitor, diode, transistor), wire gauge basics.', '20 EI questions. Build a one-page cheat sheet from memory: Ohm\u2019s law triangle + component functions.'],
    ['General Science speed-run', 'GS: basic bio, chemistry, physics, earth science. Wide but shallow - skim a GS review chapter, note anything unfamiliar.', '30 GS questions. Only study topics you actually missed - do not rabbit-hole.'],
    ['Mechanical Comprehension basics', 'MC: levers, pulleys, gears, pressure, springs. Intuition + a few formulas. Helps line scores for several technical jobs.', '20 MC questions. For pulleys/gears misses, watch one short explainer and redo.'],
    ['Full MATH sections - timed, real conditions', 'AR (36 min) + MK (24 min or CAT timing) back to back, closed book. This is the money day - math moves your AFQT most.', 'Score it. Every miss: classify by type (fractions? geometry? translation?). Tomorrow drills the top 2 types.'],
    ['Weakest-type drill + verbal maintenance', 'Attack yesterday\u2019s top 2 miss-types with 20 problems each. Then 20 WK + 5 PC to keep verbal warm.', 'End with 10 mixed math problems, timed. Vocab deck.'],
  ]},
  { theme: 'Full Tests + Test Day', days: [
    ['Full practice ASVAB #2 - timed', 'Complete test, real conditions, phone away. Compare every section to your Day 1 diagnostic - the growth is the proof.', 'Review every miss: why wrong, why right. Two weakest areas become tomorrow.'],
    ['Weak-area surgical day', 'Only the two weakest sections from yesterday. Drills + targeted review, nothing else.', '30 questions per weak section. Out-loud explanations for every miss.'],
    ['Full practice ASVAB #3 - timed', 'Last full test. AFQT sections are what count most - AR, MK, WK, PC. You want stable-or-climbing scores across the three tests.', 'Light review of misses only. If scores support your target job, confirm test date with the recruiter.'],
    ['Light review + logistics. NO cramming.', 'Formula sheet from memory once. Roots list once. Confirm: test time, location (MEPS or recruiter-proctored), what to bring, sleep plan.', 'Prep everything tonight. 8 hours of sleep - sleep is score points.'],
    ['ASVAB TEST DAY', 'Pace yourself: never camp on one question - eliminate, pick, move. Math sections: write the equation. Verbal: answer only from the passage.', 'After: tell me your AFQT + line scores. Then we make sure the IT job is IN THE CONTRACT before anything gets signed.'],
  ]},
]

/* ─── daily staples with real descriptions ─── */
const SPLIT = ['Upper strength — push focus (bench/OHP/dips + accessories)',
  'Sprints — 8×30s hill or track sprints, full recovery between',
  'Lower strength — squat/RDL/lunges + core',
  'Zone 2 run — 30–40 min conversational pace',
  'Full body strength — rows/pullups/press + carries']
const PHIL = ['Read Philippians 1 slowly — mark every mention of joy',
  'Read Philippians 2 — focus vv. 5–11, the mind of Christ',
  'Read Philippians 3 — the chapter you\u2019re memorizing; read it aloud',
  'Read Philippians 4 — vv. 6–8, anxiety and thought life',
  'Re-read the chapter that hit hardest this week + journal 3 lines']

const CRAFT_WEEKS = [
  ['Phase 1 — JavaScript basics with ChatGPT as tutor', 'Tell ChatGPT: "Teach me [variables/functions/loops] with a short explanation, then give me 3 exercises. Do NOT show solutions until I try." YOU type every line in a real file and run it. Then ask it to quiz you on what you just did.'],
  ['Phase 1 — Objects, arrays & methods', 'Same method: ChatGPT teaches + gives exercises on objects, map/filter/reduce. You type, run, break, fix. End with: "Quiz me like a junior dev interviewer on arrays." One LeetCode Easy, talking out loud.'],
  ['Phase 2 — Async: promises & async/await', 'ChatGPT: "Explain promises simply, then give me exercises using fetch with a free API." Hand-type everything. Ask it to explain the event loop, then explain it BACK to it and have it grade you. + 1 LeetCode Easy.'],
  ['Phase 3 — The DOM (no framework)', 'ChatGPT: "Give me 3 small DOM projects using only querySelector and addEventListener" (counter, todo, tabs). Build them in one plain HTML file. When stuck, ask for a HINT, never the answer. + 1 LeetCode Easy.'],
  ['Phase 4 — React from first principles', 'ChatGPT: "Quiz me on why state re-renders, hook rules, and keys — interview style." Then build a tiny component from scratch, no copying. You already USE React daily; this phase is about explaining it. + 1 LeetCode Easy.'],
  ['Phase 5 — Node + Express by hand', 'ChatGPT: "Walk me through building an Express CRUD API step by step, one step at a time, and wait for my code before continuing." Blank folder, you type it all, test with curl. + 1 LeetCode Easy.'],
  ['Phase 6 — SQL', 'Supabase SQL editor. ChatGPT: "Give me SQL exercises: SELECT with JOINs, INSERT, UPDATE, an index, an RLS policy." Type by hand on a scratch table, paste results back for it to check. + 1 LeetCode Easy.'],
  ['Phase 7 — Explain your own code + mock interviews', 'Open ThinkWork or the portal, one file a day: explain every line out loud. Then ChatGPT: "Interview me for a junior dev role — ask me to walk through a project, then follow up." Timed, out loud, daily.'],
]

const STAPLES = (dayIdx, week) => [
  { id: 'recall', label: 'Brain dump: YESTERDAY (5 min, before anything new)', tag: 'A+',
    detail: 'Blank page: every formula, method, and word you remember from yesterday. Then check and fill gaps. This is how a month is enough.' },
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH',
    detail: PHIL[dayIdx] + ' Then pray: gratitude first, requests second, one thing you are surrendering.' },
  { id: 'verse', label: 'Memory verse — Philippians 3', tag: 'FAITH',
    detail: 'Add one new verse, recite all previous from memory. Out loud 5x, write it once. Weekly quiz on day 6.' },
  { id: 'workout', label: 'PT prep workout', tag: 'HEALTH',
    detail: ['Run day: 2 miles for time - log it. Then pushup + situp/plank sets.','Strength: upper push + core. Pushup max test - log the number.','Run day: intervals - 6x400m hard. Situps/plank.','Strength: lower + pullups or rows. Core.','Run day: easy 2-3 miles conversational. Pushups + situps.'][dayIdx] + ' PT standards are part of the door - treat the run like a graded section.' },
  { id: 'food', label: 'Whole foods only — every meal', tag: 'HEALTH',
    detail: 'Eggs, fruit, meat, rice, oats, vegetables, water. Check only if ALL meals were whole food. Also: hydrate like an athlete - test-day brains run on water and sleep.' },
  { id: 'lesson', label: null, tag: 'A+', detail: null },
  { id: 'lab', label: null, tag: 'LAB', detail: null },
  { id: 'verbal', label: 'Verbal daily: 20 vocab cards + 5 PC questions', tag: 'JS',
    detail: 'Every day regardless of topic: 20 vocabulary flashcards (roots/prefixes focus) + 5 paragraph-comprehension questions. Verbal is half your AFQT - keep it warm daily.' },
  { id: 'questions', label: '25 mixed practice questions', tag: 'A+',
    detail: 'Timed, mixed sections, right after the main study block. Review every miss immediately with the why-wrong-why-right sentence.' },
  { id: 'pipeline', label: 'Enlistment pipeline task (15 min)', tag: 'CAREER',
    detail: 'One per day: research IT jobs by branch (Air Force 1D7/cyber, Navy IT, Army 25B, Space Force), email/text the recruiter a question, gather documents, or read one enlistee experience for your target job. Rule: the IT role goes IN THE CONTRACT or no signature.' },
  { id: 'content', label: 'One chill green-screen video (optional)', tag: 'CONTENT',
    detail: 'Talk about the journey if you feel like it - under 90 sec, raw. Skip guilt-free.' },
  { id: 'evening', label: 'Evening: 20 questions, weakest section', tag: 'A+',
    detail: 'Light, untimed, on whatever section is currently weakest. Misses become tomorrow-morning flashcards. Then close everything.' },
]
const SATURDAY = (week) => [
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH', detail: 'Longer session. Memory-verse quiz: write everything memorized from scratch.' },
  { id: 'checkpoint', label: week < 3 ? 'Timed AFQT checkpoint (AR + MK + WK + PC only)' : 'Full timed practice ASVAB', tag: 'A+', detail: week < 3 ? 'Just the four AFQT sections, timed. These four ARE your enlistment score - track them weekly.' : 'Complete test, real conditions. This close to test day, everything is a dress rehearsal.' },
  { id: 'review', label: 'Review every miss + brain-dump the week', tag: 'A+', detail: 'Why wrong + why right per miss. Then blank-page dump of the whole week: formulas, methods, roots.' },
  { id: 'mealprep', label: 'Meal prep for the week', tag: 'HEALTH', detail: 'Cook the week: eggs, protein, rice, cut fruit.' },
  { id: 'run', label: 'Long run or PT test simulation', tag: 'HEALTH', detail: 'Alternate weeks: easy long run, or full PT simulation (timed run + max pushups + max situps/plank). Log all numbers.' },
]
const SUNDAY = [
  { id: 'church', label: 'Church', tag: 'FAITH', detail: 'Be present. One note from the sermon to carry into the week.' },
  { id: 'rest', label: 'Rest — actually rest', tag: 'HEALTH', detail: 'No study, no editing, no applications. Rest is part of the plan.' },
  { id: 'plan', label: 'Plan the week', tag: 'PLAN', detail: 'Glance at next week lessons, prep labs (VM ready), confirm groceries for whole-food eating.' },
]

const TAG_COLOR = { FAITH: C.amber, HEALTH: C.green, 'A+': C.violet, LAB: C.violetSoft, CAREER: C.blue, JS: '#7C3AED', CONTENT: C.orange, PLAN: C.muted }

const iso = (d) => d.toISOString().slice(0, 10)
const todayStr = () => iso(new Date())

function planFor(dateStr, startDate) {
  if (!startDate) return null
  const start = new Date(startDate + 'T12:00:00')
  const date = new Date(dateStr + 'T12:00:00')
  const diff = Math.floor((date - start) / 86400000)
  if (diff < 0) return { status: 'before' }
  const week = Math.floor(diff / 7)
  if (week > WEEKS.length - 1) return { status: 'after' }
  const dayInWeek = diff % 7            // 0-4 study, 5 practice-exam day, 6 rest
  if (dayInWeek === 6) return { status: 'ok', week, items: SUNDAY, theme: WEEKS[week].theme }
  if (dayInWeek === 5) return { status: 'ok', week, items: SATURDAY(week), theme: WEEKS[week].theme }
  const dayIdx = dayInWeek
  const [lesson, lessonDetail, labDetail] = WEEKS[week].days[dayIdx]
  const items = STAPLES(dayIdx, week).map(s =>
    s.id === 'lesson' ? { ...s, label: `Lesson: ${lesson}`, detail: lessonDetail }
    : s.id === 'lab' ? { ...s, label: 'Hands-on lab', detail: labDetail }
    : s)
  return { status: 'ok', week, dayIdx, lesson, items, theme: WEEKS[week].theme }
}

function nextMonday() {
  const d = new Date()
  const day = d.getDay()
  const add = day === 1 ? 0 : ((8 - day) % 7 || 7)
  d.setDate(d.getDate() + add)
  return iso(d)
}

export default function App() {
  const [data, setData] = useState({ startDate: '', checks: {} })
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState('today')
  const [viewDate, setViewDate] = useState(todayStr())
  const saveTimer = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kanae-life-os')
      if (raw) setData(d => ({ ...d, ...JSON.parse(raw) }))
    } catch {}
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem('kanae-life-os', JSON.stringify(data)) } catch (e) { console.error(e) }
    }, 400)
  }, [data, loaded])

  if (!loaded) return <Screen><p style={{ color: C.muted, fontFamily: MONO, fontSize: 12 }}>loading…</p></Screen>

  if (!data.startDate) return (
    <Screen>
      <div style={{ maxWidth: 440, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.25em', color: C.violetSoft, textTransform: 'uppercase', marginBottom: 12 }}>Kanae Life OS</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>One month.<br /><span style={{ color: C.violet }}>Zero daily decisions.</span></h1>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: '18px 0 26px' }}>
          Every day tells you exactly what to do — the A+ lesson, the lab, the applications, the DMs, the verse, the workout — with full instructions on each.
        </p>
        <div style={{ textAlign: 'left', background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: 18 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Bootcamp start date</label>
          <input type="date" defaultValue={todayStr()} id="sd"
            style={{ width: '100%', background: C.void, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.snow, fontSize: 14, boxSizing: 'border-box' }} />
          <button onClick={() => { const v = document.getElementById('sd').value; if (v) setData(d => ({ ...d, startDate: v })) }}
            style={{ width: '100%', marginTop: 14, background: C.violet, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Start the sprint
          </button>
        </div>
      </div>
    </Screen>
  )

  const plan = planFor(viewDate, data.startDate)
  const checks = data.checks[viewDate] || {}
  const toggle = (id) => setData(d => ({ ...d, checks: { ...d.checks, [viewDate]: { ...(d.checks[viewDate] || {}), [id]: !((d.checks[viewDate] || {})[id]) } } }))

  const done = plan?.items ? plan.items.filter(i => checks[i.id]).length : 0
  const total = plan?.items?.length || 0
  const pct = total ? Math.round((done / total) * 100) : 0

  let streak = 0
  for (let i = 0; i < 70; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = iso(d)
    const p = planFor(ds, data.startDate)
    if (!p || p.status !== 'ok') break
    const ch = data.checks[ds] || {}
    const dn = p.items.filter(x => ch[x.id]).length
    const ratio = p.items.length ? dn / p.items.length : 0
    if (ratio >= 0.7) streak++
    else if (i === 0) continue
    else break
  }

  const examTarget = iso(new Date(new Date(data.startDate + 'T12:00:00').getTime() + 25 * 86400000))
  const daysToExam = Math.ceil((new Date(examTarget) - new Date(todayStr())) / 86400000)

  /* week snapshot for sidebar */
  const curWeek = plan?.status === 'ok' ? plan.week : 0
  const weekDates = [...Array(7)].map((_, i) => {
    const d = new Date(data.startDate + 'T12:00:00'); d.setDate(d.getDate() + curWeek * 7 + i); return iso(d)
  })

  return (
    <div style={{ background: C.void, minHeight: '100vh', color: C.snow, fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        .os-shell { max-width: 1240px; margin: 0 auto; padding: 28px 20px 90px; }
        .os-grid { display: block; }
        .os-side { margin-top: 20px; }
        @media (min-width: 980px) {
          .os-grid { display: grid; grid-template-columns: 1fr 330px; gap: 26px; align-items: start; }
          .os-side { margin-top: 0; position: sticky; top: 24px; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
      `}</style>
      <div className="os-shell">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.25em', color: C.violetSoft, textTransform: 'uppercase' }}>Kanae Life OS</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 3 }}>
              {tab === 'today' ? "Today's Mission" : 'The 4-Week Plan'}
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: 8 }}>
            {[['today', 'Today'], ['plan', 'Full Plan']].map(([k, l]) => (
              <button key={k} onClick={() => { setTab(k); if (k === 'today') setViewDate(todayStr()) }}
                style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
                  background: tab === k ? C.violet : 'transparent', color: tab === k ? '#fff' : C.muted, border: `1px solid ${tab === k ? C.violet : C.border}` }}>
                {l}
              </button>
            ))}
          </nav>
        </header>

        {tab === 'today' && (
          <div className="os-grid">
            {/* ── main column: the mission ── */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <button onClick={() => { const d = new Date(viewDate + 'T12:00:00'); d.setDate(d.getDate() - 1); setViewDate(iso(d)) }} style={navBtn}>‹</button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{new Date(viewDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                  {plan?.status === 'ok' && <div style={{ fontFamily: MONO, fontSize: 9, color: C.violetSoft, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Week {plan.week + 1} · {plan.theme}</div>}
                </div>
                <button onClick={() => { const d = new Date(viewDate + 'T12:00:00'); d.setDate(d.getDate() + 1); setViewDate(iso(d)) }} style={navBtn}>›</button>
              </div>

              {plan?.status === 'before' && <Note>Bootcamp starts {data.startDate}. Rest up — after that, the plan runs every day.</Note>}
              {plan?.status === 'after' && <Note>Past week 8. Either you passed (🎉) or we build the retake sprint.</Note>}

              {plan?.status === 'ok' && (
                <>
                  <div style={{ height: 6, background: C.borderSoft, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? C.green : C.violet, transition: 'width .3s' }} />
                  </div>

                  {plan.items.map(item => {
                    const on = !!checks[item.id]
                    return (
                      <div key={item.id} onClick={() => toggle(item.id)}
                        style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '14px 16px', marginBottom: 9, borderRadius: 13, cursor: 'pointer',
                          background: on ? C.violet + '12' : C.surface, border: `1px solid ${on ? C.violet + '45' : C.borderSoft}` }}>
                        <div style={{ width: 21, height: 21, borderRadius: 6, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `2px solid ${on ? C.violet : C.border}`, background: on ? C.violet : 'transparent', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                          {on ? '✓' : ''}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: on ? C.muted : C.snow, textDecoration: on ? 'line-through' : 'none' }}>{item.label}</div>
                            <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', color: TAG_COLOR[item.tag], border: `1px solid ${TAG_COLOR[item.tag]}44`, borderRadius: 999, padding: '2px 8px', flexShrink: 0 }}>{item.tag}</span>
                          </div>
                          {item.detail && <div style={{ fontSize: 12.5, lineHeight: 1.55, color: on ? C.muted + '99' : C.muted, marginTop: 5 }}>{item.detail}</div>}
                        </div>
                      </div>
                    )
                  })}

                  {pct === 100 && (
                    <div style={{ textAlign: 'center', padding: 18, borderRadius: 12, background: C.green + '12', border: `1px solid ${C.green}40`, marginTop: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>Day complete. 🔥</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Close the laptop. Tomorrow's mission is already written.</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── sidebar (desktop) ── */}
            <div className="os-side">
              <SideCard>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: daysToExam <= 7 ? C.rose : C.violetSoft }}>{daysToExam}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>days to ASVAB</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.amber }}>🔥{streak}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>day streak (≥70%)</div>
                  </div>
                </div>
              </SideCard>

              {plan?.status === 'ok' && (
                <SideCard title={`This week — ${plan.theme}`}>
                  {WEEKS[curWeek].days.map(([lesson], di) => {
                    const ds = weekDates[di]
                    const ch = data.checks[ds] || {}
                    const p = planFor(ds, data.startDate)
                    const dn = p?.items ? p.items.filter(x => ch[x.id]).length : 0
                    const tt = p?.items?.length || 0
                    const isToday = ds === viewDate
                    return (
                      <div key={di} onClick={() => setViewDate(ds)}
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '8px 0', borderBottom: di < 4 ? `1px solid ${C.borderSoft}` : 'none', cursor: 'pointer' }}>
                        <span style={{ fontSize: 12, color: isToday ? C.violetSoft : dn === tt && tt > 0 ? C.muted : C.snow, fontWeight: isToday ? 700 : 400 }}>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: C.violetSoft }}>D{di + 1}</span> {lesson}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: dn === tt && tt > 0 ? C.green : C.muted, flexShrink: 0 }}>{dn}/{tt}</span>
                      </div>
                    )
                  })}
                </SideCard>
              )}

              <SideCard title="Resources">
                {[['March2Success — free official-style practice', 'https://www.march2success.com/'],
                  ['ASVAB practice tests', 'https://www.asvabprogram.com/'],
                  ['Khan Academy — math gap-filling', 'https://www.khanacademy.org/math'],
                  ['Air Force careers (IT/cyber)', 'https://www.airforce.com/careers'],
                  ['Navy IT rating', 'https://www.navy.com/careers-benefits/careers/intelligence-information-cryptology']
                 ].map(([l, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: 12, color: C.violetSoft, textDecoration: 'none', padding: '6px 0', borderBottom: `1px solid ${C.borderSoft}` }}>
                    {l} ↗
                  </a>
                ))}
                <p style={{ fontSize: 10.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>One video course. One practice-exam source. Don't collect materials — finish them.</p>
              </SideCard>

              <SideCard title="Priority order">
                <div style={{ fontSize: 12, lineHeight: 2, color: C.snow }}>
                  1. Time with God<br/>2. ASVAB math (AR + MK)<br/>3. ASVAB verbal + technical<br/>4. PT prep (run!)<br/>5. Whole foods + sleep<br/>
                  <span style={{ color: C.muted, fontSize: 11 }}>6. Recruiter pipeline · 7. Chill content</span>
                </div>
              </SideCard>
            </div>
          </div>
        )}

        {tab === 'plan' && (
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))' }}>
            {WEEKS.map((w, wi) => {
              const wDates = [...Array(7)].map((_, i) => {
                const d = new Date(data.startDate + 'T12:00:00'); d.setDate(d.getDate() + wi * 7 + i); return iso(d)
              })
              const stats = wDates.map(ds => {
                const p = planFor(ds, data.startDate)
                if (!p || p.status !== 'ok') return 0
                const ch = data.checks[ds] || {}
                return p.items.length ? p.items.filter(x => ch[x.id]).length / p.items.length : 0
              })
              const avg = Math.round((stats.reduce((a, b) => a + b, 0) / 7) * 100)
              return (
                <div key={wi} style={{ background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>Week {wi + 1} — {w.theme}</div>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: avg === 100 ? C.green : C.muted }}>{avg}%</span>
                  </div>
                  {w.days.map(([lesson], di) => {
                    const ds = wDates[di]
                    const ch = data.checks[ds] || {}
                    const p = planFor(ds, data.startDate)
                    const dn = p?.items ? p.items.filter(x => ch[x.id]).length : 0
                    const tt = p?.items?.length || 0
                    return (
                      <div key={di} onClick={() => { setViewDate(ds); setTab('today') }}
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '7px 0', borderBottom: di < 4 ? `1px solid ${C.borderSoft}` : 'none', cursor: 'pointer' }}>
                        <span style={{ fontSize: 12, color: dn === tt && tt > 0 ? C.muted : C.snow, textDecoration: dn === tt && tt > 0 ? 'line-through' : 'none' }}>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: C.violetSoft }}>D{di + 1}</span> {lesson}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: dn === tt && tt > 0 ? C.green : C.muted, flexShrink: 0 }}>{dn}/{tt}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <button onClick={() => { if (confirm('Reset start date? Progress checks are kept.')) setData(d => ({ ...d, startDate: '' })) }}
              style={{ ...navBtn, fontSize: 11, color: C.muted }}>change start date</button>
          </div>
        )}
      </div>
    </div>
  )
}

const navBtn = { background: 'transparent', border: `1px solid ${C.border}`, color: C.snow, borderRadius: 8, padding: '6px 14px', fontSize: 16, cursor: 'pointer' }
const Screen = ({ children }) => (
  <div style={{ background: C.void, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, color: C.snow, fontFamily: "'Inter', ui-sans-serif, system-ui" }}>{children}</div>
)
const Note = ({ children }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: 16, fontSize: 13, color: C.muted, textAlign: 'center' }}>{children}</div>
)
const SideCard = ({ title, children }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
    {title && <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', color: C.violetSoft, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>}
    {children}
  </div>
)