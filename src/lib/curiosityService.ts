import { Topic, ContentDifficulty, CuriosityDiscovery } from '@/types';

/**
 * Curated educational discoveries across science, technology, history, psychology,
 * nature & space, philosophy, and economics.
 * Each item contains verified citations, paragraphs, takeaways, and optional comprehension quizzes.
 */
export const CURIOSITY_DISCOVERIES: CuriosityDiscovery[] = [
  {
    id: 'cur-1',
    title: 'The Default Mode Network: Why Boredom Is Your Brain’s Superpower',
    subtitle: 'When you stop consuming feeds, your brain quietly connects the dots.',
    topic: 'Psychology',
    summary:
      'Neuroscientists discovered that when we stop focusing on external stimuli, a constellation of brain regions called the Default Mode Network ignites, driving creative problem-solving and self-reflection.',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    publishedDate: '2026-03-12',
    tags: ['Neuroscience', 'Creativity', 'Attention'],
    source: {
      name: 'Annual Review of Neuroscience',
      url: 'https://www.annualreviews.org/journal/neuro',
      citation: 'Raichle, M. E. (2015). The brain’s default mode network. Annual Review of Neuroscience, 38, 433-447.',
    },
    bodyContent: [
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
    editorialAnalysis:
      'Editorial note: While focused execution is vital for output, cognitive science proves that deliberate periods of zero digital input are necessary biological prerequisites for original thought.',
    recommendedReason: 'Recommended because you value mindful habits and psychology.',
    quiz: {
      question: 'Under what physical condition does the Default Mode Network (DMN) exhibit peak synchronized activity?',
      options: [
        'During high-speed mathematical calculations under stress',
        'When the mind is idle, resting, and free from external task demands',
        'While playing fast-twitch video games',
        'Only during REM dream sleep'
      ],
      correctOptionIndex: 1,
      hint: 'Think about what you do in the shower or on an unhurried walk.',
      explanation:
        'The DMN was discovered precisely because fMRI scans revealed heightened metabolic synchronization during passive wakeful rest—when subjects were not engaged in goal-oriented external tasks.'
    }
  },
  {
    id: 'cur-2',
    title: 'The Antikythera Mechanism: A 2,000-Year-Old Analog Computer',
    subtitle: 'Bronze gears from ancient Greece that accurately predicted eclipses.',
    topic: 'History',
    summary:
      'Discovered in a Roman shipwreck in 1901, this shoebox-sized device contained over 30 precision bronze gears calculating lunar phases, planetary positions, and Olympiad cycles.',
    readTimeMinutes: 4,
    difficulty: 'Deep Dive',
    publishedDate: '2026-02-28',
    tags: ['Archaeology', 'Ancient Engineering', 'Astronomy'],
    source: {
      name: 'Nature / Antikythera Mechanism Research Project',
      url: 'https://www.nature.com/articles/nature05357',
      citation: 'Freeth, T. et al. (2006). Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism. Nature, 444, 587-591.',
    },
    bodyContent: [
      'In 1901, Greek sponge divers off the coast of Antikythera retrieved a corroded lump of bronze from a 1st-century BC shipwreck. For decades, historians assumed it was an astrolabe or navigation clock.',
      'High-resolution 3D X-ray tomography by the Antikythera Mechanism Research Project revealed its staggering reality: inside were over 30 interlocking gear wheels with teeth shaved down to fractions of a millimeter.',
      'By turning a hand crank on the casing, the user could model the elliptical orbit of the Moon—using a clever pin-and-slot differential gear that simulated Keplerian speed variation sixteen centuries before Kepler.',
      'The device proved that Hellenistic civilization possessed mechanical engineering capabilities that would not reappear in Europe until cathedral clocks in the 14th century.'
    ],
    takeaways: [
      'The mechanism used differential gearing 1,500 years before European clockmakers reinvented it.',
      'It predicted solar and lunar eclipses down to the exact hour and color shadow.',
      'Technological progress is not always linear; complex knowledge can be lost for millennia.'
    ],
    editorialAnalysis:
      'Editorial note: The Antikythera Mechanism is a humbling reminder that civilization can forget foundational engineering feats if institutional memory breaks down.',
    recommendedReason: 'Top historical discovery in ancient science.',
    quiz: {
      question: 'How did the Antikythera Mechanism simulate the non-uniform speed of the Moon across the night sky?',
      options: [
        'Using an electrical capacitor charged by static amber',
        'Through a mechanical pin-and-slot gear that shifted the center of rotation',
        'Using fluid mercury hydraulics inside bronze tubes',
        'It could not model speed variations and assumed a perfect circle'
      ],
      correctOptionIndex: 1,
      hint: 'Look for the mechanical gear slot mechanism that offsets an axis.',
      explanation:
        'Ancient Greek engineers used an ingenious pin-and-slot gear: by offsetting the centers of two interlocking gears, the pin slid back and forth in the slot, mimicking the Moon’s acceleration at perigee and deceleration at apogee.'
    }
  },
  {
    id: 'cur-3',
    title: 'The Mycelial Underground Economy: How Forests Cooperate',
    subtitle: 'Trees do not compete in a vacuum; they trade sugars and warnings through fungal highways.',
    topic: 'Nature & Space',
    summary:
      'Beneath a single footstep in an old-growth forest lies miles of fungal threads that shuttle carbon, nitrogen, water, and warning signals between diverse species.',
    readTimeMinutes: 4,
    difficulty: 'Deep Dive',
    publishedDate: '2026-02-14',
    tags: ['Ecology', 'Mycology', 'Botany'],
    source: {
      name: 'Nature Ecology & Evolution',
      url: 'https://www.nature.com/natecolevol/',
      citation: 'Simard, S. W. et al. (1997). Net transfer of carbon between ectomycorrhizal tree species in the field. Nature, 388, 579-582.',
    },
    bodyContent: [
      'Beneath the soil of ancient forests lies a microscopic web of fungal threads known as mycorrhizae. Rather than passive decomposers, these fungi form an intimate symbiotic relationship with tree root systems.',
      'Trees photosynthesize sunlight into carbohydrates, pumping up to 30% of their sugar production down to fungal partners. In exchange, the microscopic surface area of the fungus scavenges phosphorus, zinc, and water from bedrock and delivers it back to the tree.',
      'Using carbon isotope tracing, ecologist Suzanne Simard proved that older "mother trees" use this underground pipeline to prioritize sending nutrients to struggling saplings in shaded understories—even across species boundaries, such as from Douglas firs to Paper birches.',
      'When an insect infestation attacks one tree, it releases defense chemicals into the fungal network, alerting neighboring trees hundreds of meters away so they can synthesize pest tannins before the bugs arrive.'
    ],
    takeaways: [
      'Mycorrhizal fungi connect up to 90% of all land plant families in a cooperative web.',
      'Nutrient trade flows dynamically based on seasonal sunlight differentials.',
      'Underground biochemical signaling allows preemptive forest-wide pest defense.'
    ],
    editorialAnalysis:
      'Editorial note: This discovery overturned the simplistic view of Darwinian nature as pure dog-eat-dog competition, revealing that complex ecosystems rely on mutualistic infrastructure.',
    recommendedReason: 'Curated for biological curiosity.',
    quiz: {
      question: 'What primary resource do trees supply to mycorrhizal fungi in exchange for minerals and water?',
      options: [
        'Pure oxygen gas',
        'Photosynthesized carbohydrates and sugars',
        'Heavy metals and lead',
        'Direct sunlight channeled through root fibers'
      ],
      correctOptionIndex: 1,
      hint: 'What do green leaves manufacture from sunlight and carbon dioxide?',
      explanation:
        'Fungi cannot photosynthesize. Trees provide them with up to 30% of their fixed carbon sugars, and in return, the fungi scavenge vital soil minerals and moisture that tree roots cannot reach.'
    }
  },
  {
    id: 'cur-4',
    title: 'The Attention Mechanism in Transformers: How AI "Looks" at Words',
    subtitle: 'The simple matrix dot-product that sparked the modern generative AI revolution.',
    topic: 'Technology & AI',
    summary:
      'Before transformers, computers read sentences word-by-word like a tape recorder. Self-attention allowed every token to dynamically query every other token in parallel.',
    readTimeMinutes: 5,
    difficulty: 'Deep Dive',
    publishedDate: '2026-03-20',
    tags: ['Machine Learning', 'Transformers', 'Algorithms'],
    source: {
      name: 'NeurIPS Proceedings / Google Brain',
      url: 'https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html',
      citation: 'Vaswani, A. et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30.',
    },
    bodyContent: [
      'Prior to 2017, natural language processing relied on recurrent neural networks (RNNs). Because RNNs processed text sequentially, by word 50 the model had forgotten the contextual nuances of word 2.',
      'A research team at Google published "Attention Is All You Need," introducing the Transformer architecture. Transformers eliminated sequential recurrence entirely, allowing all words in a document to be processed simultaneously on GPUs.',
      'For every word token, the model calculates three vectors: a Query (what am I looking for?), a Key (what information do I represent?), and a Value (what meaning do I contain?).',
      'By computing the dot product between word Queries and word Keys, the model produces an attention map. In the sentence "The bank was muddy after the river flooded," the word "bank" assigns high attention weight to "river" and "flooded," disambiguating it as a riverbank rather than a financial institution.'
    ],
    takeaways: [
      'Self-attention calculates dynamic pairwise relationships across all tokens simultaneously.',
      'Queries, Keys, and Values formulate language understanding as an information-retrieval database.',
      'Parallel processing on modern GPU clusters made training on internet-scale corpora feasible.'
    ],
    editorialAnalysis:
      'Editorial note: Understanding the mathematical mechanics of attention demystifies AI from "magic" into matrix arithmetic and vector similarity.',
    recommendedReason: 'Understand the math powering today’s AI.',
    quiz: {
      question: 'Why did the Transformer architecture outperform previous Recurrent Neural Networks (RNNs)?',
      options: [
        'It processed words one by one much slower to prevent errors',
        'It allowed parallel processing of all tokens and eliminated sequential memory loss',
        'It replaced mathematical matrices with human biological neurons',
        'It required zero training data'
      ],
      correctOptionIndex: 1,
      hint: 'Think about GPU matrix parallelization vs a tape recorder.',
      explanation:
        'Transformers discarded recurrence, allowing GPUs to process entire paragraphs in parallel while computing attention weights across all word pairs simultaneously.'
    }
  },
  {
    id: 'cur-5',
    title: 'Goodhart’s Law: When a Metric Becomes a Target, It Ceases to Be Useful',
    subtitle: 'Why social media algorithms, hospital wait times, and coding KPIs inevitably backfire.',
    topic: 'Business & Economics',
    summary:
      'Economist Charles Goodhart showed that once a measure is chosen as a performance target, people optimize for the metric rather than the underlying virtue it was meant to reflect.',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    publishedDate: '2026-01-15',
    tags: ['Economics', 'Systems Thinking', 'Incentives'],
    source: {
      name: 'Papers in Monetary Economics',
      url: 'https://www.bankofengland.co.uk',
      citation: 'Goodhart, C. A. E. (1975). Problems of Monetary Management: The U.K. Experience. Papers in Monetary Economics, Reserve Bank of Australia.',
    },
    bodyContent: [
      'In 1975, British central banker Charles Goodhart noted a recurring flaw in monetary policy: whenever a government tried to control a specific measure of money supply to curb inflation, the statistical relationship collapsed because financial institutions altered their behavior around the metric.',
      'Anthropologist Marilyn Strathern later crystallized this into its famous cultural formulation: "When a measure becomes a target, it ceases to be a good measure."',
      'We see this everywhere in modern digital life: when social media algorithms target "user session duration," they inevitably promote outrage and sensationalism, because tribal conflict keeps thumbs scrolling longest.',
      'The remedy is not to eliminate numbers, but to recognize that metrics are low-dimensional shadows of high-dimensional realities. Healthy systems counterbalance quantity targets with friction and qualitative craft.'
    ],
    takeaways: [
      'Optimizing a single number creates perverse systemic incentives.',
      'Metrics should inform judgment, not replace it.',
      'Counterbalance quantity metrics with qualitative health checks.'
    ],
    editorialAnalysis:
      'Editorial note: Goodhart’s Law explains why Elsewhere does not measure endless feed engagement, choosing instead finite batches and natural stopping points.',
    recommendedReason: 'Essential mental model for modern systems.'
  },
  {
    id: 'cur-6',
    title: 'The Stoic Dichotomy of Control: The Antidote to Digital Despair',
    subtitle: 'Epictetus wrote the manual on emotional composure 2,000 years ago.',
    topic: 'Philosophy',
    summary:
      'Epictetus began the Enchiridion with a simple division: some things are up to us, and some things are not. Suffering arises almost entirely from confusing the two.',
    readTimeMinutes: 3,
    difficulty: 'Bite-sized',
    publishedDate: '2026-03-01',
    tags: ['Stoicism', 'Mental Health', 'Ancient Philosophy'],
    source: {
      name: 'The Enchiridion of Epictetus',
      url: 'https://classics.mit.edu/Epictetus/epicench.html',
      citation: 'Epictetus. (c. 125 AD). Enchiridion (Handbook). Translated by Elizabeth Carter.',
    },
    bodyContent: [
      'Born a slave in Hierapolis around 50 AD, Epictetus endured physical hardship before being freed and establishing one of antiquity’s most influential philosophical academies in Greece.',
      'His core teaching was uncompromising: there are things within our direct agency (our choices, judgments, values, and reactions), and things outside our agency (the economy, the weather, world events, and the opinions of others).',
      'When people feel anxious while consuming news feeds, it is usually because they are investing emotional energy into distant outcomes they cannot unilaterally change, while neglecting the immediate actions right in front of them.',
      'The Stoic shift does not mean turning away from the world; it means acting with focused virtue where you have leverage, while greeting macro events with sober composure.'
    ],
    takeaways: [
      'Focus 100% of emotional weight on your own actions, judgments, and ethics.',
      'Treat external outcomes as "preferred indifferents"—welcome if favorable, but not required for peace of mind.',
      'A single mindful breath asking "Is this within my control?" can defuse acute digital stress.'
    ],
    editorialAnalysis:
      'Editorial note: Stoicism is not emotional suppression; it is emotional conservation so you have the energy to do what actually matters.'
  }
];

// Reusable data-access functions

/**
 * Fetch all educational discoveries with optional filtering
 */
export async function getCuriosityDiscoveries(filter?: {
  topic?: Topic;
  difficulty?: ContentDifficulty;
}): Promise<CuriosityDiscovery[]> {
  let results = [...CURIOSITY_DISCOVERIES];
  if (filter?.topic) {
    results = results.filter((d) => d.topic === filter.topic);
  }
  if (filter?.difficulty) {
    results = results.filter((d) => d.difficulty === filter.difficulty);
  }
  return results;
}

/**
 * Fetch a single curiosity discovery by its ID
 */
export async function getCuriosityDiscoveryById(id: string): Promise<CuriosityDiscovery | null> {
  const found = CURIOSITY_DISCOVERIES.find((d) => d.id === id);
  return found || null;
}

/**
 * Fetch discoveries matching a specific topic
 */
export async function getCuriosityDiscoveriesByTopic(topic: Topic): Promise<CuriosityDiscovery[]> {
  return CURIOSITY_DISCOVERIES.filter((d) => d.topic === topic);
}

/**
 * Search discoveries by title, summary, topic, or tags
 */
export async function searchCuriosityDiscoveries(query: string): Promise<CuriosityDiscovery[]> {
  const q = query.toLowerCase().trim();
  if (!q) return CURIOSITY_DISCOVERIES;

  return CURIOSITY_DISCOVERIES.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.topic.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Get the current featured discovery
 */
export async function getFeaturedDiscovery(): Promise<CuriosityDiscovery> {
  return CURIOSITY_DISCOVERIES[0];
}
