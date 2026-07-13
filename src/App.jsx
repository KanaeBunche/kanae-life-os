import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════
   KANAE LIFE OS — Today's Mission + A+ Bootcamp
   Full-screen desktop layout · descriptive tasks · localStorage
   ═══════════════════════════════════════════════════════════ */

const C = {
  void: '#0A0A0F', surface: '#12121C', border: '#26263A', borderSoft: '#1E1E28',
  violet: '#7B5CF0', violetSoft: '#A78BFA', snow: '#F4F4F8', muted: '#8B8BA3',
  green: '#34D399', amber: '#FBBF24', rose: '#FB7185', blue: '#60A5FA', orange: '#FF7A29',
}
const MONO = "ui-monospace, 'JetBrains Mono', monospace"

/* ─── 8-week curriculum: [lesson, lesson detail, lab detail] ─── */
const WEEKS = [
  { theme: 'PC Hardware', days: [
    ['Cables, connectors & peripherals',
      'Professor Messer 220-1101: watch the full Cables & Connectors section (USB versions/speeds, video: HDMI/DP/VGA, SATA, Lightning, Thunderbolt). Take notes in your own words.',
      'Physically identify every port on your own machine and one other device. Then write the full list from memory — USB gen + speed, video, audio, network.'],
    ['Motherboards & form factors',
      'Messer: Motherboard Form Factors + Expansion Slots + BIOS/UEFI. Know ATX vs ITX, PCIe lanes, M.2 keys, CMOS battery, boot order.',
      'Open a PC or use a labeled hi-res photo: locate and name chipset, RAM slots, M.2, SATA headers, 24-pin + CPU power, front-panel headers.'],
    ['CPUs, sockets & cooling',
      'Messer: CPU Features + Cooling. Cores vs threads, virtualization support (VT-x/AMD-V), LGA vs PGA sockets, air vs liquid cooling, thermal paste.',
      'Run msinfo32 + Task Manager → Performance → CPU. Record model, cores, threads, virtualization enabled? Look up its socket type.'],
    ['RAM types & channels',
      'Messer: Memory. DDR4 vs DDR5, DIMM vs SODIMM, single/dual channel, ECC vs non-ECC, virtual memory/paging.',
      'Task Manager → Memory: record speed, slots used, form factor. Then explain out loud what dual channel does and why laptops use SODIMM.'],
    ['Storage: HDD, SSD, NVMe & RAID',
      'Messer: Storage Devices + RAID. 5400/7200rpm, SATA vs NVMe speeds, M.2 vs 2.5", RAID 0/1/5/10 — know what each survives.',
      'Disk Management lab: view your partitions and file systems, shrink a volume, create + format a new one, then delete it.'],
  ]},
  { theme: 'Windows', days: [
    ['Windows editions & installation',
      'Messer 220-1102: Windows Editions + Installations. Home vs Pro vs Enterprise features (BitLocker, RDP host, domain join), upgrade paths, clean vs in-place.',
      'Install a Windows VM in VirtualBox start to finish. Screenshot every install decision and write one line on what it does.'],
    ['File systems & Disk Management',
      'Messer: File Systems. NTFS vs FAT32 vs exFAT — max sizes, permissions, journaling. When each is used.',
      'In the VM: add a virtual disk, format it NTFS, reformat exFAT. Note what you gain/lose each way.'],
    ['Users, groups & password resets',
      'Messer: User Accounts + Group Policy basics. Local vs Microsoft account, Administrators vs Users group, UAC.',
      'VM lab: create 3 local users, put one in Administrators, reset a password from an admin account, trigger and observe a lockout.'],
    ['Device Manager & drivers',
      'Messer: Device Manager + Drivers. Driver signing, rollback, disable vs uninstall, unknown devices.',
      'VM lab: roll back a driver, disable/re-enable a device, install one driver manually from a downloaded package.'],
    ['Task Manager, msconfig, Control Panel vs Settings',
      'Messer: Task Manager + System Utilities. Startup impact, services tab, msconfig boot options, where Control Panel and Settings overlap.',
      'Kill a hung process, disable a startup app, then find the SAME 5 settings in both Control Panel and Settings (power, network, users, display, apps).'],
  ]},
  { theme: 'Networking', days: [
    ['IP addressing & subnet basics',
      'Messer 220-1101: IPv4 Addressing. Private ranges (10/172.16/192.168), APIPA 169.254, subnet mask role, gateway, static vs DHCP.',
      'ipconfig /all on host and VM: record IP, mask, gateway, MAC, DNS. Then set a static IP on the VM and confirm it still reaches the internet.'],
    ['DNS & DHCP',
      'Messer: DNS + DHCP. What each does, lease process (DORA), record types A/AAAA/MX/CNAME, public resolvers.',
      'Terminal lab: nslookup 3 domains, ipconfig /flushdns, /release then /renew — narrate out loud what happened at each step.'],
    ['Routers, switches & home networks',
      'Messer: Network Devices. Router vs switch vs access point vs modem, NAT, port forwarding basics.',
      'Log into your real router: find the DHCP range, view connected devices, locate port forwarding, change the WiFi channel.'],
    ['Wireless standards & security',
      'Messer: Wireless Standards + Encryption. 802.11 a/b/g/n/ac/ax speeds and bands, WPA2 vs WPA3, 2.4 vs 5GHz tradeoffs.',
      'On your router: confirm WPA version, identify both bands. Scan nearby networks and classify each by band.'],
    ['Ports & protocols — memorize',
      'Messer: Common Ports. This is pure memorization and guaranteed exam points: 20/21, 22, 23, 25, 53, 67/68, 80, 110, 143, 443, 445, 3389.',
      'Flashcard drill until 100% twice in a row. Then ping and tracert three sites and read every hop.'],
  ]},
  { theme: 'Mobile · Printers · Virtualization · Cloud', days: [
    ['Laptop hardware & displays',
      'Messer: Laptop Hardware. What is user-replaceable (RAM/SSD/battery — sometimes), LCD vs OLED, inverters, function keys.',
      'Run powercfg /batteryreport on a laptop and read it. List which components in YOUR laptop are replaceable.'],
    ['Mobile OS, sync & security',
      'Messer: Mobile Devices. MDM, corporate vs BYOD, backups, biometrics, locator apps, remote wipe.',
      'iPhone settings walkthrough: check backup status, review Face ID settings, find VPN config, review app permissions for 3 apps.'],
    ['Printers & scanners',
      'Messer: Printers. Laser printing 7-step process (memorize the order), inkjet, thermal, duplex, print servers.',
      'VM lab: add a printer (PDF printer counts), share it, print a test page, pause the queue, clear a stuck job.'],
    ['Virtualization concepts',
      'Messer: Virtualization. Hypervisor type 1 vs 2, VM requirements, sandboxing, why IT uses snapshots.',
      'VirtualBox lab: snapshot the VM, intentionally break something, restore the snapshot. Feel how powerful that is.'],
    ['Cloud models: IaaS / PaaS / SaaS',
      'Messer: Cloud Computing. Service models, public/private/hybrid, elasticity, metered billing, shared resources.',
      'Map 5 services you actually use (Vercel, Supabase, Gmail, iCloud, GitHub) to IaaS/PaaS/SaaS and defend each answer.'],
  ]},
  { theme: 'Security', days: [
    ['Physical & logical security',
      'Messer 220-1102: Physical Security. Badges, mantraps/access vestibules, cameras, locks, MFA factors (something you know/have/are).',
      'Pick a real place you know well and audit it: list every security control, map each to its exam term.'],
    ['Authentication & NTFS vs share permissions',
      'Messer: Windows Security Settings. NTFS vs share permissions and the "most restrictive wins" rule, inheritance, EFS.',
      'VM lab: shared folder with conflicting NTFS/share permissions — predict the effective access, then test as another user.'],
    ['Malware types & removal',
      'Messer: Malware + Removal. Virus vs worm vs trojan vs ransomware vs rootkit vs keylogger. MEMORIZE the 7-step removal order.',
      'Write the 7 steps from memory. Run a Defender full scan, explore quarantine and protection history.'],
    ['Encryption & wireless security',
      'Messer: Encryption. At-rest vs in-transit, BitLocker vs EFS, TPM, certificates and HTTPS.',
      'Check BitLocker options on your machine. Inspect the TLS certificate on 3 HTTPS sites — issuer, expiry, chain.'],
    ['Social engineering & best practices',
      'Messer: Social Engineering. Phishing/vishing/smishing, shoulder surfing, tailgating, dumpster diving, evil twin.',
      'Find 5 real phishing red flags in your spam folder. Review your own screen-lock, UAC level, and password habits — fix one.'],
  ]},
  { theme: 'Troubleshooting', days: [
    ['The method + hardware issues',
      'Messer: Troubleshooting Methodology — memorize all 6 steps IN ORDER (identify, theory, test, plan+implement, verify, document). Then hardware: no POST, beep codes, overheating.',
      'Write the 6 steps from memory. Talk through 3 scenarios out loud: no POST, random shutdowns, loud fan.'],
    ['Windows issues',
      'Messer: Troubleshooting Windows. Boot errors, slow performance, BSOD basics, Safe Mode, System Restore, SFC/DISM.',
      'Break the VM: disable a service it needs, boot Safe Mode, fix it. Then run sfc /scannow and read the result.'],
    ['Network issues',
      'Messer: Troubleshooting Networks. No connectivity vs no internet, APIPA meaning, DNS failures, the ping-out-in-order method.',
      'Sabotage VM networking (wrong static IP, bad DNS) and repair using only ipconfig, ping, nslookup.'],
    ['Printer & peripheral issues',
      'Messer: Troubleshooting Printers. Spooler restarts, garbled output = driver, lines/streaks = hardware, offline states.',
      'services.msc: restart the Print Spooler. Walk through fixing: stuck queue, offline printer, wrong-driver gibberish.'],
    ['Mobile & security issues',
      'Messer: Troubleshooting Mobile + Security. Battery drain, overheating, app crashes, signs of compromise, force-stop vs reinstall.',
      'Write your step-by-step for 4 scenarios: slow phone, battery dying fast, one app crashing, "my account got hacked."'],
  ]},
  { theme: 'Practice Exams', days: [
    ['Dion Practice Exam #1 — timed, closed book',
      'Jason Dion on Udemy: full 90-question exam under real conditions. No pausing, no lookups, phone in another room.',
      'Record your score and every domain you missed questions in. This is your baseline — no judgment, just data.'],
    ['Review every miss from Exam #1',
      'For each wrong answer: write WHY your choice was wrong and WHY the right one is right. That sentence is the learning.',
      'Turn every miss into a flashcard. Re-watch the Messer video for any domain with 3+ misses.'],
    ['Dion Practice Exam #2 — timed',
      'Same conditions as #1. Goal: beat your baseline score.',
      'Compare domain-by-domain with Exam 1. Your two weakest domains become tomorrow\u2019s entire agenda.'],
    ['Weak-domain deep drill',
      'ExamCompass free quizzes — only your two weakest domains, repeated until 85%+.',
      'For every repeat miss, find the exact Messer timestamp covering it and rewatch just that.'],
    ['PBQ practice day',
      'Performance-based questions: drag-and-drop, command line sims, network config. These open the real exam — practicing them kills the panic.',
      'Do every PBQ you can find (Dion includes some). Practice command-line answers by actually typing them in the VM.'],
  ]},
  { theme: 'Final Review & Exam', days: [
    ['Full flashcard sweep',
      'Every port, acronym, command, and the two memorized sequences (malware removal, troubleshooting method).',
      'Sort cards into "cold" and "shaky." Cull the cold ones. Tomorrow only shaky cards exist.'],
    ['Dion Practice Exam #3 — timed',
      'Final full exam. 85%+ = you are ready, book it if you haven\u2019t. Below = tomorrow targets exactly what missed.',
      'Same review ritual: why wrong, why right, flashcard it.'],
    ['Weakest domain — final pass',
      'Messer videos at 2x on remaining weak topics + 50 questions on those domains only.',
      'End the day by explaining your weakest topic out loud like you\u2019re teaching a client. If you can teach it, you know it.'],
    ['Light review + exam logistics',
      'NO cramming today. Confirm booking, ID requirements, testing-center route or online proctor setup.',
      'Skim your shaky flashcards once. Pack/prep everything. Sleep 8 hours — sleep is studying.'],
    ['EXAM DAY',
      'Walk in calm. 8 weeks of reps are in you. Flag hard questions, come back, PBQs first-pass quickly.',
      'After: whatever the result, message the group chat (me). Pass = celebrate. Miss = we build the 2-week retake sprint same day.'],
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

const STAPLES = (dayIdx) => [
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH',
    detail: `${PHIL[dayIdx]}. Then pray: gratitude first, requests second, one thing you\u2019re surrendering.` },
  { id: 'verse', label: 'Memory verse — Philippians 3', tag: 'FAITH',
    detail: 'Add one new verse, recite all previous from memory. Say it out loud 5x, write it once. Weekly quiz Saturday.' },
  { id: 'workout', label: 'Workout', tag: 'HEALTH',
    detail: SPLIT[dayIdx] + '. 45–60 min max. Log your top set.' },
  { id: 'lesson', label: null, tag: 'A+', detail: null },
  { id: 'lab', label: null, tag: 'LAB', detail: null },
  { id: 'questions', label: '25 practice questions', tag: 'A+',
    detail: 'Dion or ExamCompass, on TODAY\u2019S topic. Review every miss immediately — the review is where the points come from.' },
  { id: 'jobs', label: 'Apply to 10 jobs', tag: 'CAREER',
    detail: 'IT support / help desk / jr dev. LinkedIn + Indeed + company sites. Tailor the resume only when the role deserves it. Log follow-ups due.' },
  { id: 'content', label: 'Content task (scheduled days only)', tag: 'BIZ',
    detail: 'Tue/Thu: post the scheduled reel to IG + TikTok + Shorts. Other days: skip guilt-free — do NOT create content to feel busy.' },
  { id: 'dms', label: '10 targeted DMs', tag: 'BIZ',
    detail: 'NYC businesses matching a portfolio site. Name something specific about THEIR business, link the matching build, one low-pressure question. ≤60 min.' },
  { id: 'evening', label: 'Evening: 30-question light review', tag: 'A+',
    detail: 'Mixed topics, untimed, relaxed. Wrong answers become tomorrow-morning flashcards. Then close everything.' },
]
const SATURDAY = [
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH', detail: 'Longer session — re-read this week\u2019s chapters. Weekly memory-verse quiz: write everything memorized so far from scratch.' },
  { id: 'exam', label: 'Full timed practice exam', tag: 'A+', detail: '90 questions, 90 minutes, real conditions. Track your weekly score trend — it should climb.' },
  { id: 'review', label: 'Review every incorrect answer', tag: 'A+', detail: 'Why wrong + why right, in writing, for every single miss. Flashcard the repeat offenders.' },
  { id: 'batch', label: 'Batch record + edit reels', tag: 'BIZ', detail: 'Record BOTH of next week\u2019s reels in one sitting using the master template. Edit, caption, schedule Tue + Thu.' },
  { id: 'workout', label: 'Workout or active recovery', tag: 'HEALTH', detail: 'Lift, long walk, or mobility — move for 30+ min, keep the body in the habit.' },
]
const SUNDAY = [
  { id: 'church', label: 'Church', tag: 'FAITH', detail: 'Be present. Take one note from the sermon to carry into the week.' },
  { id: 'rest', label: 'Rest — actually rest', tag: 'HEALTH', detail: 'No study, no editing, no DMs. Rest is part of the plan, not a break from it.' },
  { id: 'plan', label: 'Plan the week', tag: 'PLAN', detail: 'Confirm Tue/Thu posts are scheduled, glance at next week\u2019s lessons, prep anything the labs need (VM ready, etc).' },
]

const TAG_COLOR = { FAITH: C.amber, HEALTH: C.green, 'A+': C.violet, LAB: C.violetSoft, CAREER: C.blue, BIZ: C.orange, PLAN: C.muted }

const iso = (d) => d.toISOString().slice(0, 10)
const todayStr = () => iso(new Date())

function planFor(dateStr, startDate) {
  if (!startDate) return null
  const start = new Date(startDate + 'T12:00:00')
  const date = new Date(dateStr + 'T12:00:00')
  const diff = Math.floor((date - start) / 86400000)
  if (diff < 0) return { status: 'before' }
  const week = Math.floor(diff / 7)
  if (week > 7) return { status: 'after' }
  const dow = date.getDay()
  if (dow === 0) return { status: 'ok', week, items: SUNDAY, theme: WEEKS[week].theme }
  if (dow === 6) return { status: 'ok', week, items: SATURDAY, theme: WEEKS[week].theme }
  const dayIdx = dow - 1
  const [lesson, lessonDetail, labDetail] = WEEKS[week].days[dayIdx]
  const items = STAPLES(dayIdx).map(s =>
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
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>8 weeks.<br /><span style={{ color: C.violet }}>Zero daily decisions.</span></h1>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: '18px 0 26px' }}>
          Every day tells you exactly what to do — the A+ lesson, the lab, the applications, the DMs, the verse, the workout — with full instructions on each.
        </p>
        <div style={{ textAlign: 'left', background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: 18 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Bootcamp start date (a Monday)</label>
          <input type="date" defaultValue={nextMonday()} id="sd"
            style={{ width: '100%', background: C.void, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.snow, fontSize: 14, boxSizing: 'border-box' }} />
          <button onClick={() => { const v = document.getElementById('sd').value; if (v) setData(d => ({ ...d, startDate: v })) }}
            style={{ width: '100%', marginTop: 14, background: C.violet, color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Start the 8 weeks
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

  const examTarget = iso(new Date(new Date(data.startDate + 'T12:00:00').getTime() + 53 * 86400000))
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
              {tab === 'today' ? "Today's Mission" : '8-Week Bootcamp'}
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
                    <div style={{ fontSize: 10, color: C.muted }}>days to exam</div>
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
                          <span style={{ fontFamily: MONO, fontSize: 10, color: C.violetSoft }}>{['Mon','Tue','Wed','Thu','Fri'][di]}</span> {lesson}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: dn === tt && tt > 0 ? C.green : C.muted, flexShrink: 0 }}>{dn}/{tt}</span>
                      </div>
                    )
                  })}
                </SideCard>
              )}

              <SideCard title="Resources">
                {[['Professor Messer — free A+ course', 'https://www.professormesser.com/free-a-plus-training/220-1101/'],
                  ['Jason Dion practice exams (Udemy)', 'https://www.udemy.com/user/jasondion/'],
                  ['ExamCompass free quizzes', 'https://www.examcompass.com/'],
                  ['VirtualBox (labs)', 'https://www.virtualbox.org/']].map(([l, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: 12, color: C.violetSoft, textDecoration: 'none', padding: '6px 0', borderBottom: `1px solid ${C.borderSoft}` }}>
                    {l} ↗
                  </a>
                ))}
                <p style={{ fontSize: 10.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>One video course. One practice-exam source. Don't collect materials — finish them.</p>
              </SideCard>

              <SideCard title="Priority order">
                <div style={{ fontSize: 12, lineHeight: 2, color: C.snow }}>
                  1. Time with God<br/>2. CompTIA A+<br/>3. Job applications<br/>4. Workout<br/>5. Koded by Kanae content + DMs<br/>
                  <span style={{ color: C.muted, fontSize: 11 }}>6. Everything else</span>
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