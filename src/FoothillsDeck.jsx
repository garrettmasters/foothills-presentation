import { useState, useEffect, useRef, useCallback } from "react";

/* ────────────────────────────────────────────────────────────────
   Foothills Leadership Deck
   Click / → / space to advance · ← to go back
   Notes are hidden by default — press H to reveal them (secret), H again to hide
   Palette + type match the Communication Survey report.
──────────────────────────────────────────────────────────────── */

const C = {
  page: "#e8e7e2",
  surface: "#ffffff",
  surface2: "#f6f5f1",
  surface3: "#eeecea",
  ink: "#181816",
  ink2: "#4a4a46",
  ink3: "#8a8a84",
  ink4: "#b8b8b0",
  rule: "rgba(0,0,0,0.08)",
  ruleStrong: "rgba(0,0,0,0.14)",
  warn: "#b84a1e",
  accent: "#1a5fa8",
};

const SERIF = "'Georgia','Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif";

/* ── helpers ─────────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
}

function CountUp({ value, duration = 1400, prefix = "", suffix = "" }) {
  const [n, setN] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) { setN(value); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);
  return <>{prefix}{n.toLocaleString("en-US")}{suffix}</>;
}

function Reveal({ on, children, delay = 0, style = {} }) {
  return (
    <div
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const Eyebrow = ({ children }) => (
  <div style={{
    fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
    textTransform: "uppercase", color: C.ink3, marginBottom: 22,
  }}>{children}</div>
);

const Headline = ({ children, size = "clamp(28px, 4.6vw, 52px)", style = {} }) => (
  <h1 style={{
    fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: 1.14,
    color: C.ink, letterSpacing: "-0.01em", margin: 0, ...style,
  }}>{children}</h1>
);

const Big = ({ children, warn = false, size = "clamp(72px, 14vw, 170px)" }) => (
  <div style={{
    fontFamily: SANS, fontWeight: 200, fontSize: size, lineHeight: 1,
    letterSpacing: "-0.03em", color: warn ? C.warn : C.ink,
  }}>{children}</div>
);

const Caption = ({ children, style = {} }) => (
  <div style={{
    fontFamily: SANS, fontSize: "clamp(13px, 1.5vw, 16px)", color: C.ink3,
    marginTop: 14, lineHeight: 1.5, ...style,
  }}>{children}</div>
);

const Quote = ({ text, attr, on, delay = 0 }) => (
  <Reveal on={on} delay={delay}>
    <div style={{
      borderLeft: `3px solid ${C.ink4}`, paddingLeft: 20, marginBottom: 26,
    }}>
      <div style={{
        fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px, 2.3vw, 25px)",
        color: C.ink, lineHeight: 1.5,
      }}>{text}</div>
      {attr && (
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink3, marginTop: 8 }}>
          {attr}
        </div>
      )}
    </div>
  </Reveal>
);

/* ── slide content ───────────────────────────────────────────── */

const nadiaContacts = [
  { d: "Feb 6", t: "Worship, email" },
  { d: "Feb 6", t: "Worship, text" },
  { d: "Feb 6", t: "Multimedia, email" },
  { d: "Feb 8", t: "Nursery" },
  { d: "Feb 9", t: "Preschool" },
  { d: "Feb 12", t: "Connections booth" },
  { d: "Feb 12", t: "Children's ministry" },
  { d: "Feb 14", t: "First time visitor outreach" },
  { d: "Feb 16", t: "Women's ministry, told no need at this time" },
  { d: "Feb 17", t: "YV" },
];

const deadForms = [
  "Salt and Light", "Electrician", "Roofer", "HVAC",
  "General contractor", "Hospitality", "Other",
];

const appWallQuotes = [
  "Not everything is on the weekend flyer. The app doesn't list everything under the right ministry. Just get it all on the app... correctly",
  "The app is not very well organized",
  "Better app. Website much quicker to find information",
  "Consistency across the platform. Make sure the links are current and all going to the proper spot.",
  "The app being more user friendly. I have searched for events and that has not worked well.",
  "I would like the website and app to have a better search functionality",
  "I really dislike the app and website. They are very difficult to use... The app doesn't have my correct info either and is a pain to change.",
  "I would like to see more information on the app about upcoming events. Cost, times, details",
  "The events on the app are difficult to find... the natural place I tend to go for events takes you to a forms page, not actual event info.",
  "I think the app needs to be updated more",
  "Consistency on where to find what events and happenings are being held at Foothills",
  "Easier access to things on the app",
  "Less confusion on the app and website",
  "More details on events calendar on app",
  "There are some events that just lack info. Particularly the men's ministry",
  "Better info and usability on the app.",
  "Consistency on app and website",
  "A simpler church website and an app that is much more intuitive to navigate, with current, accurate information and resources",
  "The app to be more streamlined. It is sometimes hard to track down the correct information for events",
  "Better details in the app on who to contact and when.",
  "More detailed information in app with clear directions",
  "A better search engine on the app",
  "Easier app and website, user friendly. Have information and resources, classes etc in a more efficient manner",
  "More user friendly app that is easy to navigate.",
  "App isn't the easiest to navigate",
  "Sometimes I have a hard time finding them on the app and the website",
  "If the app, website and weekly announcements all had the same events easily accessible",
  "The search engine on the website really doesn't work at all and it's impossible to find any event or resources",
  "I think at times the foothills app does not list everything or events you talk about are not listed",
  "Keep events or calendar of events up to date, perhaps a month ahead, and easy to find... where I don't have to call someone at the church or click 20 times to get to where I'm headed.",
  "Having consistent, accurate, and personalized information. Right now, I run into a lot of conflicting information, which makes it hard to know what's actually correct",
  "Camps are difficult to find on the app and website.",
];

const serveWallQuotes = [
  "I have reached out regarding serving, but nobody got back to me with information",
  "I have filled out several forms, but nobody has ever reached back out to follow up.",
  "Respond after submitting online",
  "I've filled out a form twice to state that I want to serve and I've picked a few ministries and then I've never got a response back from you all.",
  "When we attended the ministry fair we signed up for several ministries to contact us with further details and not a single ministry ever followed up or contacted us.",
  "Follow up contacts after signing up to serve. Never heard from anyone after showing interest.",
  "I've signed up for the pantry, but no one has ever contacted me.",
  "I've signed up for serving and someone hasn't either reached out to me, or I haven't received any updates.",
  "When the church does a drive for recreational involvement the follow through does not occur.",
];

const commWallQuotes = [
  "The communication is extremely lacking and often extremely last minute... The text messaging service is confusing because messages from various ministries all come from the same phone number.",
  "We have never been able to get the texts from the childcare workers regarding our children",
  "A couple of times we did not receive texts when they sent the text",
  "Communications are often vague or misleading",
  "JHM emails don't come to me, no communication at all from group leaders.",
  "Our kids have missed some events because of poor communication",
  "I wish we got more emails about upcoming events and dates",
  "Maybe sending a text through the app. I didn't know we were having someone short notice",
];

const Wall = ({ quotes, on, min = 220, fontSize = 12.5 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    gap: 10, maxHeight: "60vh", overflowY: "auto", paddingRight: 4,
  }}>
    {quotes.map((q, i) => (
      <Reveal key={i} on={on} delay={i * 45}>
        <div style={{
          background: C.surface, border: `1px solid ${C.rule}`,
          padding: "10px 13px", fontFamily: SERIF, fontStyle: "italic",
          fontSize, lineHeight: 1.5, color: C.ink2, height: "100%",
        }}>
          {"\u201c" + q + "\u201d"}
        </div>
      </Reveal>
    ))}
  </div>
);

const toolRows = [
  { cat: "Payments", chain: [
    { name: "Pushpay" }, { name: "Subsplash", cost: "+$2k" },
    { name: "Square", cost: "+$2.5k" }, { name: "GiveSmart", cost: "+$3k" },
    { name: "Stripe (via Brushfire)", cost: "+$2.5k" },
  ], note: "full audit still pending" },
  { cat: "App", chain: [
    { name: "Subsplash" }, { name: "Studio C", cost: "+$5k" },
    { name: "Linktree", cost: "free, another layer" },
  ] },
  { cat: "Forms", chain: [
    { name: "CCB" }, { name: "Brushfire", cost: "+$2k" },
  ] },
  { cat: "Email marketing", chain: [
    { name: "Mailchimp" }, { name: "MailerLite", cost: "+$864" },
  ] },
  { cat: "Domains", chain: [
    { name: "Cloudflare" }, { name: "Bluehost" },
    { name: "Squarespace", cost: "+$232" }, { name: "Namecheap", cost: "+$70" },
  ] },
  { cat: "Project management", chain: [
    { name: "Trello" }, { name: "Basecamp", cost: "+$1k" },
    { name: "Asana", cost: "free, a third system" },
  ] },
  { cat: "Texting", chain: [
    { name: "Twilio" }, { name: "PastorLine", cost: "+$521" },
  ] },
  { cat: "File transfer", chain: [
    { name: "Dropbox" }, { name: "WeTransfer", cost: "+$234" },
  ] },
  { cat: "QR codes", chain: [
    { name: "Rebrandly" }, { name: "MyQRCode", cost: "+$100" },
  ] },
  { cat: "Editor", chain: [
    { name: "Photoshop" }, { name: "Canva", cost: "$250 · free via nonprofit" },
  ] },
];

/* Each slide: { section, steps, notes: [...], render(step) } */

const slides = [

  /* 1 · Title */
  {
    section: "Opening", steps: 0,
    notes: [
      "Welcome, set the frame: this is a walk through what the congregation told us and what our own systems show.",
      "Roughly 30 to 45 minutes with time for discussion at the end. Questions welcome throughout.",
    ],
    render: () => (
      <div>
        <Eyebrow>Foothills Church · Leadership</Eyebrow>
        <Headline size="clamp(36px, 6vw, 68px)">
          What we heard,<br /><em style={{ color: C.ink2 }}>what we found</em>
        </Headline>
        <Caption style={{ marginTop: 24, maxWidth: 520, fontSize: 17 }}>
          A look at communication, process, and technology at Foothills
        </Caption>
      </div>
    ),
  },

  /* 2 · Cold open question */
  {
    section: "CCB", steps: 0,
    notes: [
      "Ask this out loud and wait. Let people guess. 5,000? 8,000? Take a few answers before advancing.",
      "The guesses are the point. The gap between what they guess and the real number is the hook.",
    ],
    render: () => (
      <div style={{ textAlign: "center" }}>
        <Headline size="clamp(30px, 5vw, 58px)">
          How many individual records<br />do you think we have in CCB<br />right now?
        </Headline>
      </div>
    ),
  },

  /* 3 · 39,648 */
  {
    section: "CCB", steps: 0,
    notes: [
      "Let the number count up. Then just: that is the total number of individual records sitting in CCB today.",
      "Pause here. Do not rush past the reaction.",
    ],
    render: () => (
      <div style={{ textAlign: "center" }}>
        <Big><CountUp value={39648} /></Big>
        <Caption>total individual records in CCB</Caption>
      </div>
    ),
  },

  /* 4 · 25,586 active */
  {
    section: "CCB", steps: 0,
    notes: [
      "Of that total, over twenty five thousand are marked active in the system.",
      "Before the next slide, ask: how many people do we actually see on a given weekend?",
    ],
    render: () => (
      <div style={{ textAlign: "center" }}>
        <Big><CountUp value={25586} /></Big>
        <Caption>of those records are marked <strong style={{ color: C.ink }}>active</strong></Caption>
      </div>
    ),
  },

  /* 5 · The gap */
  {
    section: "CCB", steps: 2,
    notes: [
      "Click once: weekend attendance appears. We run two thousand to twenty five hundred on a good weekend.",
      "Click again: the question. Say it and let it sit. Where are the other twenty three thousand people?",
    ],
    render: (s) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(24px, 6vw, 80px)", flexWrap: "wrap" }}>
          <div>
            <Big size="clamp(52px, 9vw, 120px)">25,586</Big>
            <Caption>marked active</Caption>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 32, color: C.ink4, fontWeight: 200 }}>vs</div>
          <Reveal on={s >= 1}>
            <Big size="clamp(52px, 9vw, 120px)" warn>~2,500</Big>
            <Caption>on a good weekend</Caption>
          </Reveal>
        </div>
        <Reveal on={s >= 2} style={{ marginTop: 56 }}>
          <Headline size="clamp(22px, 3.4vw, 38px)">
            Where are the other <em>23,000 people?</em>
          </Headline>
        </Reveal>
      </div>
    ),
  },

  /* 6 · No status */
  {
    section: "CCB", steps: 3,
    notes: [
      "Almost two thirds of everyone in CCB has no status at all. Not member, not visitor, not attender. Nothing.",
      "Click: only 2,780 are formally marked Member.",
      "Click: and the statuses that do exist, Visitor, Attender, Guest, Member, none of them has a definition of when someone gets it or loses it.",
      "Click: ask the room, does anyone know what actually moves someone from attender to member, or from active to inactive? Let people answer. Do not rush this.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Who are our people?</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div>
            <Big size="clamp(44px, 7vw, 90px)"><CountUp value={24782} /></Big>
            <Caption>records have <strong style={{ color: C.warn }}>no status set at all</strong>, almost two thirds of the database</Caption>
          </div>
          <Reveal on={s >= 1}>
            <Big size="clamp(44px, 7vw, 90px)">2,780</Big>
            <Caption>are formally marked <strong style={{ color: C.ink }}>Member</strong></Caption>
          </Reveal>
          <Reveal on={s >= 2}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {["Visitor", "Attender", "Guest", "Member"].map((r) => (
                <span key={r} style={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 500,
                  border: `1px solid ${C.ruleStrong}`, color: C.ink2,
                  padding: "7px 15px", background: C.surface,
                }}>{r}</span>
              ))}
            </div>
            <Caption>These statuses all exist. <strong style={{ color: C.warn }}>None of them has a definition</strong> of when someone gets it, or when they lose it.</Caption>
          </Reveal>
        </div>
        <Reveal on={s >= 3} style={{ marginTop: 36 }}>
          <div style={{
            fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px, 2.2vw, 24px)",
            color: C.ink2, borderTop: `1px solid ${C.ruleStrong}`, paddingTop: 20,
          }}>
            Does anyone here know what moves someone from attender to member? Or from active to inactive?
          </div>
        </Reveal>
      </div>
    ),
  },

  /* 7 · Bridge line */
  {
    section: "CCB", steps: 1,
    notes: [
      "Anchor this to the mission, not to blame. Our mission is advancing Christ's rule in ourselves, our families, the church, and culture.",
      "Click: reaching people is at the heart of that mission. And reaching people starts with knowing who they are. That is the thread connecting everything you are about to see.",
    ],
    render: (s) => (
      <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px, 2.2vw, 24px)",
          color: C.ink3, marginBottom: 30,
        }}>
          {"\u201cAdvancing Christ's rule in ourselves, families, the church and culture.\u201d"}
        </div>
        <Reveal on={s >= 1}>
          <Headline size="clamp(26px, 4.2vw, 46px)">
            Reaching people starts with knowing who they are.
          </Headline>
        </Reveal>
      </div>
    ),
  },

  /* 8 · Survey intro */
  {
    section: "Survey", steps: 1,
    notes: [
      "So we asked the congregation. 261 people responded.",
      "Click: the snapshot. Most have been here five plus years, nearly half are currently serving. These are our most committed people.",
      "Frame it clearly: we did not go looking for these problems. The congregation told us without being asked.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>The survey</Eyebrow>
        <Headline>We asked the congregation.<br />261 people answered.</Headline>
        <Reveal on={s >= 1} style={{ marginTop: 44 }}>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${C.ruleStrong}`, background: C.surface, flexWrap: "wrap" }}>
            {[
              ["70%", "attending 5+ years"],
              ["47%", "currently serving"],
              ["58%", "age 56 and up"],
              ["31%", "parents of kids or youth"],
            ].map(([v, l], i) => (
              <div key={i} style={{ flex: "1 1 140px", padding: "22px 20px", borderRight: `1px solid ${C.ruleStrong}` }}>
                <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 34, color: C.ink }}>{v}</div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink3, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <Caption>These are not passing opinions. This is our core telling us what it is like.</Caption>
        </Reveal>
      </div>
    ),
  },

  /* 9 · Finding 1 — the app */
  {
    section: "Survey", steps: 2,
    notes: [
      "Sixty eight people brought up the app on their own. Nobody asked them to.",
      "Click through the two quotes. Read them out loud.",
      "Sixty percent say the app is where they go first. When it fails, it is not a small group affected, it is most of the church at once.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Finding one · The app</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36 }}>
          <Big size="clamp(44px, 7vw, 88px)"><CountUp value={68} duration={900} /></Big>
          <Headline size="clamp(18px, 2.4vw, 26px)" style={{ color: C.ink2 }}>
            people brought up the app on their own
          </Headline>
        </div>
        <Quote on={s >= 1}
          text={"\u201cI did not know where to look, tried the app and gave up.\u201d"}
          attr="36 to 45, attending 6 months to 2 years" />
        <Quote on={s >= 2}
          text={"\u201cThe search engine really doesn't work at all \u2026 I usually don't find what I'm looking for.\u201d"}
          attr="26 to 35, attending 5+ years" />
      </div>
    ),
  },

  /* 9b · App quote wall */
  {
    section: "Survey", steps: 1,
    notes: [
      "Those were two of them. Click, and let the wall fill in. Do not read these out loud. Just let the room scan for a moment.",
      "The point is not any single comment. The point is the volume. This many people took the time to write this, unprompted.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Finding one · In their own words</Eyebrow>
        <Headline size="clamp(20px, 3vw, 34px)" style={{ marginBottom: 24 }}>
          Those were two of them. Here are the rest.
        </Headline>
        <Wall quotes={appWallQuotes} on={s >= 1} min={200} fontSize={11.5} />
      </div>
    ),
  },

  /* 10 · Finding 2 — conflicting info */
  {
    section: "Survey", steps: 4,
    notes: [
      "31 percent said yes, they have hit conflicting event details. Another 24 percent said not sure, which usually means yes, they have just stopped noticing.",
      "Click: combined, that is 55 percent. Over half the congregation.",
      "Click through the three quotes. Read them out loud.",
      "The eye rolling quote is the one to slow down on. When people stop being surprised by something broken, that is worse than being frustrated. Expectations have already dropped.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Finding two · Conflicting information</Eyebrow>
        <div style={{ display: "flex", gap: 40, alignItems: "baseline", flexWrap: "wrap", marginBottom: 30 }}>
          <div>
            <Big size="clamp(34px, 5vw, 62px)" warn>31%</Big>
            <Caption>said <strong style={{ color: C.ink }}>yes</strong>, event details conflict</Caption>
          </div>
          <div>
            <Big size="clamp(34px, 5vw, 62px)">24%</Big>
            <Caption>said <strong style={{ color: C.ink }}>not sure</strong></Caption>
          </div>
          <Reveal on={s >= 1}>
            <Big size="clamp(34px, 5vw, 62px)" warn>55%</Big>
            <Caption>combined, over half the congregation</Caption>
          </Reveal>
        </div>
        <Quote on={s >= 2}
          text={"\u201cThey are so unreliable that I've basically avoided them and just reach out to people involved in the events to try to get accurate information.\u201d"}
          attr="26 to 35, attending 5+ years" />
        <Quote on={s >= 3}
          text={"\u201cIt's usually joking and eye rolling when there's confusing, conflicting, or lacking information, because 'this is how it always is.' I think that speaks volumes.\u201d"}
          attr="26 to 35, attending 5+ years" />
        <Quote on={s >= 4}
          text={"\u201cI can imagine it being a roadblock to a newcomer becoming more involved and getting plugged in, or even making it to church in the first place.\u201d"}
          attr="26 to 35, attending 5+ years" />
      </div>
    ),
  },

  /* 11 · Finding 3 — no follow up */
  {
    section: "Survey", steps: 2,
    notes: [
      "Twenty eight people said they signed up to serve and never heard back.",
      "Click through the quotes. The Ministry Fair gets named directly.",
      "This is not one person's story. The congregation is independently telling us the same thing our own numbers show.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Finding three · No one follows up</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36 }}>
          <Big size="clamp(44px, 7vw, 88px)" warn><CountUp value={28} duration={800} /></Big>
          <Headline size="clamp(18px, 2.4vw, 26px)" style={{ color: C.ink2 }}>
            people signed up to serve and never heard back
          </Headline>
        </div>
        <Quote on={s >= 1}
          text={"\u201cI've filled out a form twice to state that I want to serve \u2026 and I've never gotten a response back from you all.\u201d"}
          attr="56+, attending 6 months to 2 years" />
        <Quote on={s >= 2}
          text={"\u201cWe signed up for several ministries at the ministry fair \u2026 not a single ministry ever followed up or contacted us.\u201d"}
          attr="36 to 45, attending 6 months to 2 years" />
      </div>
    ),
  },

  /* 11b · Serve quote wall */
  {
    section: "Survey", steps: 1,
    notes: [
      "Click, and let them fill in. Again, do not read them all. Let the room take it in.",
      "Every one of these is a raised hand. Someone offering their time to this church, and hearing nothing back.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Finding three · In their own words</Eyebrow>
        <Headline size="clamp(20px, 3vw, 34px)" style={{ marginBottom: 24 }}>
          Every one of these is a raised hand.
        </Headline>
        <Wall quotes={serveWallQuotes} on={s >= 1} min={260} fontSize={13.5} />
      </div>
    ),
  },

  /* 12 · Alex */
  {
    section: "Survey", steps: 2,
    notes: [
      "Say his name. This is what twenty eight responses looks like for one real person.",
      "Click: February 1st. Filled out the serve form. No thank you email. No one reached out.",
      "Click: March 25th. He tried again. Still nothing. He has now tried twice, over two months, to give his time to this church.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>One name behind the number</Eyebrow>
        <Headline style={{ marginBottom: 48 }}>Alex Theis</Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <Reveal on={s >= 1}>
            <div style={{ display: "flex", gap: 24, alignItems: "baseline", borderLeft: `3px solid ${C.warn}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.ink, minWidth: 70 }}>Feb 1</div>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2vw, 22px)", color: C.ink2 }}>
                Filled out the Serve at Foothills form. No response. No one reached out.
              </div>
            </div>
          </Reveal>
          <Reveal on={s >= 2}>
            <div style={{ display: "flex", gap: 24, alignItems: "baseline", borderLeft: `3px solid ${C.warn}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.ink, minWidth: 70 }}>Mar 25</div>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2vw, 22px)", color: C.ink2 }}>
                Filled it out again. Still no response. Still no one reached out.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    ),
  },

  /* 13 · Process queue definition */
  {
    section: "Process", steps: 0,
    notes: [
      "Define it once, in plain language, before showing any numbers.",
      "A process queue is just a task telling a real person to follow up. It either gets done, or it doesn't. That's it. That's the whole concept.",
    ],
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        <Eyebrow>So what's actually happening behind the scenes?</Eyebrow>
        <Headline size="clamp(26px, 4.2vw, 46px)">
          A <em>process queue</em> is just a task telling a real person to follow up.
        </Headline>
        <Caption style={{ marginTop: 26, fontSize: 18 }}>
          It either gets done, or it doesn't.
        </Caption>
      </div>
    ),
  },

  /* 14 · Scale */
  {
    section: "Process", steps: 2,
    notes: [
      "4,027 of these tasks exist in the system right now.",
      "Click: 2,262 have not been started. Some are a few days overdue. Some are over seven years overdue.",
      "Click: of those, 1,843 have no one assigned at all. Say it clearly: it is not that someone is behind on their list. For most of these, there is no list with their name on it.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>The scale of it</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div>
            <Big size="clamp(46px, 7.5vw, 96px)"><CountUp value={4027} /></Big>
            <Caption>follow up tasks exist in the system right now</Caption>
          </div>
          <Reveal on={s >= 1}>
            <Big size="clamp(46px, 7.5vw, 96px)" warn>2,262</Big>
            <Caption>have not been started, some a few days overdue, some <strong style={{ color: C.warn }}>over 7 years</strong> overdue</Caption>
          </Reveal>
          <Reveal on={s >= 2}>
            <Big size="clamp(46px, 7.5vw, 96px)" warn>1,843</Big>
            <Caption>of those have <strong style={{ color: C.warn }}>no one assigned to follow up at all</strong></Caption>
          </Reveal>
        </div>
      </div>
    ),
  },

  /* 15 · Nadia */
  {
    section: "Process", steps: nadiaContacts.length + 1,
    notes: [
      "Nadia Martinez filled out one serve form and checked several ministries. Click through, each contact stacks in.",
      "Ten contacts in eleven days.",
      "The mechanism: each ministry she selected kicked off its own process queue. The communication is sitting right there on her profile. But there is no process telling staff to check it first. So each ministry opens their queue, sees her name, adds an email, and sends, without anyone pausing to look at what everyone else already sent her that same week.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>The other failure mode</Eyebrow>
        <Headline size="clamp(22px, 3.2vw, 36px)" style={{ marginBottom: 30 }}>
          Nadia Martinez filled out <em>one</em> form.
        </Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {nadiaContacts.map((c, i) => (
            <Reveal key={i} on={s >= i + 1}>
              <div style={{
                display: "flex", gap: 18, alignItems: "baseline",
                background: C.surface, border: `1px solid ${C.rule}`,
                padding: "9px 16px",
              }}>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.warn, minWidth: 52 }}>{c.d}</span>
                <span style={{ fontFamily: SANS, fontSize: 14, color: C.ink2 }}>{c.t}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal on={s >= nadiaContacts.length + 1} style={{ marginTop: 24 }}>
          <Headline size="clamp(19px, 2.6vw, 30px)">
            <span style={{ color: C.warn }}>10 contacts in 11 days.</span> Every one of them is visible on her profile. There is just no process that says to look.
          </Headline>
        </Reveal>
      </div>
    ),
  },

  /* 16 · 25 forms */
  {
    section: "Process", steps: 2,
    notes: [
      "That shared serve form is not the only one. There are twenty five separate serve forms across ministries.",
      "Click: here is why. The form technology cannot preselect a ministry from a link. So instead of one form that a link could point into, every serve opportunity got its own form. A technology limitation created twenty five forms and all the work that comes with them.",
      "Click: and on the main form, some selections have no queue behind them at all. Pick one of these today and nothing happens. No one is notified. No one follows up.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>It's not just one form</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 26 }}>
          <Big size="clamp(44px, 7vw, 88px)"><CountUp value={25} duration={800} /></Big>
          <Headline size="clamp(18px, 2.4vw, 26px)" style={{ color: C.ink2 }}>
            different serve forms across ministries
          </Headline>
        </div>
        <Reveal on={s >= 1}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2vw, 22px)", color: C.ink2, lineHeight: 1.6, marginBottom: 30, maxWidth: 780 }}>
            Why? The form technology can't preselect a ministry from a link. So every serve opportunity got its own form instead. A technology limitation created 25 forms, and all the process and staff work that comes with each one.
          </div>
        </Reveal>
        <Reveal on={s >= 2}>
          <Caption style={{ marginBottom: 14, color: C.ink2 }}>
            And on the main form, selecting any of these has <strong style={{ color: C.warn }}>no queue behind it</strong>. No notification. No follow up.
          </Caption>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {deadForms.map((f, i) => (
              <Reveal key={f} on={s >= 2} delay={i * 90}>
                <div style={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 500,
                  border: `1px solid ${C.warn}`, color: C.warn,
                  padding: "8px 16px", background: C.surface,
                }}>{f}</div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    ),
  },

  /* 16b · The responses nobody sees */
  {
    section: "Process", steps: 3,
    notes: [
      "Here is the part that makes this hard to catch. All of these forms do funnel into a serve process. That part is good.",
      "Click: but no one owns each form instance. And when a response can't be matched to a person record, it never gets added to the process at all. It just sits on the form.",
      "Click: ministries watching their serve queue will never see those people. From inside the queue, everything looks fine.",
      "Click: the only way to find them is for someone to open 25 plus forms, one by one, every day, and check for unmatched responses. No one is assigned to do that.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>The responses nobody sees</Eyebrow>
        <Headline size="clamp(22px, 3.2vw, 36px)" style={{ marginBottom: 34 }}>
          The forms do funnel into a serve process. <em>That part works.</em>
        </Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Reveal on={s >= 1}>
            <div style={{ borderLeft: `3px solid ${C.warn}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2.1vw, 23px)", color: C.ink, lineHeight: 1.55 }}>
                But when a response can't be matched to a person record, it never enters the process at all. It just sits on the form.
              </div>
            </div>
          </Reveal>
          <Reveal on={s >= 2}>
            <div style={{ borderLeft: `3px solid ${C.warn}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2.1vw, 23px)", color: C.ink, lineHeight: 1.55 }}>
                Ministries watching their serve queue will never see those people. From inside the queue, everything looks fine.
              </div>
            </div>
          </Reveal>
          <Reveal on={s >= 3}>
            <div style={{ borderLeft: `3px solid ${C.ink4}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2.1vw, 23px)", color: C.ink2, lineHeight: 1.55 }}>
                Finding them means opening 25 plus forms, one by one, every day, and checking for unmatched responses. No one owns that today.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    ),
  },

  /* 17 · Unsubscribe trap (moved earlier per review) */
  {
    section: "Communication", steps: 1,
    notes: [
      "And even when we do try to reach people, CCB unsubscribe is all or nothing. Opt out of one ministry's emails and you're out of everything, permanently, with no way back in.",
      "Click: somewhere between 1,500 and 2,000 people are currently unreachable by email through any ministry at all.",
      "The survey flagged the same thing on the text side. People who texted STOP once have no way to sign back up. And CCB does not even keep a record of text opt outs, so we cannot count that number.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>And when we do try to reach people</Eyebrow>
        <Headline style={{ marginBottom: 40 }}>
          Unsubscribe is <em>all or nothing.</em>
        </Headline>
        <Reveal on={s >= 1}>
          <Big size="clamp(52px, 9vw, 120px)" warn>~2,000</Big>
          <Caption>
            people are unreachable by email through <strong style={{ color: C.ink }}>any</strong> ministry. Permanently, with no way back in.
            <br />Sign up for something new? The confirmation and every email after it will never arrive.
          </Caption>
        </Reveal>
      </div>
    ),
  },

  /* 17b · Communication quote wall */
  {
    section: "Communication", steps: 1,
    notes: [
      "And the congregation feels it on the texting and email side too. Click for the wall.",
      "Texts that never arrive, parents who cannot get childcare messages, group leaders whose emails do not reach people, ministries all texting from the same number so no one knows who is talking.",
      "Hold onto that last one. It comes back in a few slides when we talk about how PastorLine got added without a process around it.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>Communication · In their own words</Eyebrow>
        <Headline size="clamp(20px, 3vw, 34px)" style={{ marginBottom: 24 }}>
          And people feel it on the texting side too.
        </Headline>
        <Wall quotes={commWallQuotes} on={s >= 1} min={260} fontSize={13.5} />
      </div>
    ),
  },

  /* 18 · The pattern */
  {
    section: "The pattern", steps: 0,
    notes: [
      "This is the throughline. Everything from here connects back to this one sentence.",
      "When there's no process in place, a ministry solves its own problem. And solving its own problem usually means new technology.",
    ],
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        <Eyebrow>Why does this keep happening?</Eyebrow>
        <Headline size="clamp(26px, 4.2vw, 46px)">
          When there's no process,<br />ministries build their own.
        </Headline>
        <Caption style={{ marginTop: 26, fontSize: 18 }}>
          And building their own usually means buying new technology.
        </Caption>
      </div>
    ),
  },

  /* 19 · Pattern in practice — the table */
  {
    section: "The pattern", steps: toolRows.length,
    notes: [
      "Click through each row. One gap, one new tool, every time.",
      "Each of these solved the one thing in front of it. Some cost real money, some were free, but every one added another place to check, another login, another system that doesn't talk to the others.",
      "Free doesn't mean it costs nothing. It still costs staff time, and it still splits where our information lives.",
      "Payments is the one still being fully audited, so that row is likely to grow.",
    ],
    render: (s) => (
      <div>
        <Eyebrow>One gap, one new tool, every time</Eyebrow>
        <div style={{ border: `1px solid ${C.ruleStrong}`, background: C.surface }}>
          {toolRows.map((r, i) => (
            <Reveal key={r.cat} on={s >= i + 1}>
              <div style={{
                display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap",
                padding: "10px 16px",
                borderBottom: i < toolRows.length - 1 ? `1px solid ${C.rule}` : "none",
              }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12.5, color: C.ink, minWidth: 150, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {r.cat}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "baseline", flex: 1 }}>
                  {r.chain.map((t, j) => (
                    <span key={j} style={{ fontFamily: SANS, fontSize: 13.5, color: C.ink2, display: "inline-flex", gap: 6, alignItems: "baseline" }}>
                      {j > 0 && <span style={{ color: C.ink4 }}>→</span>}
                      <span>{t.name}</span>
                      {t.cost && <span style={{ color: C.warn, fontWeight: 600, fontSize: 12.5 }}>{t.cost}</span>}
                    </span>
                  ))}
                  {r.note && <span style={{ fontFamily: SANS, fontSize: 12, color: C.ink3, fontStyle: "italic" }}>· {r.note}</span>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  /* 20 · The total */
  {
    section: "The pattern", steps: 1,
    notes: [
      "Adding up just the rows with a listed cost: over twenty thousand dollars in tools stacked on top of tools.",
      "Click: and that is before the payments audit is done, so this number is very likely low. A few of these additions were free but still added another system to manage, so the real cost is not only dollars.",
      "This is not the cost of the tools doing their job. This is the cost of not having one process everyone follows.",
    ],
    render: (s) => (
      <div style={{ textAlign: "center" }}>
        <Big warn><CountUp value={20000} prefix="$" suffix="+" /></Big>
        <Caption>in tools stacked on top of tools</Caption>
        <Reveal on={s >= 1} style={{ marginTop: 36 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(16px, 2.2vw, 23px)", color: C.ink2, maxWidth: 640, margin: "0 auto", lineHeight: 1.55 }}>
            And that's <em>before</em> the payments audit is finished. This is not the cost of tools doing their job. It is the cost of not having one process everyone follows.
          </div>
        </Reveal>
      </div>
    ),
  },

  /* 21 · Every one felt right */
  {
    section: "The pattern", steps: 1,
    notes: [
      "Nobody did anything wrong. Every one of these felt like the right call in the moment, for the ministry that made it.",
      "Click: but every time it happens, it costs more money, pulls our data further from one source of truth, and makes the next ministry more likely to do the exact same thing.",
      "This can't be solved ministry by ministry from the ground up. It has to be decided from the top, leadership deciding where things go, what to do when that's not enough, and who to ask before buying something new.",
    ],
    render: (s) => (
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <Headline size="clamp(24px, 3.8vw, 42px)">
          Every one of these felt like the right call in the moment.
        </Headline>
        <Reveal on={s >= 1} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 2.3vw, 25px)", color: C.ink2, lineHeight: 1.6 }}>
            Nobody did anything wrong. But each time, it costs more money, pulls our data further from one source of truth, and makes the next ministry more likely to do the same.
            <br /><br />
            This won't get fixed from the ground up. <em style={{ color: C.ink }}>It has to come from the top.</em>
          </div>
        </Reveal>
      </div>
    ),
  },

  /* 22 · Bringing it together */
  {
    section: "Close", steps: 3,
    notes: [
      "Communication, process, and technology aren't three separate problems.",
      "Click through: the technology lets ministries build their own thing. That creates uncoordinated processes. Those processes decide whether communication happens at all.",
      "And every time a ministry fills that gap on its own, it costs more and moves us further from one source of truth. This is the slide to remember walking out.",
    ],
    render: (s) => (
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <Eyebrow>Bringing it together</Eyebrow>
        <Headline style={{ marginBottom: 40 }}>One problem, showing up three ways.</Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {[
            ["Technology", "lets ministries build their own thing"],
            ["which creates processes", "that no one coordinates or owns"],
            ["which decides communication", "and whether anyone follows up at all"],
          ].map(([a, b], i) => (
            <Reveal key={i} on={s >= i + 1}>
              <div style={{ display: "flex", gap: 16, alignItems: "baseline", borderLeft: `3px solid ${i === 2 ? C.warn : C.ink4}`, paddingLeft: 20 }}>
                <span style={{ fontFamily: SERIF, fontSize: "clamp(18px, 2.6vw, 28px)", color: C.ink }}>
                  <strong style={{ fontWeight: 600 }}>{a}</strong>{" "}
                  <span style={{ color: C.ink2 }}>{b}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  /* 23 · Discussion */
  {
    section: "Close", steps: 4,
    notes: [
      "Open the room up. Click through the questions one at a time and let each one breathe.",
      "Question two closes the loop on the cold open. It is also the one leadership can genuinely start answering in this room today.",
      "The last one is the thesis. Technology can solve a lot, but without a clear process it creates churn. Someone has to own creating processes, and that decision lives in this room.",
      "Be ready for someone to answer the last question with, isn't that you? Decide beforehand what your answer is, and have the sentence ready.",
    ],
    render: (s) => (
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Eyebrow>A few questions for the room</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 10 }}>
          {[
            "Who should own the whole picture, making sure every form gets reviewed and every follow up gets assigned?",
            "What should it take for someone to be a member, an attender, or a visitor at Foothills?",
            "What should the path look like before a new tool gets bought?",
            "Technology can solve a lot of issues. But without a clear process, it can also create issues and churn. Is there someone responsible for creating processes?",
          ].map((q, i) => (
            <Reveal key={i} on={s >= i + 1}>
              <Headline size="clamp(19px, 2.6vw, 30px)" style={{ color: i === 3 ? C.ink : C.ink2 }}>
                {q}
              </Headline>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },
];

/* ── app shell ───────────────────────────────────────────────── */

export default function FoothillsDeck() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesHidden, setNotesHidden] = useState(true);

  const slide = slides[idx];
  const total = slides.length;

  const next = useCallback(() => {
    if (step < slides[idx].steps) setStep(step + 1);
    else if (idx < total - 1) { setIdx(idx + 1); setStep(0); }
  }, [idx, step, total]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
    else if (idx > 0) { setIdx(idx - 1); setStep(slides[idx - 1].steps); }
  }, [idx, step]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "n" || e.key === "N") { setNotesHidden(false); setNotesOpen((o) => !o); }
      else if (e.key === "h" || e.key === "H") {
        setNotesHidden((h) => {
          const nowHidden = !h;
          setNotesOpen(!nowHidden); // reveal → open the notes panel; hide → close it
          return nowHidden;
        });
      }
      else if (e.key === "Home") { setIdx(0); setStep(0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div
      style={{
        minHeight: "100vh", background: C.page, display: "flex", flexDirection: "column",
        fontFamily: SANS, userSelect: "none", cursor: "pointer", position: "relative",
      }}
      onClick={next}
    >
      {/* top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 28px", fontSize: 11.5, fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink3,
      }}>
        <span>Foothills Church</span>
        <span>{slide.section}</span>
      </div>

      {/* slide body */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px clamp(24px, 6vw, 90px) 60px",
      }}>
        <div key={idx} style={{ width: "100%", maxWidth: 1000, animation: "slideIn 0.45s ease" }}>
          {slide.render(step)}
        </div>
      </div>

      {/* bottom bar */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          display: "flex", alignItems: "center", gap: 16, padding: "0 28px 16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* progress ticks */}
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => { setIdx(i); setStep(0); }}
              title={`Slide ${i + 1}`}
              style={{
                height: 3, flex: 1, cursor: "pointer",
                background: i < idx ? C.ink3 : i === idx ? C.ink : C.ink4,
                opacity: i === idx ? 1 : i < idx ? 0.7 : 0.35,
                transition: "background 0.3s, opacity 0.3s",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.ink3, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
          {idx + 1} / {total}
        </div>
        {!notesHidden && (
          <button
            onClick={() => setNotesOpen((o) => !o)}
            style={{
              fontFamily: SANS, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", color: notesOpen ? C.surface : C.ink2,
              background: notesOpen ? C.ink : "transparent",
              border: `1px solid ${C.ruleStrong}`, padding: "6px 14px", cursor: "pointer",
            }}
          >
            Notes · N
          </button>
        )}
      </div>

      {/* notes drawer */}
      {notesOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", left: 0, right: 0, bottom: 46,
            background: C.ink, color: "#e8e7e2", padding: "18px 28px 20px",
            maxHeight: "38vh", overflowY: "auto", cursor: "default",
            boxShadow: "0 -8px 30px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8a84", marginBottom: 10 }}>
            Talking points · slide {idx + 1} · press H to hide
          </div>
          {slide.notes.map((n, i) => (
            <p key={i} style={{ fontFamily: SERIF, fontSize: 15.5, lineHeight: 1.6, margin: "0 0 10px" }}>{n}</p>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
