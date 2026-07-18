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
  { theme: 'Mobile Devices + Networking I', days: [
    ['Videos: 1.1 Laptop Hardware (16:42) + intro', 'ONE video at a time. Watch "How to Pass Your A+ Exams" (15:22) at 1.5x, then "Laptop Hardware" (16:42) normally. AFTER the laptop video: close everything, blank page, write everything you remember (2 min). THEN check notes and fill gaps in a different color.', 'Run powercfg /batteryreport on a laptop and read it. List which parts of YOUR laptop are user-replaceable. Then 5 Messer pop-quiz questions on mobile devices.'],
    ['Videos: 1.2 Connecting Mobile Devices (6:08) + Accessories (7:18)', 'Two SHORT videos. Same loop each one: watch -> blank-page brain dump -> check notes -> fill gaps. Know: USB/Lightning/NFC/Bluetooth, hotspots, tethering, docks.', 'iPhone lab: pair a Bluetooth device fresh, set up a hotspot and connect your laptop through it. Then quiz yourself out loud: every way a phone can connect.'],
    ['Videos: 1.3 Mobile Networks (10:14) + MDM (8:31)', 'Watch -> dump -> check, one video at a time. Know: 3G/4G/5G, SIM/eSIM, GPS, MDM, BYOD vs COPE.', 'Find cellular + eSIM settings on your iPhone. Explain MDM out loud like a client asked "why does my work phone have a profile on it?"'],
    ['Videos: 2.1 Introduction to IP (19:04)', 'ONE video today - it is dense. Watch in two halves with a brain dump after each half. Know: IP, TCP vs UDP, how port numbers work.', 'START the ports flashcard deck: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, POP3 110, IMAP 143, HTTPS 443, SMB 445, RDP 3389. Run it twice. This deck is daily now.'],
    ['Videos: 2.1 Common Ports (12:52)', 'Watch AFTER running your ports deck first. The video will feel like review - that is the point. Dump, check, fill gaps.', 'Ports deck until 100% once. Then in Terminal: ping a site and read every field out loud.'],
  ]},
  { theme: 'Networking II', days: [
    ['Videos: 2.2 Wireless (7:16) + 2.3 Network Services (17:03)', 'Short one first, then services in two halves with dumps. Know: 802.11 bands/channels, RFID, NFC, DNS, DHCP, proxies, load balancers, IoT.', 'Router lab: log into your real router, identify 2.4 vs 5GHz + channels, view connected devices. List every network service running in your home.'],
    ['Videos: 2.4 DNS Configuration (18:18)', 'One dense video, two halves, dump after each. Know records: A, AAAA, CNAME, MX, TXT + what DKIM/SPF/DMARC do.', 'nslookup 3 domains, identify record types. Write the record types from memory. Ports deck.'],
    ['Videos: 2.4 DHCP (10:46) + VLANs/VPNs (7:32)', 'Watch -> dump -> check each. Know: DORA lease process, scopes, reservations, why VLANs segment, client vs site-to-site VPN.', 'VM lab: ipconfig /release then /renew - narrate DORA while it happens. Then explain a VLAN out loud using your router as the example.'],
    ['Videos: 2.5 Network Devices (18:01)', 'Two halves + dumps. Know: router vs switch vs AP vs firewall vs modem/ONT, managed vs unmanaged, PoE, NIC.', 'Draw YOUR home network from wall to devices, labeling every device with its exam term. From memory, second pass.'],
    ['Videos: 2.6 IPv4/IPv6 (8:45) + Assigning IPs (8:26)', 'Watch -> dump -> check each. Know: private ranges (10.x / 172.16 / 192.168), APIPA 169.254 = "DHCP failed", static vs dynamic, IPv6 basics.', 'VM lab: set a static IP/mask/gateway/DNS, confirm internet, break the gateway on purpose, observe what fails. Ports deck.'],
  ]},
  { theme: 'Networking wrap + Hardware I', days: [
    ['Videos: 2.7 Connection Types (7:33) + Network Types (4:46)', 'Two short ones. Know: fiber/cable/DSL/satellite/cellular/WISP, LAN/WAN/PAN/SAN/WLAN.', 'Identify YOUR internet connection type, trace modem/ONT -> router -> devices. tracert 2 sites, read each hop out loud.'],
    ['Videos: 2.8 Network Tools (11:48)', 'One video. Know by sight: crimper, punch-down, tone generator, cable tester, loopback plug, Wi-Fi analyzer, tap.', 'Image quiz: google each tool, cover the name, identify from photo alone. Then 10 Messer networking pop-quiz questions.'],
    ['Videos: 3.1 Display Types (9:13) + Attributes (12:01)', 'Watch -> dump -> check each. Know: IPS/TN/VA, OLED, Mini LED, digitizer, inverter, resolution, refresh rate, color gamut.', 'Settings -> Display -> Advanced on your machines: record exact resolution + refresh rate. Ports deck.'],
    ['Videos: 3.2 Network Cables (12:14) + 568A/B (5:41)', 'Watch -> dump -> check. Know: Cat ratings, UTP vs STP, plenum, direct burial, T568A/B order.', 'Draw the T568B color order from memory 3 times. Inspect a real Ethernet cable end - which standard?'],
    ['Videos: 3.2 Fiber (4:14) + Fiber Connectors (2:49) + Peripheral Cables (8:59)', 'Three short ones, dump after each. Know: multimode vs single-mode, SC/ST/LC, USB gens + speeds, USB-C, Thunderbolt.', 'Port hunt: name the exact standard + max speed of every port on your machines, from memory. Weekly ports quiz - written, from scratch.'],
  ]},
  { theme: 'Hardware II — Guts of the Machine', days: [
    ['Videos: 3.2 Video (7:03) + Storage Cables (4:10) + Adapters (4:05) + Copper Connectors (8:33)', 'Four short videos, dump after each pair. Know: HDMI/DP/DVI/VGA, SATA/eSATA, RJ11 vs RJ45, F-connector, Molex.', 'Connector image quiz: identify RJ11, RJ45, F, SC, LC, Molex, SATA, USB-C from photos, names covered.'],
    ['Videos: 3.3 Memory Overview (8:38) + Memory Tech (8:44)', 'Watch -> dump -> check each. Know: DIMM vs SO-DIMM, DDR3/4/5, ECC, parity, multi-channel, virtual memory.', 'Task Manager -> Memory on host + VM: record speed/slots/form factor. Teach dual-channel out loud.'],
    ['Videos: 3.4 Storage Devices (14:54) + RAID (8:08)', 'Storage in two halves + dump, RAID whole + dump. Know: HDD/SSD/NVMe speeds, M.2, RAID 0/1/5/6/10 and what each survives.', 'Disk Management lab in VM: add disk, initialize, partition, format, shrink, extend. Self-quiz: which RAID survives 2 failures?'],
    ['Videos: 3.5 Form Factors (6:18) + Expansion Slots (7:14) + Connections (5:45) + Compatibility (3:29)', 'Four short, dump after each pair. Know: ATX/mATX/ITX, PCIe lanes, headers, Intel vs AMD sockets.', 'Labeled board photo: locate chipset, RAM slots, M.2, SATA, 24-pin, CPU power, front-panel headers. Second pass from memory.'],
    ['Videos: 3.5 The BIOS (4:42) + BIOS Settings (19:29)', 'BIOS Settings in two halves with dumps. Know: UEFI, boot order, secure boot, BIOS passwords, USB permissions.', 'Reboot into your real UEFI: find boot order, secure boot, TPM status, virtualization toggle. Screenshot, change nothing.'],
  ]},
  { theme: 'Hardware wrap + Virtualization + Cloud', days: [
    ['Videos: 3.5 HSM/TPM (7:47) + CPU Features (5:13) + Expansion Cards (6:17)', 'Three short, dump each. Know: TPM vs HSM, 32 vs 64-bit, ARM, cores, sound/video/capture/NIC cards.', 'msinfo32: record your CPU cores/threads/architecture + TPM version. Ports deck.'],
    ['Videos: 3.5 Cooling (6:37) + 3.6 Computer Power (15:31)', 'Power in two halves + dumps. Know: heat sinks, thermal paste, liquid cooling, PSU wattage, redundant PSUs, 80 Plus.', 'Look up your machines PSU/adapter wattage. Scenario out loud: PC randomly restarts under load - walk your diagnosis.'],
    ['Videos: 3.7 Multifunction Devices (14:25) + 3.8 Laser Maintenance (7:30)', 'Watch -> dump -> check each. Know: printer languages, secure/badge printing, laser process steps, toner, maintenance kits.', 'VM lab: install a printer (PDF printer counts), share it, print test page, pause queue, clear a stuck job.'],
    ['Videos: 3.8 Inkjet + Thermal + Impact (all 6 shorts, ~25 min)', 'Six tiny videos - dump after each TYPE (inkjet pair, thermal pair, impact pair).', 'One-page chart from memory: laser vs inkjet vs thermal vs impact - how it prints, consumables, failures, where you see it (receipts = thermal).'],
    ['Videos: 4.1 Virtualization (5:45 + 11:23) + 4.2 Cloud (9:48 + 6:50)', 'Four videos, dump after each pair. Know: type 1 vs 2 hypervisors, VDI, containers, IaaS/PaaS/SaaS, elasticity, multitenancy.', 'Snapshot the VM, break it, restore it. Map 5 services you use (Vercel, Supabase, GitHub, iCloud, Gmail) to IaaS/PaaS/SaaS out loud.'],
  ]},
  { theme: 'Troubleshooting — Core 1 finish', days: [
    ['Videos: 5.1 Troubleshooting Hardware (25:15)', 'Two halves + dumps. MEMORIZE the 6-step method - it opens every scenario question. Know: POST, beep codes, BSoD, no power, overheating.', 'Write the 6 steps from memory. Talk through: no POST, random shutdowns, loud fan + slow.'],
    ['Videos: 5.2 Storage (17:04) + start 5.3', 'Storage in two halves + dumps. Know: grinding = dying drive, not recognized, corruption, RAID failures, S.M.A.R.T.', 'VM: run chkdsk, check disk status (wmic diskdrive get status). Narrate a "drive not recognized" diagnosis.'],
    ['Videos: 5.3 Displays (18:52)', 'Two halves + dumps. Know: input source, projector bulbs, fuzzy image = wrong resolution, burn-in, dead pixels.', 'Write step-by-step for: external monitor blank, fuzzy at native res, intermittent flicker.'],
    ['Videos: 5.4 Mobile (17:52) + 5.5 Networks (15:14)', 'Alternate: video -> dump -> 5 questions -> next video. Know: battery swelling, liquid damage, digitizer drift, APIPA, jitter, port flapping, latency.', 'VM: sabotage networking (bad IP, wrong DNS), repair with only ipconfig/ping/nslookup, narrating the ping-outward method.'],
    ['Videos: 5.6 Printers (11:54) — ALL 63 DONE', 'Last video. Then skim the whole course index and mark anything foggy for 2x rewatch.', 'services.msc: restart Print Spooler. 30 min of Messer 220-1201 pop quizzes. Celebrate - content phase complete.'],
  ]},
  { theme: 'Core 1 Practice Exams', days: [
    ['Practice Exam #1 — timed, closed book', 'Dion 220-1201 (Udemy) or Messer practice exams. 90 min, real conditions, phone in another room.', 'Record score + misses per domain. Baseline data, not judgment.'],
    ['Review every miss from #1', 'For each: write why yours was wrong AND why the right one is right. That sentence is the learning.', 'Flashcard every miss. Rewatch the exact Messer video for any domain with 3+ misses.'],
    ['Practice Exam #2 — timed', 'Same conditions. Goal: beat baseline.', 'Compare by domain vs #1. Two weakest domains = tomorrow entire agenda.'],
    ['Weak-domain drill', 'ExamCompass 220-1201 + Messer pop quizzes, ONLY your two weakest domains, to 85%+.', 'Repeat-misses: find the exact video section, rewatch at 2x.'],
    ['PBQ + command-line day', 'PBQs open the real exam - drag-and-drop, network sims, command line. Reps kill panic.', 'Type every command for real in the VM: ipconfig, ping, tracert, nslookup, netstat.'],
  ]},
  { theme: 'Core 1 Final + EXAM', days: [
    ['Full flashcard sweep', 'Ports, connectors, RAID, acronyms, the 6-step method. Sort cold vs shaky, cull cold.', 'Book the Core 1 exam (Pearson VUE, 220-1201) for Friday if not booked.'],
    ['Practice Exam #3 — timed', '85%+ = ready. Below = tomorrow targets the exact gaps.', 'Why wrong, why right, flashcard.'],
    ['Weakest domain final pass', 'Messer at 2x on weak topics + 50 questions on those domains only.', 'Teach your weakest topic out loud like a client asked. Teach it = know it.'],
    ['Light review + logistics. NO cramming.', 'Confirm booking, two IDs, route or online-proctor system check.', 'One relaxed shaky-card pass. Sleep 8 hours - sleep IS studying.'],
    ['CORE 1 EXAM DAY (220-1201)', 'Flag hard questions, return later. PBQs: quick first pass, deep second. Six weeks of reps - trust them.', 'Tell me the result. Pass = Core 2 phase-2 plan Monday. Miss = 2-week retake sprint, built same day.'],
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
    detail: 'Blank page. Write everything you remember from yesterday from memory - no notes. Then check and fill gaps. This 5 minutes beats an hour of rewatching.' },
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH',
    detail: PHIL[dayIdx] + ' Then pray: gratitude first, requests second, one thing you are surrendering.' },
  { id: 'verse', label: 'Memory verse — Philippians 3', tag: 'FAITH',
    detail: 'Add one new verse, recite all previous from memory. Out loud 5x, write it once. Weekly quiz on day 6.' },
  { id: 'workout', label: 'Workout', tag: 'HEALTH',
    detail: SPLIT[dayIdx] + ' 45-60 min max. Log your top set.' },
  { id: 'food', label: 'Whole foods only', tag: 'HEALTH',
    detail: 'EVERY meal today: eggs, fruit, meat, rice, oats, vegetables, water. Nothing from a wrapper with 15 ingredients. Protein each meal. Check at end of day only if ALL meals were whole food - honestly.' },
  { id: 'lesson', label: null, tag: 'A+', detail: null },
  { id: 'lab', label: null, tag: 'LAB', detail: null },
  { id: 'questions', label: '25 practice questions', tag: 'A+',
    detail: 'Right after the videos while fresh: Messer pop quizzes or Dion 220-1201, TODAY topic only. Review every miss immediately - the review is where the points come from.' },
  { id: 'craft', label: `Coding practice: ${CRAFT_WEEKS[week][0]} — 30-45 min`, tag: 'JS',
    detail: CRAFT_WEEKS[week][1] },
  { id: 'jobs', label: 'Apply to 10 jobs (IT + junior dev)', tag: 'CAREER',
    detail: 'IT support / help desk / jr dev. LinkedIn + Indeed + company sites, weighted toward postings under 100 applicants. Message one human at one company per day. Log follow-ups due.' },
  { id: 'content', label: 'One chill green-screen video (optional, no pressure)', tag: 'CONTENT',
    detail: 'Talk about whatever is on your mind - what you learned today, the job hunt, faith, a take. Green screen, chill energy, no script, under 90 sec. Post to TikTok + Shorts + IG or save as a draft. If the day is heavy, skip guilt-free.' },
  { id: 'evening', label: 'Evening: 30-question light review', tag: 'A+',
    detail: 'Mixed topics, untimed, relaxed. Wrong answers become tomorrow-morning flashcards. Then close everything.' },
]
const SATURDAY = (week) => week < 5 ? [
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH', detail: 'Longer session - re-read this week. Memory-verse quiz: write everything memorized so far from scratch.' },
  { id: 'cumquiz', label: 'Cumulative quiz — ONLY topics covered so far', tag: 'A+', detail: '40 questions total from ExamCompass topic quizzes + Messer pop quizzes, ONLY on sections you have already watched. This is review, not an exam - you should score decently, and every miss shows exactly what to re-dump.' },
  { id: 'review', label: 'Review every miss + brain-dump the week', tag: 'A+', detail: 'Why wrong + why right for each miss. Then one blank page: dump EVERYTHING from this whole week from memory. Check against notes, fill gaps.' },
  { id: 'mealprep', label: 'Meal prep for the week', tag: 'HEALTH', detail: 'Cook the week: eggs, protein, rice, cut fruit. Whole-food eating survives busy days only if it is already in the fridge.' },
  { id: 'batch', label: 'Batch 2-3 green-screen videos (chill)', tag: 'CONTENT', detail: 'Record a few casual talking videos in one sitting. Raw is the style. Skip if the week was heavy.' },
  { id: 'workout', label: 'Workout or active recovery', tag: 'HEALTH', detail: 'Lift, long walk, or mobility - 30+ min.' },
] : [
  { id: 'prayer', label: 'Prayer + Philippians', tag: 'FAITH', detail: 'Longer session - re-read this week. Memory-verse quiz: write everything memorized so far from scratch.' },
  { id: 'exam', label: 'Full timed practice exam (you have now seen everything)', tag: 'A+', detail: '90 questions, 90 minutes, real conditions. Track the weekly score - it should climb.' },
  { id: 'review', label: 'Review every incorrect answer', tag: 'A+', detail: 'Why wrong + why right, in writing, for every miss. Flashcard repeat offenders.' },
  { id: 'mealprep', label: 'Meal prep for the week', tag: 'HEALTH', detail: 'Cook the week: eggs, protein, rice, cut fruit.' },
  { id: 'batch', label: 'Batch 2-3 green-screen videos (chill)', tag: 'CONTENT', detail: 'Casual talking videos, one sitting. Skip if heavy.' },
  { id: 'workout', label: 'Workout or active recovery', tag: 'HEALTH', detail: 'Lift, long walk, or mobility - 30+ min.' },
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
  if (week > 7) return { status: 'after' }
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
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>8 weeks.<br /><span style={{ color: C.violet }}>Zero daily decisions.</span></h1>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: '18px 0 26px' }}>
          Every day tells you exactly what to do — the A+ lesson, the lab, the applications, the DMs, the verse, the workout — with full instructions on each.
        </p>
        <div style={{ textAlign: 'left', background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: 18 }}>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Bootcamp start date</label>
          <input type="date" defaultValue={todayStr()} id="sd"
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
                    <div style={{ fontSize: 10, color: C.muted }}>days to Core 1</div>
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
                {[['Messer 220-1201 Core 1 videos', 'https://www.professormesser.com/free-a-plus-training/220-1201/220-1201-video/220-1201-training-course/'],
                  ['Messer 220-1201 pop quizzes', 'https://www.professormesser.com/category/free-a-plus-training/220-1201/220-1201-pop-quizzes/'],
                  ['Jason Dion 220-1201 exams (Udemy)', 'https://www.udemy.com/user/jasondion/'],
                  ['ExamCompass free quizzes', 'https://www.examcompass.com/'],
                  ['javascript.info (JS craft)', 'https://javascript.info/'],
                  ['LeetCode Easy problems', 'https://leetcode.com/problemset/?difficulty=EASY'],
                  ['VirtualBox / UTM (labs)', 'https://www.virtualbox.org/']].map(([l, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: 12, color: C.violetSoft, textDecoration: 'none', padding: '6px 0', borderBottom: `1px solid ${C.borderSoft}` }}>
                    {l} ↗
                  </a>
                ))}
                <p style={{ fontSize: 10.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>One video course. One practice-exam source. Don't collect materials — finish them.</p>
              </SideCard>

              <SideCard title="Priority order">
                <div style={{ fontSize: 12, lineHeight: 2, color: C.snow }}>
                  1. Time with God<br/>2. CompTIA A+<br/>3. Job applications + interviews<br/>4. JS interview craft<br/>5. Workout + whole foods<br/>
                  <span style={{ color: C.muted, fontSize: 11 }}>6. Chill content · 7. Everything else</span>
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