import { ContentItem, ChallengeItem, NewsItem, OfflineActivity, Topic } from '@/types';
import { CHALLENGES_DATASET } from './challengeService';

export const ALL_TOPICS: Topic[] = [
  'Science',
  'Technology & AI',
  'Psychology',
  'History',
  'World Affairs',
  'Business & Economics',
  'Nature & Space',
  'Philosophy',
  'Arts & Culture',
  'Programming',
  'General Knowledge',
];

export const CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'c-1',
    title: 'The Default Mode Network: Why Boredom Is Your Brain’s Superpower',
    subtitle: 'When you stop consuming, your brain quietly connects the dots.',
    topic: 'Psychology',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    summary:
      'Neuroscientists discovered that when we stop focusing on external stimuli, a constellation of brain regions called the Default Mode Network ignites, driving creative problem-solving and self-reflection.',
    content: [
      'For decades, cognitive neuroscientists assumed the brain was most active when solving hard problems or focusing intently on an external task. In the late 1990s, Marcus Raichle and his team at Washington University in St. Louis noticed an anomaly: when subjects in fMRI scanners rested between tasks, their brain metabolism barely dropped.',
      'In fact, a specific network of interconnected regions—including the medial prefrontal cortex and posterior cingulate—became dramatically more synchronized. They coined this the Default Mode Network (DMN).',
      'The DMN is the engine of autobiographical memory, moral reasoning, perspective-taking, and spontaneous insight. When you reach for your phone during an elevator ride or a red light, you extinguish the DMN before it has a chance to integrate your experiences.',
      'True creative breakthroughs rarely arrive when staring down a blinking cursor; they surface when walking, showering, or staring out the window—moments when the brain is allowed to wander without a feed to consume.'
    ],
    takeaways: [
      'The brain consumes nearly 20% of the body’s energy even during complete rest.',
      'The Default Mode Network links disparate memories to generate novel creative connections.',
      'Compulsive micro-checking of feeds robs the brain of the idle processing time needed for mental clarity.'
    ],
    publishedDate: '2026-03-12',
    tags: ['Neuroscience', 'Attention', 'Creativity'],
    sourceName: 'Annual Review of Neuroscience',
    recommendedReason: 'Recommended because you value mindful habits and psychology.',
    editorialAnalysis:
      'Editorial context: While focused analytical attention drives task completion, neuroscience proves that idle periods of zero digital input are necessary biological prerequisites for creative synthesis.',
    quiz: {
      question: 'When is the brain’s Default Mode Network (DMN) most synchronized?',
      options: [
        'When rapidly checking social notifications',
        'During passive wakeful rest, unhurried walks, or staring out the window',
        'Under acute psychological pressure',
        'Only while operating heavy machinery'
      ],
      correctOptionIndex: 1,
      hint: 'Think about when your mind wanders without a device.',
      explanation:
        'fMRI studies by Raichle et al. revealed that the DMN becomes highly synchronized during passive rest when external cognitive demands cease, linking memories and sparking creative breakthroughs.'
    }
  },
  {
    id: 'c-2',
    title: 'The Fast Inverse Square Root: A 1990s Bit Hack That Defied Math',
    subtitle: 'How John Carmack and Quake III solved 3D physics with a mysterious magic number.',
    topic: 'Programming',
    readTimeMinutes: 4,
    difficulty: 'Deep Dive',
    summary:
      'In 1999, calculating 1/√x was computationally brutal for hardware. Id Software used a mind-bending approximation with the hexadecimal constant 0x5f3759df that was 4x faster than standard division.',
    content: [
      'In 3D video game graphics and vector physics, calculating lighting and vector normalization requires computing 1 divided by the square root of a number millions of times per second. In the late 1990s, floating-point divisions and square roots were notorious CPU bottlenecks.',
      'When id Software open-sourced Quake III Arena in 2005, programmers inspected the physics engine and encountered a legendary function. It contained no loops, no standard math libraries, and this exact line of code:',
      'i = 0x5f3759df - ( i >> 1 ); // what the f***?',
      'By treating the IEEE 754 32-bit floating-point number directly as a 32-bit integer, bit-shifting it right by 1, and subtracting it from the magic hexadecimal constant 0x5f3759df, the algorithm generated a first guess accurate to within a few percent.',
      'A single iteration of Newton’s method then refined the guess to almost perfection. It demonstrated how deep understanding of silicon representations can unlock performance that textbook algorithms cannot touch.'
    ],
    takeaways: [
      'Floating-point numbers in IEEE 754 represent numbers in logarithmic-like binary segments.',
      'Treating float bits as integers allows logarithmic division to be simulated by a simple bit-shift.',
      'The mysterious constant was derived to minimize maximum error across the full floating-point domain.'
    ],
    publishedDate: '2026-02-18',
    tags: ['Computer Architecture', 'Algorithms', 'Game Engine'],
    sourceName: 'IEEE Micro Archives',
    recommendedReason: 'Top rated in Programming and Technical Curiosity.'
  },
  {
    id: 'c-3',
    title: 'Rogue Planets: Trillions of Worlds Drifting in Total Solitude',
    subtitle: 'Between the stars drift dark worlds that answer to no sun.',
    topic: 'Nature & Space',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    summary:
      'Astronomers estimate that our Milky Way galaxy contains more rogue planets—worlds ejected from their solar systems—than there are stars in the sky.',
    content: [
      'When we imagine planets, we instinctively picture them bound in graceful elliptical orbits around radiant stars. Yet recent gravitational microlensing surveys from the Roman Space Telescope and ground observatories reveal a haunting reality: our galaxy is teeming with orphaned planets.',
      'During the turbulent early formation of planetary systems, giant gas planets like Jupiter migrate inward, gravitationally slingshotting smaller terrestrial worlds entirely out of their parent stars’ gravitational wells.',
      'These nomad worlds wander through the freezing interstellar void for billions of years. Remarkably, astrobiologists hypothesize that some rogue planets with thick hydrogen atmospheres or radioactive geothermal cores could maintain liquid oceans beneath miles of protective ice sheets, shielded from cosmic rays.',
      'Life, if it exists on such worlds, would know no days, no seasons, and no night sky—thriving solely on the heat of planetary decay.'
    ],
    takeaways: [
      'Estimates suggest over 100 billion rogue planets exist in the Milky Way alone.',
      'Worlds can retain liquid sub-surface oceans despite 3 Kelvin interstellar temperatures.',
      'They are detected primarily through gravitational microlensing—bending the light of background stars.'
    ],
    publishedDate: '2026-01-29',
    tags: ['Astronomy', 'Exoplanets', 'Cosmology'],
    sourceName: 'The Astrophysical Journal',
    recommendedReason: 'Trending in Nature & Space.'
  },
  {
    id: 'c-4',
    title: 'The Stoic Dichotomy of Control: The Antidote to Modern Anxiety',
    subtitle: 'Epictetus wrote the manual on mental composure 2,000 years ago.',
    topic: 'Philosophy',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    summary:
      'Epictetus began the Enchiridion with a simple division: some things are up to us, and some things are not. Suffering arises almost entirely from confusing the two.',
    content: [
      'Born a slave in Hierapolis in 50 AD, Epictetus spent his youth in Rome under a cruel master before being freed and founding one of antiquity’s most influential philosophical schools in Greece.',
      'His core teaching was radically direct: in life, there are things within our complete control (our judgments, intentions, impulses, and actions), and things outside our control (our reputation, the opinions of others, health outcomes, the economy, and the weather).',
      'When modern people feel overwhelm or despair while scrolling social feeds, it is almost invariably because they are investing emotional energy into the opinions and outcomes of things outside their direct agency.',
      'The Stoic shift does not mean apathy; it means fierce, focused execution on what you can influence right now, while greeting external outcomes with calm equanimity.'
    ],
    takeaways: [
      'Focus 100% of emotional weight on your own actions, judgments, and ethics.',
      'Treat external outcomes as "preferred indifferents"—welcome if they happen, but not necessary for peace of mind.',
      'A single minute of asking "Is this within my control?" can defuse acute digital stress.'
    ],
    publishedDate: '2026-03-01',
    tags: ['Stoicism', 'Mental Health', 'Ancient Wisdom'],
    sourceName: 'The Enchiridion of Epictetus',
    recommendedReason: 'High signal for daily mental well-being.'
  },
  {
    id: 'c-5',
    title: 'The Mycelial Internet: How Forests Talk and Trade Underground',
    subtitle: 'Trees do not compete in a brutal vacuum; they form cooperative underground economies.',
    topic: 'Science',
    readTimeMinutes: 4,
    difficulty: 'Deep Dive',
    summary:
      'Forests are interconnected by vast underground fungal networks (mycorrhizae) that shuttle carbon, nitrogen, water, and warning signals between diverse species.',
    content: [
      'Beneath a single footprint in an old-growth forest lies several hundred kilometers of fungal threads known as mycorrhizal hyphae. Rather than passive soil dwellers, these fungi enter into an intimate symbiotic covenant with plant roots.',
      'Plants supply up to 30% of their photosynthesized sugars to the fungal network. In return, the mycelium uses its staggering surface area to absorb phosphorus, zinc, and moisture from bedrock and deliver it directly to the tree.',
      'Ecologist Suzanne Simard discovered using isotope tracing that older "mother trees" use this underground highway to prioritize sending carbon to struggling saplings in shaded understories—even across species boundaries, such as from Douglas firs to Paper birches.',
      'When an aphid infestation attacks a tree, it releases biochemical stress compounds into the fungal network, allowing neighbor trees hundreds of meters away to synthesize defense tannins before the pest even lands.'
    ],
    takeaways: [
      'Mycorrhizal fungi connect up to 90% of all land plant families in a cooperative web.',
      'Trees share resources across species lines based on seasonal sunlight differentials.',
      'Underground signaling allows preemptive pest defense throughout the canopy.'
    ],
    publishedDate: '2026-02-14',
    tags: ['Biology', 'Ecology', 'Mycology'],
    sourceName: 'Nature Ecology & Evolution',
    recommendedReason: 'Curated for biological curiosity.'
  },
  {
    id: 'c-6',
    title: 'Goodhart’s Law: When a Metric Becomes a Target, It Ceases to Be Useful',
    subtitle: 'Why hospital wait-time metrics, YouTube watch times, and coding KPIs backfire.',
    topic: 'Business & Economics',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    summary:
      'Economist Charles Goodhart formulated that once a measure is chosen as a performance target, people optimize for the metric rather than the underlying virtue it was meant to reflect.',
    content: [
      'In 1975, British economist Charles Goodhart pointed out a fatal flaw in monetary policy: whenever a government tried to control a specific measure of money supply to stabilize inflation, the relationship broke down because banking actors adapted their behavior specifically around the metric.',
      'Anthologist Marilyn Strathern later crystallized this into its famous cultural aphorism: "When a measure becomes a target, it ceases to be a good measure."',
      'We see this everywhere today: if social media algorithms target "session duration," they inevitably promote outrage and paranoia because conflict keeps thumbs moving. If software teams measure lines of code, engineers write bloated routines.',
      'The antidote is to evaluate holistic qualitative outcomes, rotate complementary counter-metrics, and cultivate intrinsic professional craftsmanship.'
    ],
    takeaways: [
      'Metrics are low-dimensional shadows of high-dimensional realities.',
      'Optimizing a single number always creates perverse systemic incentives.',
      'Counterbalance quantity metrics with friction and quality indicators.'
    ],
    publishedDate: '2026-01-15',
    tags: ['Economics', 'Systems Thinking', 'Incentives'],
    sourceName: 'Papers in Monetary Economics',
    recommendedReason: 'Essential mental model for modern systems.'
  },
  {
    id: 'c-7',
    title: 'The Library of Alexandria: The Real Tragedy Was Not a Single Fire',
    subtitle: 'Pop culture remembers one catastrophic blaze; historians know it was centuries of budget cuts.',
    topic: 'History',
    readTimeMinutes: 4,
    difficulty: 'Deep Dive',
    summary:
      'The loss of the ancient world’s greatest library was not an instantaneous apocalypse caused by Julius Caesar, but a slow decline of bureaucratic neglect, purges, and decaying papyrus.',
    content: [
      'The Great Library of Alexandria, founded around 300 BC by the Ptolemaic dynasty of Egypt, captured the imagination of history as the ultimate repository of classical wisdom. Popular lore claims Julius Caesar burned it to ash in 48 BC.',
      'While Caesar’s dockyard fire did destroy an estimated 40,000 scrolls stored in warehouse annexes near the harbor, the main library within the royal palace district survived for centuries afterward.',
      'The true demise was far more mundane: in 145 BC, Ptolemy VIII purged Alexandrian scholars and intellectuals, expelling the chief librarian Aristarchus. Later Roman rulers gradually reduced funding, and humid Mediterranean air degraded the fragile papyrus scrolls, which required continuous manual copying onto fresh parchment.',
      'The lesson of Alexandria is not that civilization is destroyed in one fiery night; it is that human knowledge requires deliberate, relentless institutional maintenance across generations.'
    ],
    takeaways: [
      'Julius Caesar burned harbor warehouses, not the entire intellectual apparatus.',
      'Scholar purges and imperial budget cuts did far more permanent damage than flame.',
      'Knowledge preservation is an active daily practice, not a museum display.'
    ],
    publishedDate: '2026-02-04',
    tags: ['Ancient History', 'Manuscripts', 'Archaeology'],
    sourceName: 'Journal of Hellenic Studies',
    recommendedReason: 'Fascinating historical correction.'
  },
  {
    id: 'c-8',
    title: 'The Attention Mechanism in Transformers: How LLMs "Look" at Words',
    subtitle: 'The simple dot-product formula that sparked the AI revolution.',
    topic: 'Technology & AI',
    readTimeMinutes: 5,
    difficulty: 'Deep Dive',
    summary:
      'Before transformers, computers processed sentences word-by-word like a tape recorder. Self-attention allowed every token to dynamically query every other token in parallel.',
    content: [
      'In 2017, a team of researchers at Google published "Attention Is All You Need", introducing the Transformer architecture. Previous recurrent neural networks (RNNs) struggled with long texts because by the time they reached word 50, they had forgotten the nuance of word 3.',
      'Transformers solved this by introducing Self-Attention. For every token (word or subword), the model creates three vectors: a Query (what am I looking for?), a Key (what do I offer?), and a Value (what information do I contain?).',
      'By computing the dot product between the Query of word A and the Keys of all other words, the model calculates an attention weight. In the sentence "The bank was muddy after the river flooded", the word "bank" assigns high attention to "muddy" and "river", allowing the model to know it is a riverbank, not a financial institution.',
      'Because all tokens calculate their attention weights simultaneously using matrix multiplication on GPUs, models could suddenly be trained on billions of parameters across the entire internet.'
    ],
    takeaways: [
      'Queries, Keys, and Values act like an information retrieval database inside matrix math.',
      'Parallel processing on GPUs made training on internet-scale corpora possible.',
      'Attention maps reveal how language models resolve pronouns and disambiguate word meanings.'
    ],
    publishedDate: '2026-03-20',
    tags: ['Machine Learning', 'Transformers', 'Artificial Intelligence'],
    sourceName: 'NeurIPS Proceedings',
    recommendedReason: 'Understand the math powering today’s AI.'
  }
];

export const CHALLENGE_ITEMS: ChallengeItem[] = CHALLENGES_DATASET;

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n-1',
    headline: 'High Seas Treaty Reaches Critical Threshold for Global Ocean Sanctuaries',
    summary:
      'The United Nations biodiversity agreement for waters beyond national jurisdiction has garnered key ratifications, paving the way to legally safeguard 30% of the open oceans by 2030.',
    whyItMatters:
      'International waters cover nearly half the planet but previously had virtually zero coordinated conservation frameworks against illegal deep-sea dredging and plastic pollution.',
    source: 'UN Oceans & Law of the Sea Secretariat',
    sourceUrl: 'https://www.un.org/depts/los/index.htm',
    publishedAt: '2026-03-24',
    readTimeMinutes: 2,
    category: 'Climate & Nature',
    verified: true
  },
  {
    id: 'n-2',
    headline: 'Europa Clipper Successfully Executes Gravitational Mars Flyby En Route to Jupiter',
    summary:
      'NASA’s flagship interplanetary probe completed its solar-array deployment and propulsion gravity assist around Mars, targeting arrival at Jupiter’s icy moon in 2030.',
    whyItMatters:
      'Europa harbors a warm, salty sub-surface ocean with more liquid water than all of Earth’s oceans combined, representing our solar system’s most promising site for extraterrestrial biology.',
    source: 'NASA Jet Propulsion Laboratory',
    sourceUrl: 'https://www.jpl.nasa.gov',
    publishedAt: '2026-03-22',
    readTimeMinutes: 3,
    category: 'Science & Space',
    verified: true
  },
  {
    id: 'n-3',
    headline: 'Global Semiconductor Supply Chains Pivot Toward Gallium Nitride & Advanced Packaging',
    summary:
      'Leading fabrication centers in Taiwan, Japan, and the EU are transitioning from planar silicon scaling toward wide-bandgap materials and chiplet 3D architectures.',
    whyItMatters:
      'As traditional Moore’s Law silicon limits are reached, wide-bandgap semiconductors reduce energy loss in high-voltage EV power systems and AI data centers by up to 40%.',
    source: 'IEEE Spectrum Engineering Dispatch',
    sourceUrl: 'https://spectrum.ieee.org',
    publishedAt: '2026-03-19',
    readTimeMinutes: 3,
    category: 'Economy & Tech',
    verified: true
  },
  {
    id: 'n-4',
    headline: 'Autonomous Submersibles Map 100+ Previously Unrecorded Marine Species on Nazca Ridge',
    summary:
      'An international scientific expedition using robotic deep-sea cameras surveyed underwater volcanic seamounts off South America, discovering bizarre deep-water corals and glass sponges.',
    whyItMatters:
      'Deep underwater mountain ranges act as isolated evolutionary islands. Cataloging their genetics provides critical baseline data before commercial deep-sea mining is debated.',
    source: 'Schmidt Ocean Institute',
    sourceUrl: 'https://schmidtocean.org',
    publishedAt: '2026-03-15',
    readTimeMinutes: 2,
    category: 'Science & Space',
    verified: true
  },
  {
    id: 'n-5',
    headline: 'The Straits of Malacca: International Maritime Patrols Implement Real-Time AIS Verification',
    summary:
      'Coastal authorities in Singapore, Malaysia, and Indonesia have introduced AI-verified vessel tracking to prevent navigational hazards in the world’s busiest maritime chokepoint.',
    whyItMatters:
      'Over 90,000 ships carrying one-fourth of global trade and 80% of East Asia’s crude oil transit this 1.5-mile narrow strait each year.',
    source: 'International Maritime Organization (IMO)',
    sourceUrl: 'https://www.imo.org',
    publishedAt: '2026-03-10',
    readTimeMinutes: 2,
    category: 'Geopolitics',
    verified: true
  }
];

export const OFFLINE_ACTIVITIES: OfflineActivity[] = [
  {
    id: 'off-1',
    title: 'The 5-4-3-2-1 Sensory Grounding',
    category: 'Mind',
    durationMinutes: 5,
    description:
      'An evidence-based psychological practice to instantaneously pull your brain out of digital dopamine loops and back into the physical room.',
    steps: [
      'Name 5 things you can visually see right now (notice their subtle colors and shadows).',
      'Feel 4 physical textures (your fabric, the cool wood of a table, your socks against the floor).',
      'Identify 3 distinct sounds around you (traffic, distant birds, air conditioning hum).',
      'Notice 2 smells in your immediate environment.',
      'Taste 1 lingering flavor or take one mindful sip of fresh water.'
    ],
    reflectionPrompt: 'What is one physical detail in your room you hadn’t noticed all day?',
    benefit: 'Lowers cortisol and deactivates acute screen agitation within 180 seconds.'
  },
  {
    id: 'off-2',
    title: 'The Neighborhood Micro-Walk (No Phone)',
    category: 'Body',
    durationMinutes: 10,
    description:
      'Step out the front door and walk 5 minutes in any direction, then turn back. Keep your hands empty.',
    steps: [
      'Leave your phone on your desk or put it into airplane mode in your pocket.',
      'Walk at a relaxed, unhurried pace without measuring steps or distance.',
      'Let your eyes focus on distant horizons and tree lines (panoramic vision triggers autonomic relaxation).',
      'Notice three different architectural details or plants along the street.'
    ],
    reflectionPrompt: 'How did your shoulder and neck posture feel after 5 minutes of walking?',
    benefit: 'Restores optic flow and resets circadian alertness via natural ambient lux.'
  },
  {
    id: 'off-3',
    title: 'Micro-Sketch an Everyday Object',
    category: 'Create',
    durationMinutes: 10,
    description:
      'Grab a stray pen and scrap piece of paper. Choose one mundane object within arm’s reach—a mug, an apple, a key—and draw it.',
    steps: [
      'Do not worry about artistic talent; this is an exercise in visual perception, not art critique.',
      'Look at the object 80% of the time, and at your paper only 20% of the time.',
      'Notice where the shadow falls on the tabletop and sketch the dark patch.',
      'Sign and date the scrap paper with a small smile.'
    ],
    reflectionPrompt: 'What geometric shape or contour surprised you when looking closely?',
    benefit: 'Shifts neural processing from verbal critique to tactile spatial reasoning.'
  },
  {
    id: 'off-4',
    title: 'Send an Unexpected Note of Gratitude',
    category: 'Social',
    durationMinutes: 5,
    description:
      'Think of one person who made a positive difference in your life recently or years ago, and send them a brief, zero-expectation text.',
    steps: [
      'Pick someone you haven’t spoken to in a while or someone whose quiet effort often goes uncelebrated.',
      'Write 2-3 genuine sentences: "Hey, I was just thinking about that time you helped me with [X]. Really appreciate having you in my life."',
      'Hit send without waiting for or needing an immediate reply.',
      'Put your phone facedown.'
    ],
    reflectionPrompt: 'Who did you reach out to, and how did saying thank you feel in your chest?',
    benefit: 'Oxytocin release and pro-social warmth that outlasts any feed dopamine hit.'
  },
  {
    id: 'off-5',
    title: 'The Unplugged Window Stare',
    category: 'Unplug',
    durationMinutes: 5,
    description:
      'Stand or sit comfortably by an open window. Allow your eyes to drift into soft focus toward the clouds or tree branches.',
    steps: [
      'Rest your hands loosely on your lap or windowsill.',
      'Take 5 deliberate slow breaths: 4 seconds in through the nose, 6 seconds gentle out through the mouth.',
      'Observe movement: clouds shifting, birds darting, leaves fluttering in the wind.',
      'Let thoughts float by without clinging to them or turning them into a to-do list.'
    ],
    reflectionPrompt: 'What kind of sky or weather is greeting the world outside right now?',
    benefit: 'Relieves ciliary muscle spasm from phone screen focal distance.'
  },
  {
    id: 'off-6',
    title: 'Decompress: Cervical Spine & Chest Opening',
    category: 'Body',
    durationMinutes: 10,
    description:
      'Counteract "text neck" and rounded shoulders caused by downward phone tilting.',
    steps: [
      'Interlace fingers behind your head, gently draw elbows back, and look slightly toward the ceiling.',
      'Perform 10 slow shoulder rolls backward.',
      'Place forearm against a doorframe at 90 degrees and rotate your chest gently away to stretch the pectorals.',
      'Finish with 5 deep diaphragmatic breaths standing tall.'
    ],
    reflectionPrompt: 'Did you notice tension releasing from your upper trapezius muscles?',
    benefit: 'Improves oxygenation and eases the physical strain of forward-head posture.'
  }
];
