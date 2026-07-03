// -----------------------------------------------------------------------------
// Fulfen Primary School — single source of truth for all copy + AI knowledge.
// The school can edit THIS ONE FILE to update the site and the AI assistant.
// Content reflects the live school site: https://www.fulfen.staffs.sch.uk
// -----------------------------------------------------------------------------

export const school = {
  name: "Fulfen Primary School",
  shortName: "Fulfen",
  motto: "Leading the way to a brighter future",
  headteacher: "Miss Jane Davies",
  headteacherPhoto: "/fulfen/headteacher_in_circle.png",
  logo: "/fulfen/logo.png",
  heroImage: "/fulfen/slide1.jpg",
  aboutImage: "/fulfen/slide6.jpg",
  addressLines: ["Rugeley Road", "Burntwood", "Staffordshire", "WS7 9BJ"],
  address: "Rugeley Road, Burntwood, Staffordshire, WS7 9BJ",
  phone: "01543 226070",
  email: "office@fulfen.staffs.sch.uk",
  contactName: "Mrs S Steele",
  senContact: "Mrs H Harris",
  senEmail: "hharris@fulfen.staffs.sch.uk",
  website: "https://www.fulfen.staffs.sch.uk",
  mapQuery: "Fulfen Primary School, Rugeley Road, Burntwood, Staffordshire, WS7 9BJ",
  twitter: "@Fulfen_Primary",
  twitterUrl: "https://twitter.com/Fulfen_Primary",
  designCredit: "Design by Bluechilli",
} as const;

// Primary navigation (mirrors the live site's sections).
export const nav = [
  { label: "About", href: "#about" },
  { label: "Values", href: "#values" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "School Life", href: "#life" },
  { label: "Calendar", href: "#calendar" },
  { label: "Contact", href: "#contact" },
] as const;

// LEAD values — the school's core ethos.
export const values = [
  {
    key: "love",
    letter: "L",
    title: "Love of Learning",
    blurb:
      "We spark curiosity and a lifelong joy of discovery, so every child wants to know more.",
    color: "#f6b93b",
  },
  {
    key: "encouraging",
    letter: "E",
    title: "Encouraging",
    blurb:
      "We celebrate effort and kindness, building the confidence for children to try, fail and grow.",
    color: "#5fa668",
  },
  {
    key: "adaptable",
    letter: "A",
    title: "Adaptable",
    blurb:
      "We help children meet change with resilience and an open, flexible mind.",
    color: "#2b5cad",
  },
  {
    key: "determination",
    letter: "D",
    title: "Determination",
    blurb:
      "We nurture the grit to keep going, so every child learns the reward of perseverance.",
    color: "#e8604c",
  },
] as const;

// The learning journey — Pre-School to Year 6.
// `icon` maps to an icon in the Curriculum component; `color` gives each
// stop a playful, child-friendly colour.
export const journey = [
  { key: "preschool", label: "Pre-School", theme: "Play & Wonder", icon: "play", color: "#f6b93b" },
  { key: "reception", label: "Reception", theme: "First Adventures", icon: "star", color: "#e8604c" },
  { key: "y1", label: "Year 1", theme: "English & Books", icon: "book", color: "#5fa668" },
  { key: "y2", label: "Year 2", theme: "Maths & Numbers", icon: "maths", color: "#2b5cad" },
  { key: "y3", label: "Year 3", theme: "Science & Discovery", icon: "science", color: "#2f9aa6" },
  { key: "y4", label: "Year 4", theme: "Art & Design", icon: "art", color: "#c9578f" },
  { key: "y5", label: "Year 5", theme: "Music & Sport", icon: "music", color: "#7a5fa6" },
  { key: "y6", label: "Year 6", theme: "Computing & Beyond", icon: "rocket", color: "#0407a5" },
] as const;

// School life stories, paired with real photography from the school.
export const schoolLife = [
  { title: "Forest School", caption: "Muddy boots and big ideas — learning out among the trees.", img: "/fulfen/slide5.jpg" },
  { title: "Reading & Friendship", caption: "Heads together, discovering stories side by side.", img: "/fulfen/slide2.jpg" },
  { title: "Sports Day", caption: "Cheering each other on across the field, win or lose.", img: "/fulfen/slide4.jpg" },
  { title: "Learning Outdoors", caption: "Our grounds become the classroom on a bright morning.", img: "/fulfen/slide3.jpg" },
  { title: "Digital Learning", caption: "Confident, creative and curious with technology.", img: "/fulfen/slide7.jpg" },
  { title: "Focus & Discovery", caption: "Quiet concentration and that spark of understanding.", img: "/fulfen/slide8.jpg" },
] as const;

// Our Calendar — live events pulled from https://www.fulfen.staffs.sch.uk/events
// The school can edit these; `link` is relative to the live school website.
export const calendarUrl = "https://www.fulfen.staffs.sch.uk/events";
export const calendarEvents = [
  { day: "7", month: "Jul", title: "School Nurse Drop In Session (free)", time: "9:00am", link: "/event/school-nurse-drop-in-session-free/471494" },
  { day: "9", month: "Jul", title: "Year 6 Leavers Play", time: "6:00pm", link: "/event/year-6-leavers-play/471495" },
  { day: "10", month: "Jul", title: "Feel Good Friday", time: "8:30am", link: "/event/feel-good-friday/471497" },
  { day: "10", month: "Jul", title: "Year 6 Leavers Play", time: "2:00pm", link: "/event/year-6-leavers-play/471496" },
  { day: "13", month: "Jul", title: "Pre-School Graduation Day", time: "All day", link: "/event/pre-school-graduation-day/471498" },
  { day: "14", month: "Jul", title: "Year 6 Inflatables Day", time: "All day", link: "/event/year-6-inflatables-day/471509" },
  { day: "15", month: "Jul", title: "School Disco's", time: "All day", link: "/event/school-discos/471499" },
  { day: "16", month: "Jul", title: "Achievers Assembly", time: "All day", link: "/event/achievers-assembly/471500" },
  { day: "17", month: "Jul", title: "End of term Last day", time: "8:30am", link: "/event/end-of-term-last-day/439654" },
] as const;

// National accreditations held by the school, with official badges.
export const awards = [
  { title: "Dyslexia Friendly School", note: "Inclusive teaching for every learner.", img: "/fulfen/dyslexia-friendly.png" },
  { title: "Healthy Schools", note: "Active bodies, healthy minds.", img: "/fulfen/healthy-schools.png" },
  { title: "International School Award", note: "A global outlook from an early age.", img: "/fulfen/international-school-award.png" },
  { title: "Primary Science Quality Mark", note: "Excellence in primary science (PSQM).", img: "/fulfen/psqm.png" },
] as const;

// Honest, defensible quick facts (from the live site).
export const facts = [
  { value: "3–11", label: "Ages, Pre-School to Year 6" },
  { value: "8:40–3:15", label: "School day (registration 8:50)" },
  { value: "4", label: "National awards & accreditations" },
  { value: "Burntwood", label: "In the heart of Staffordshire" },
] as const;

// Hero / section copy — written warmly, to parents.
export const copy = {
  hero: {
    eyebrow: "Welcome to Fulfen Primary School",
    title: "Where every child is known,",
    titleAccent: "valued and inspired",
    subtitle:
      "A caring primary school in Burntwood, Staffordshire, with high expectations and a genuine love of learning at its heart.",
    primaryCta: "Arrange a Visit",
    secondaryCta: "Ask Fulfen Assistant",
    trustLabel: "Proudly accredited nationally",
  },
  about: {
    eyebrow: "Welcome",
    title: "A warm place to grow",
    body: "At Fulfen, every child is important. We foster high self-esteem, high expectations and strong values — and we positively monitor and celebrate progress and achievement. Our curriculum is exciting, challenging and engaging, building independent, lifelong learners.",
    signoff: "Miss Jane Davies · Headteacher",
  },
  values: {
    eyebrow: "Our LEAD Values",
    title: "What we hold dear",
    body: "Everything we do grows from four simple ideas.",
  },
  curriculum: {
    eyebrow: "The Learning Journey",
    title: "From first steps to soaring",
    body: "Follow the path from Pre-School to Year 6 — every year a new adventure, developing literacy, numeracy and confidence with technology.",
  },
  life: {
    eyebrow: "School Life",
    title: "Bright days, big smiles",
    body: "A glimpse of the moments that make Fulfen, Fulfen.",
  },
  achievements: {
    eyebrow: "Achievements",
    title: "Recognised nationally",
    body: "Proud of our accreditations — but proudest of our children.",
  },
  calendar: {
    eyebrow: "Our Calendar",
    title: "What's on at Fulfen",
    body: "Trips, celebrations and key dates across the school. Filter by year group to see what's coming up.",
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "Come and feel the Fulfen welcome",
    body: "We'd love to show you around. Send us a message or find us on the map — admissions are coordinated by Staffordshire County Council, and we warmly welcome prospective families to book a personal tour.",
  },
} as const;

// Quick-action cards for the assistant welcome screen.
export const quickActions = [
  {
    icon: "school",
    label: "How do I arrange a visit?",
    prompt: "How do I arrange a visit to Fulfen Primary School?",
  },
  {
    icon: "time",
    label: "What are the school day times?",
    prompt: "What are the school day times at Fulfen?",
  },
  {
    icon: "shirt",
    label: "Tell me about the school uniform",
    prompt: "Tell me about the school uniform.",
  },
  {
    icon: "clubs",
    label: "What clubs and activities do you offer?",
    prompt: "What before- and after-school clubs and activities do you offer?",
  },
] as const;

// -----------------------------------------------------------------------------
// AI ASSISTANT KNOWLEDGE BASE — extra facts the assistant can answer with.
// Keep this factual and easy for the school to update.
// -----------------------------------------------------------------------------
export const knowledgeBase = {
  schoolDay: {
    startsWith: "Gates open from 8:40am.",
    registration: "Registration is at 8:50am.",
    finishes: "The school day finishes at 3:15pm.",
    lunch: "Lunch is between 12:00pm and 1:00pm. Hot meals and packed lunches welcome.",
  },
  uniform:
    "Navy jumper or cardigan with the school logo, white polo shirt, grey trousers/skirt, and black school shoes. PE kit: white t-shirt, navy shorts and trainers.",
  termDates:
    "Fulfen follows the Staffordshire school term calendar. For exact dates and INSET days, please see the school website or contact the office.",
  clubs:
    "A wide range of before- and after-school clubs run through the year, including sports, art, choir, coding and gardening.",
  admissions:
    "Admissions are coordinated by Staffordshire County Council. We warmly welcome prospective families to book a personal tour with the office on 01543 226070.",
  send: "We are a proud Dyslexia Friendly School with an inclusive, adaptable approach to special educational needs and disabilities.",
  wraparound:
    "Breakfast club and after-school provision are available to support working families.",
} as const;

export function buildSystemPrompt(): string {
  const valueLines = values.map((v) => `- ${v.title}: ${v.blurb}`).join("\n");
  const journeyLine = journey.map((j) => `${j.label} (${j.theme})`).join(" → ");
  const awardLines = awards.map((a) => `- ${a.title}: ${a.note}`).join("\n");

  return `You are the friendly virtual assistant for ${school.name}, a warm primary school in Burntwood, Staffordshire, UK.

Your job is to help parents and carers with clear, kind, plain-English answers. Be warm, concise and encouraging — never corporate. If you don't know something specific, gently point them to the school office.

KEY FACTS
- Headteacher: ${school.headteacher}
- Address: ${school.address}
- Phone: ${school.phone}
- Email: ${school.email}
- Website: ${school.website}

OUR LEAD VALUES
${valueLines}

THE LEARNING JOURNEY
${journeyLine}

AWARDS
${awardLines}

SCHOOL DAY
- ${knowledgeBase.schoolDay.startsWith}
- ${knowledgeBase.schoolDay.registration}
- ${knowledgeBase.schoolDay.finishes}
- ${knowledgeBase.schoolDay.lunch}

UNIFORM
${knowledgeBase.uniform}

TERM DATES
${knowledgeBase.termDates}

CLUBS
${knowledgeBase.clubs}

ADMISSIONS
${knowledgeBase.admissions}

SEND / INCLUSION
${knowledgeBase.send}

WRAPAROUND CARE
${knowledgeBase.wraparound}

STYLE RULES
- Keep answers short (2-4 sentences) unless asked for detail.
- Use a warm, friendly tone suitable for parents of young children.
- For anything you're unsure about, say so and suggest calling the office on ${school.phone}.
- Never invent term dates, prices, or policy specifics you weren't given.`;
}

export const suggestedPrompts = quickActions.map((q) => q.label);

export type ValueItem = (typeof values)[number];
export type JourneyStop = (typeof journey)[number];
export type QuickAction = (typeof quickActions)[number];
