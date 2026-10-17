import { FindSomethingActivity } from '../types/findSomething';

export const FIND_SOMETHING_ACTIVITIES: FindSomethingActivity[] = [
  // ==========================================
  // 2 MINUTES (Micro-Resets)
  // ==========================================
  {
    id: 'fsa-2m-cur-1',
    title: 'The Archimedes Eureka Moment',
    subtitle: 'Why submerging in water cracked a king’s gold mystery.',
    durationMinutes: 2,
    moods: ['curious'],
    topic: 'Science',
    category: 'curiosity',
    qualityRating: 9.6,
    description: 'A 120-second exploration into fluid displacement and how density solved ancient metallurgy fraud.',
    whySelectedTemplate: 'Perfect 2-minute curious spark about physics in the ancient world.',
    interactivePayload: {
      paragraphs: [
        'In the 3rd century BC, King Hiero II of Syracuse suspected his goldsmith had diluted a solid gold crown with cheaper silver. He tasked Archimedes with proving the fraud without damaging the consecrated crown.',
        'Puzzling over the conundrum, Archimedes slipped into a full public bath and watched the water spill over the rim. In a flash of insight, he realized that an irregular crown made of pure gold would displace exactly the same volume of water as an equal weight of gold bullion.',
        'Because silver is less dense than gold, a silver-alloyed crown would have greater volume and displace noticeably more water. Archimedes tested it in a vessel, measured the overflow, and caught the goldsmith red-handed.'
      ],
      takeaways: [
        'Volume displacement allows precise density measurement of irregular shapes.',
        'Insight struck Archimedes during physical rest, not forced desktop strain.',
        'Density is mass divided by volume—a cornerstone of modern physics.'
      ],
      reflectionPrompt: 'When was the last time a tough problem clicked while you were relaxing?',
      sourceName: 'Vitruvius, De Architectura Book IX'
    }
  },
  {
    id: 'fsa-2m-ent-1',
    title: 'The Ship of Theseus in 120 Seconds',
    subtitle: 'If you replace every plank of wood, is it still the same ship?',
    durationMinutes: 2,
    moods: ['entertained', 'curious'],
    topic: 'Philosophy',
    category: 'entertainment',
    qualityRating: 9.4,
    description: 'A fast, witty thought experiment that has challenged kings, neuroscientists, and programmers for 2,500 years.',
    interactivePayload: {
      paragraphs: [
        'Theseus sailed back from Crete in an ancient wooden galley. Over decades, the citizens of Athens carefully preserved the ship. Whenever a wooden plank rotted, they replaced it with fresh, sturdy timber.',
        'Eventually, not a single original sliver of wood from Theseus’s maiden voyage remained. Philosophers argued: is this still the Ship of Theseus?',
        'Then philosopher Thomas Hobbes added a comedic twist: what if a harbor scavenger collected every single discarded rotten plank, restored them in a drydock, and rebuilt a second ship? Which ship is the authentic Ship of Theseus?',
        'This paradox applies to you: nearly every cell in your biological body is replaced every 7 to 10 years. Are you the material hardware, or the continuity of the pattern?'
      ],
      takeaways: [
        'Identity is often an informational pattern rather than static physical matter.',
        'Hobbes’s twist reveals how naming and ownership rely on social convention.',
        'You are constantly renovating your own cells while retaining your autobiographical memory.'
      ],
      reflectionPrompt: 'What makes you "you"—your physical parts or your enduring story?'
    }
  },
  {
    id: 'fsa-2m-men-1',
    title: 'The Bat & Ball Price Trap',
    subtitle: 'Can you override your brain’s instant reflex in 90 seconds?',
    durationMinutes: 2,
    moods: ['mentally_challenged'],
    topic: 'Psychology',
    category: 'challenge',
    qualityRating: 9.8,
    description: 'The premier question from Shane Frederick’s Cognitive Reflection Test. Over 50% of Harvard and MIT students get this wrong on their first glance.',
    interactivePayload: {
      prompt: 'A bat and a ball together cost $1.10 in total. The bat costs exactly $1.00 more than the ball.',
      question: 'How much does the ball cost on its own?',
      options: [
        '10 cents ($0.10)',
        '5 cents ($0.05)',
        '1 cent ($0.01)',
        'It cannot be determined without knowing the tax rate.'
      ],
      correctOptionIndex: 1,
      hint: 'If the ball cost 10 cents, and the bat costs $1.00 more than the ball ($1.10), what would the total be? ($1.10 + $0.10 = $1.20!)',
      explanation:
        'Your System 1 automatic brain immediately sees $1.10 and $1.00 and blurts out "10 cents". But if the ball is $0.05 and the bat is $1.00 more ($1.05), their sum is exactly $1.10! Slowing down for 3 seconds overcomes the cognitive trap.'
    }
  },
  {
    id: 'fsa-2m-inf-1',
    title: 'The Subsea Cable Reality',
    subtitle: '99% of global internet traffic travels through thin glass on ocean floors.',
    durationMinutes: 2,
    moods: ['informed'],
    topic: 'Technology & AI',
    category: 'news',
    qualityRating: 9.3,
    description: 'A rapid reality check on how the physical internet actually connects humanity across oceans.',
    interactivePayload: {
      paragraphs: [
        'Most people assume the global cloud operates primarily via satellites beaming data through space. In reality, satellites handle less than 1% of international communications.',
        'Over 99% of transoceanic data relies on approximately 550 undersea fiber-optic cables spanning 1.4 million kilometers—enough to wrap around the Earth 35 times.',
        'Each cable is barely the diameter of a garden hose. Inside are fragile glass strands carrying laser pulses across the Mariana Trench and mid-Atlantic ridges, sheathed in steel wire and tar to protect against shark bites and ship anchors.'
      ],
      takeaways: [
        'Undersea fiber cables handle 99% of global internet and financial transactions.',
        'A single severed cable off the coast of Alexandria or Taiwan can slow down internet for entire continents.',
        'The physical infrastructure of the digital world is surprisingly fragile and tangible.'
      ],
      sourceName: 'TeleGeography Submarine Cable Map 2026'
    }
  },
  {
    id: 'fsa-2m-off-1',
    title: 'The 120-Second Box Breathing Reset',
    subtitle: 'The tactical nervous system decompressor used by rescue divers and astronauts.',
    durationMinutes: 2,
    moods: ['offline'],
    topic: 'Psychology',
    category: 'offline',
    qualityRating: 9.7,
    description: 'Deactivate rapid screen-induced sympathetic arousal and restore calm autonomic balance.',
    interactivePayload: {
      steps: [
        'Empty your lungs completely. Inhale smoothly through your nose for 4 counts.',
        'Hold your breath gently with lungs full for 4 counts.',
        'Exhale smoothly through your mouth for 4 counts.',
        'Hold your breath empty for 4 counts.',
        'Repeat this box cycle 4 times over the next 2 minutes.'
      ],
      reflectionPrompt: 'Did your heart rate decelerate and your chest loosen during the hold?',
      benefit: 'Stimulates the vagus nerve, reducing acute blood pressure spikes within 90 seconds.'
    }
  },

  // ==========================================
  // 5 MINUTES (Quick Breaks)
  // ==========================================
  {
    id: 'fsa-5m-cur-1',
    title: 'The Default Mode Network: Why Boredom Fuels Creativity',
    subtitle: 'When you put down your feed, your brain’s subconscious engine roars to life.',
    durationMinutes: 5,
    moods: ['curious'],
    topic: 'Psychology',
    category: 'curiosity',
    qualityRating: 9.8,
    description: 'Neuroscience reveals why idle mental pauses are the biological prerequisite for genuine breakthroughs.',
    interactivePayload: {
      paragraphs: [
        'When you rest between tasks without checking your phone, your brain metabolism barely drops. Neuroscientists at Washington University discovered that an interconnected constellation of brain regions—the Default Mode Network (DMN)—ignites during idle moments.',
        'The DMN is the headquarters of autobiographical memory, moral perspective-taking, and spontaneous creative synthesis. It links disparate fragments of your week into coherent ideas.',
        'Every time you reflexively reach for your phone during an elevator ride or red light, you short-circuit the DMN before it can process your thoughts. True creative insights rarely strike while staring down a blinking cursor; they surface while walking, showering, or staring out the window.'
      ],
      takeaways: [
        'The brain burns 20% of the body’s energy even during complete physical rest.',
        'The Default Mode Network links unconnected memories into novel creative solutions.',
        'Protecting small daily pockets of boredom is essential for mental clarity.'
      ],
      reflectionPrompt: 'What is one creative insight you’ve had recently when you weren’t looking at a screen?',
      sourceName: 'Annual Review of Neuroscience'
    }
  },
  {
    id: 'fsa-5m-ent-1',
    title: 'The Great Emu War of 1932',
    subtitle: 'When the Australian military deployed heavy artillery against 20,000 flightless birds—and lost.',
    durationMinutes: 5,
    moods: ['entertained'],
    topic: 'History',
    category: 'entertainment',
    qualityRating: 9.5,
    description: 'One of the most delightfully bizarre, thoroughly documented episodes in military history.',
    interactivePayload: {
      paragraphs: [
        'In late 1932, western Australian farmers faced an unprecedented crisis: 20,000 migrating emus invaded wheat crops during the Great Depression, trampling fences and devouring fields.',
        'The Australian Minister of Defence dispatched Major G.P.W. Meredith with two Lewis heavy machine guns and 10,000 rounds of ammunition. The media dubbed it the "Emu War."',
        'However, the emus proved to be master guerrilla tacticians. They split into small splinter units running at 50 km/h, frustrating gunners and jamming equipment. After a week of comical skirmishes and thousands of wasted bullets, Major Meredith withdrew.',
        'Meredith admiringly reported: "If we had a military division with the bullet-carrying capacity of these birds it would face any army in the world... They can face machine guns with the invulnerability of tanks."'
      ],
      takeaways: [
        'Nature frequently outmaneuvers conventional military tactics through decentralized agility.',
        'The episode remains a legendary, self-deprecating staple of Australian folklore.',
        'The farmers eventually solved the problem with better perimeter fencing rather than heavy artillery.'
      ],
      reflectionPrompt: 'What complex problem have you seen overcomplicated when a simple boundary was all that was needed?'
    }
  },
  {
    id: 'fsa-5m-men-1',
    title: 'The Monty Hall Problem & The Switching Paradox',
    subtitle: 'Why your intuition passionately fights against basic probability.',
    durationMinutes: 5,
    moods: ['mentally_challenged'],
    topic: 'Science',
    category: 'challenge',
    qualityRating: 9.7,
    description: 'Solve the game show dilemma that fooled Nobel laureates and mathematicians when Marilyn vos Savant published it.',
    interactivePayload: {
      prompt: 'You stand before 3 closed doors. Behind one door is a luxury sports car; behind the other two are goats. You choose Door 1. The host (who knows where the car is) opens Door 3, revealing a goat. He then asks: "Do you want to switch to Door 2?"',
      question: 'What is your mathematically optimal decision?',
      options: [
        'Keep Door 1. Both remaining doors have an equal 50/50 probability.',
        'Switch to Door 2. Your odds of winning jump from 1/3 (33%) to 2/3 (67%).',
        'Stay with Door 1. Switching shows a lack of confidence and invites regret.',
        'It makes no difference unless you know the host’s astrological sign.'
      ],
      correctOptionIndex: 1,
      hint: 'Remember: when you first picked Door 1, what were the chances your pick was wrong? (2 out of 3 times!)',
      explanation:
        'When you picked Door 1, there was a 1/3 chance you were right, and a 2/3 chance the car was behind Door 2 or 3. Because the host is obligated to eliminate a goat, the full 2/3 probability shifts onto Door 2! Switching doubles your chances of winning.'
    }
  },
  {
    id: 'fsa-5m-inf-1',
    title: 'The Straits of Malacca: The 1.5-Mile Global Arterial Chokepoint',
    subtitle: 'Where 25% of the world’s trade and 80% of East Asia’s oil squeaks through a shallow trench.',
    durationMinutes: 5,
    moods: ['informed'],
    topic: 'World Affairs',
    category: 'news',
    qualityRating: 9.5,
    description: 'Understand the geography behind global supply chains and maritime sovereignty in Southeast Asia.',
    interactivePayload: {
      paragraphs: [
        'Stretching 550 miles between the Malay Peninsula and the Indonesian island of Sumatra lies the Strait of Malacca. At its narrowest point—the Phillips Channel near Singapore—it shrinks to just 1.5 nautical miles across.',
        'Through this tiny needle eye pass over 90,000 container ships and supertankers every single year. It carries roughly one-fourth of all sea-traded commerce and over 80% of crude oil destined for China, Japan, and South Korea.',
        'If an accident, geopolitical conflict, or shipwreck blocked the strait, global shipping would have to divert thousands of miles south around the Sunda or Lombok straits, adding weeks of transit and hundreds of millions in fuel costs.',
        'In 2026, coastal navies deployed unified satellite AI vessel monitoring to ensure continuous passage while guarding sensitive coral biomes against bilge discharge.'
      ],
      takeaways: [
        'The Strait of Malacca is the world’s most vulnerable commercial supply bottleneck.',
        'Maritime trade routes dictate global geopolitical alliances far more than land borders.',
        'Real-time automated AIS coordination keeps 90,000 annual vessels moving without collisions.'
      ],
      sourceName: 'International Maritime Organization (IMO) Reports'
    }
  },
  {
    id: 'fsa-5m-off-1',
    title: 'The 5-4-3-2-1 Sensory Grounding Practice',
    subtitle: 'Pull your sensory awareness out of the virtual plane and firmly back into the physical room.',
    durationMinutes: 5,
    moods: ['offline'],
    topic: 'Psychology',
    category: 'offline',
    qualityRating: 9.9,
    description: 'An evidence-based mindfulness technique that arrests digital overstimulation in minutes.',
    interactivePayload: {
      steps: [
        'Notice 5 things you can visually see right now (the texture of a wall, sunlight glinting on a cup, shadows under a chair).',
        'Feel 4 physical sensations (your feet resting on the floor, clothes on your shoulders, the temperature of your palms).',
        'Listen for 3 distinct ambient sounds (a computer fan, distant street noise, your own gentle breathing).',
        'Identify 2 subtle scents in your immediate space (coffee, paper, cool air).',
        'Taste 1 lingering sensation or take one deliberate sip of cool water.'
      ],
      reflectionPrompt: 'What is one subtle physical detail in your room you hadn’t noticed all day?',
      benefit: 'Engages the sensory cortex to break cognitive rumination loops within 180 seconds.'
    }
  },

  // ==========================================
  // 10 MINUTES (Intentional Pauses)
  // ==========================================
  {
    id: 'fsa-10m-cur-1',
    title: 'The Mycelial Underground Economy',
    subtitle: 'How mother trees and fungal networks trade carbon, phosphorus, and warnings across species.',
    durationMinutes: 10,
    moods: ['curious'],
    topic: 'Nature & Space',
    category: 'curiosity',
    qualityRating: 9.8,
    description: 'Old-growth forests do not compete in a brutal vacuum; they form a symbiotic underground market.',
    interactivePayload: {
      paragraphs: [
        'Beneath a single step in an ancient forest lies several miles of microscopic fungal filaments known as mycorrhizal hyphae. Rather than independent entities, up to 90% of land plants partner with these underground networks.',
        'Trees photosynthesize sunlight into sugars and pump up to 30% of their carbon down into the fungal roots. In exchange, the vast surface area of the fungus scavenges nitrogen, phosphorus, and moisture from bedrock and delivers it to the tree.',
        'Ecologist Suzanne Simard discovered using isotope tracing that older "mother trees" use this fungal highway to send vital nutrients to struggling saplings in shaded understories—even across species barriers, such as from Douglas firs to Paper birches.',
        'When an aphid infestation begins in one corner of the forest, the attacked tree releases chemical signals into the fungal web, enabling neighbor trees hundreds of yards away to manufacture defensive tannins before the pests even arrive.'
      ],
      takeaways: [
        'Forests act as collective super-organisms linked by mycorrhizal networks.',
        'Resource sharing occurs across species lines based on seasonal sunlight differentials.',
        'Early chemical warning signals protect entire canopies from catastrophic infestations.'
      ],
      reflectionPrompt: 'In what ways does your own community rely on invisible networks of mutual support?',
      sourceName: 'Nature Ecology & Evolution'
    }
  },
  {
    id: 'fsa-10m-ent-1',
    title: 'The Voynich Manuscript: The Unbreakable 600-Year Cipher',
    subtitle: '240 pages of strange botanical drawings, zodiac wheels, and a script no human can decode.',
    durationMinutes: 10,
    moods: ['entertained', 'curious'],
    topic: 'History',
    category: 'entertainment',
    qualityRating: 9.7,
    description: 'Baffling codebreakers from Alan Turing’s team to modern neural networks.',
    interactivePayload: {
      paragraphs: [
        'In 1912, rare book dealer Wilfrid Voynich purchased an enigmatic illustrated codex from a Jesuit college in Italy. Carbon-dating revealed the vellum was harvested between 1404 and 1438 in Central Europe.',
        'The manuscript contains 240 illustrated pages divided into sections on unknown botanical species, astrological star charts, and strange biological bathing scenes. What has captivated linguists is the text itself: written left-to-right in an elegant alphabet of roughly 25 distinct glyphs.',
        'During World War II, top cryptanalysts from Bletchley Park attempted to break the cipher and failed completely. Modern computational linguistics confirms the text obeys Zipf’s law of natural language—meaning it is not random gibberish, but follows rigorous grammatical syntax.',
        'Yet despite 600 years of scrutiny and modern LLM analysis, not a single coherent sentence has been conclusively translated. Is it a secret alchemical treatise, a forgotten constructed tongue, or history’s most elaborate hoax?'
      ],
      takeaways: [
        'The Voynich script obeys statistical laws of natural language, ruling out simple random noise.',
        'The illustrated plants depict nonexistent species spliced together from different families.',
        'It remains the premier unsolved mystery in historical cryptology.'
      ],
      reflectionPrompt: 'What do you think motivates someone to create a 240-page puzzle that outlives centuries?'
    }
  },
  {
    id: 'fsa-10m-men-1',
    title: 'The Midnight Bridge Crossing (Logic Mastery)',
    subtitle: 'Four travelers, one flashlight, and a rickety bridge that holds two people at once.',
    durationMinutes: 10,
    moods: ['mentally_challenged'],
    topic: 'General Knowledge',
    category: 'challenge',
    qualityRating: 9.8,
    description: 'A classic algorithmic puzzle that requires abandoning intuitive greedy solutions.',
    interactivePayload: {
      prompt: 'Four travelers (A, B, C, D) must cross a chasm at night on a narrow rope bridge. The bridge can only hold at most 2 people at once. They have only 1 flashlight, which must be carried back and forth on every crossing (no throwing!).\n\nCrossing speeds:\n- Person A: 1 minute\n- Person B: 2 minutes\n- Person C: 7 minutes\n- Person D: 10 minutes\n\nWhen two people cross together, they move at the speed of the slower person.',
      question: 'What is the absolute minimum time required for all four travelers to reach the other side?',
      options: [
        '19 minutes (Person A acts as the shuttle ferry, taking B, C, and D across one by one)',
        '17 minutes (Group the two slowest travelers together in the middle crossing)',
        '21 minutes',
        '15 minutes'
      ],
      correctOptionIndex: 1,
      hint: 'The trap is using fast Person A for every return trip. If C and D take separate trips, you waste 7 + 10 = 17 minutes on them alone! Pair C and D together.',
      explanation:
        'Optimal 5-step solution:\n1. A & B cross forward (2 min)\n2. A returns with flashlight (1 min) [Elapsed: 3 min]\n3. C & D cross forward together (10 min) [Elapsed: 13 min]\n4. B returns with flashlight (2 min) [Elapsed: 15 min]\n5. A & B cross forward again (2 min) [Grand Total: 17 min]!'
    }
  },
  {
    id: 'fsa-10m-inf-1',
    title: 'The Global Semiconductor Pivot: Wide-Bandgap Materials & AI Power',
    subtitle: 'Why the future of computing is moving from planar silicon to Gallium Nitride & 3D chiplets.',
    durationMinutes: 10,
    moods: ['informed'],
    topic: 'Business & Economics',
    category: 'news',
    qualityRating: 9.6,
    description: 'A clear-headed explanation of the engineering and geopolitical shift powering electric vehicles and AI clusters.',
    interactivePayload: {
      paragraphs: [
        'For over fifty years, the technology revolution ran on standard planar silicon. As transistors shrink to atomic scales, quantum tunneling leaks electricity, making traditional silicon scaling economically and physically brutal.',
        'At the same time, the explosion of AI data centers and electric vehicles has created a crisis of power conversion: stepping down thousands of volts from the grid into microchips wastes vast amounts of electricity as heat.',
        'The global semiconductor industry is pivoting to Wide-Bandgap (WBG) semiconductors: Silicon Carbide (SiC) and Gallium Nitride (GaN). These crystal compounds withstand higher voltages, switch ten times faster, and reduce thermal energy loss by up to 40%.',
        'Fabrication facilities in Japan, Taiwan, the EU, and the United States are investing hundreds of billions to retool supply chains around these advanced materials, transforming both climate efficiency and strategic independence.'
      ],
      takeaways: [
        'Silicon is reaching fundamental atomic limits in high-voltage efficiency.',
        'Wide-bandgap materials (SiC and GaN) cut electrical conversion loss by up to 40%.',
        'The transition is reshaping sovereign semiconductor policy worldwide.'
      ],
      sourceName: 'IEEE Spectrum Engineering Analysis'
    }
  },
  {
    id: 'fsa-10m-off-1',
    title: 'The 10-Minute Phone-Free Neighborhood Walk',
    subtitle: 'Panoramic vision, optic flow, and natural circadian resets.',
    durationMinutes: 10,
    moods: ['offline'],
    topic: 'General Knowledge',
    category: 'offline',
    qualityRating: 9.8,
    description: 'Leave your phone on your desk and walk 5 minutes in any direction, then walk back.',
    interactivePayload: {
      steps: [
        'Leave your phone behind or switch it into airplane mode in your back pocket.',
        'Step out your door and walk at an unhurried, natural pace.',
        'Allow your eyes to expand into panoramic vision (taking in the perimeter horizons rather than staring at a focal point 12 inches away).',
        'Observe three distinct architectural details, trees, or bird species along your path.',
        'At the 5-minute mark, turn around and walk back with conscious, relaxed breathing.'
      ],
      reflectionPrompt: 'How did your neck, jaw, and shoulder tension change after 10 minutes of walking outside?',
      benefit: 'Natural optic flow across the retinas directly deactivates fear and anxiety circuitry in the amygdala.'
    }
  },

  // ==========================================
  // 20 MINUTES (Deep Refreshes)
  // ==========================================
  {
    id: 'fsa-20m-cur-1',
    title: 'The Architecture of Attention: How Dot-Products Built Modern AI',
    subtitle: 'From recurrent bottlenecks to parallel self-attention matrices.',
    durationMinutes: 20,
    moods: ['curious'],
    topic: 'Technology & AI',
    category: 'curiosity',
    qualityRating: 9.9,
    description: 'A comprehensive, intuitive deep dive into the mathematical mechanism behind the modern AI transformation.',
    interactivePayload: {
      paragraphs: [
        'Before 2017, natural language processing relied on Recurrent Neural Networks (RNNs) and LSTMs. These models processed text sequentially, token by token, like a tape recorder. By the time an RNN reached the fiftieth word in a paragraph, the nuances of the first five words had degraded.',
        'In 2017, an eight-person research team published "Attention Is All You Need," introducing the Transformer architecture. Transformers discarded recurrence entirely in favor of Self-Attention.',
        'For every word in a sequence, the model computes three vectors: Query (what am I looking for?), Key (what information do I represent?), and Value (what meaning do I store?). By calculating the dot-product between word Queries and word Keys, the model produces an attention matrix.',
        'In the sentence "The bank was muddy after the river flooded," the token "bank" assigns high attention to "river" and "flooded", allowing the network to know it is a riverbank rather than a financial building.',
        'Because all words attend to all other words simultaneously using GPU matrix multiplication, models could suddenly ingest billions of parameters across vast internet libraries, inaugurating the generative AI era.'
      ],
      takeaways: [
        'Recurrent networks suffered from catastrophic forgetting over long text sequences.',
        'Self-attention calculates dynamic pairwise relationships across all tokens in parallel.',
        'Queries, Keys, and Values formulate language understanding as an information-retrieval database.'
      ],
      reflectionPrompt: 'How does reading in parallel compare to how your own intuition connects past ideas?',
      sourceName: 'Vaswani et al., Google Brain / NeurIPS'
    }
  },
  {
    id: 'fsa-20m-ent-1',
    title: 'Gödel, Escher, Bach: Strange Loops & The Illusion of Self',
    subtitle: 'Douglas Hofstadter’s masterwork on self-reference, mathematical incompleteness, and consciousness.',
    durationMinutes: 20,
    moods: ['entertained', 'curious'],
    topic: 'Philosophy',
    category: 'entertainment',
    qualityRating: 9.8,
    description: 'An exhilarating exploration of how non-conscious symbols organize into a conscious "I".',
    interactivePayload: {
      paragraphs: [
        'In 1979, cognitive scientist Douglas Hofstadter published Gödel, Escher, Bach: An Eternal Golden Braid. His question was deceptively simple: How can inanimate, unthinking matter—whether carbon atoms in brains or silicon gates in chips—generate the feeling of conscious selfhood?',
        'He wove together three seemingly disparate geniuses: Kurt Gödel (the logician who proved that mathematical systems contain true statements that cannot be proven within the system), M.C. Escher (the artist whose lithographs depict hands drawing each other and staircases cascading infinitely upwards), and J.S. Bach (whose "Musical Offering" contains canons that modulate keys continuously until they return to their origin).',
        'Hofstadter identified a common pattern: the Strange Loop. A strange loop occurs whenever, by moving upwards or downwards through a hierarchical system, you unexpectedly find yourself back at the starting point.',
        'Your sense of "I" is the ultimate strange loop: a network of non-conscious neurons that generates a self-referential mental model of itself, creating the enduring illusion of an author behind the thoughts.'
      ],
      takeaways: [
        'A Strange Loop arises when hierarchical levels fold back to reference themselves.',
        'Gödel proved that no formal axiomatic system can be both complete and self-consistent.',
        'Consciousness may be the emergent pattern of a biological brain modeling its own awareness.'
      ],
      reflectionPrompt: 'When you observe yourself thinking, who is the one doing the observing?'
    }
  },
  {
    id: 'fsa-20m-men-1',
    title: 'The Master Logician’s Three Hats',
    subtitle: 'A high-level inductive reasoning puzzle that tests recursive theory of mind.',
    durationMinutes: 20,
    moods: ['mentally_challenged'],
    topic: 'Philosophy',
    category: 'challenge',
    qualityRating: 9.9,
    description: 'A masterclass in epistemic logic: what you know, what they know, and what they know that you know.',
    interactivePayload: {
      prompt: 'Three world-renowned logicians (Alpha, Beta, Gamma) are brought into a room. A judge places a hat on each of their heads, chosen from a pool of 3 white hats and 2 black hats. Each person can see the hats on the other two, but cannot see their own.\n\nAll three are told: "At least one of you is wearing a white hat."\n\nThe judge asks Alpha: "Do you know with certainty the color of your hat?"\nAlpha looks around and replies: "No, I do not."\n\nThe judge asks Beta: "Do you know with certainty the color of your hat?"\nBeta considers Alpha’s answer, looks at Gamma and Alpha, and replies: "No, I do not."\n\nThe judge turns to Gamma.',
      question: 'What color hat is Gamma wearing, and does Gamma know with certainty?',
      options: [
        'Gamma cannot know, because neither Alpha nor Beta had enough information.',
        'Gamma knows with 100% certainty that Gamma is wearing a WHITE hat.',
        'Gamma is wearing a BLACK hat.',
        'The puzzle requires knowing whether Gamma spoke in a high or low pitch.'
      ],
      correctOptionIndex: 1,
      hint: 'Think step by step: What would Alpha have said if Beta and Gamma both had black hats? (There were only 2 black hats total!) Next, what did Beta deduce from Alpha’s "No"?',
      explanation:
        'Proof by deductive elimination:\n1. If Beta and Gamma had both worn black hats, Alpha would instantly know Alpha had white (since there are only 2 black hats). Alpha’s "No" proves that Beta and Gamma are NOT both black.\n2. Beta hears Alpha say "No". If Gamma had a black hat, Beta would instantly know: "Since Alpha didn’t see two black hats, my hat must be white!" But Beta also said "No"!\n3. Therefore, Gamma’s hat cannot be black. Gamma deduces: "If my hat were black, Beta would have known his was white. Since Beta didn’t know, my hat MUST BE WHITE!"'
    }
  },
  {
    id: 'fsa-20m-inf-1',
    title: 'The Global Hydropolitics of Shared River Basins',
    subtitle: 'How mega-dams and glacier retreat on the Nile, Indus, and Colorado are rewriting international law.',
    durationMinutes: 20,
    moods: ['informed'],
    topic: 'World Affairs',
    category: 'news',
    qualityRating: 9.7,
    description: 'A sober, systemic analysis of 21st-century freshwater interdependence and transboundary river treaties.',
    interactivePayload: {
      paragraphs: [
        'Across the globe, 310 river basins are shared by two or more sovereign nations, encompassing half the world’s population. In the coming decades, freshwater management will surpass oil as the primary geopolitical challenge.',
        'Along the Blue Nile, Ethiopia’s Grand Ethiopian Renaissance Dam (GERD) provides massive clean hydroelectric energy for 60 million people, while downstream Egypt relies on the Nile for 97% of its municipal and agricultural water supply. Negotiating drought-year reservoir filling has tested international diplomacy.',
        'In South Asia, the 1960 Indus Waters Treaty between India and Pakistan has survived multiple wars as a model of technical co-governance, but accelerating Himalayan glacial melt is altering seasonal flow volumes, demanding modernized hydrological data sharing.',
        'In the American West, seven states dependent on the Colorado River basin are navigating historic volumetric cutbacks as Lake Mead and Lake Powell hit critical storage thresholds, driving innovations in agricultural drip recycling and urban desalination.'
      ],
      takeaways: [
        'Over 300 river basins are shared across international borders without unilateral sovereignty.',
        'Drought-sharing agreements require transparent, real-time telemetry between neighbor states.',
        'Water diplomacy demonstrates how international law and ecological reality can successfully collaborate.'
      ],
      sourceName: 'UN-Water Transboundary Waters Global Assessment'
    }
  },
  {
    id: 'fsa-20m-off-1',
    title: 'The 20-Minute Analog Life Compass Audit',
    subtitle: 'A single sheet of paper, a quiet pen, and four honest questions away from all screens.',
    durationMinutes: 20,
    moods: ['offline'],
    topic: 'Philosophy',
    category: 'offline',
    qualityRating: 9.9,
    description: 'An intentional, restorative journaling session to reclaim clarity and purpose from digital noise.',
    interactivePayload: {
      steps: [
        'Take a blank sheet of paper and divide it into four quadrants: Attention, Energy, Relationships, and Craft.',
        'Under Attention: Write down what consumed the most hours of your past 7 days. Did it reflect what you genuinely care about?',
        'Under Energy: What gave you authentic vitality this week? What drained you without any return?',
        'Under Relationships: Who is one person you want to invest deeper presence with this month?',
        'Under Craft: What is one meaningful project or skill you want to nurture over the next 90 days?',
        'Fold the paper in half, place it in your pocket or notebook, and sit in silence for the remaining 3 minutes.'
      ],
      reflectionPrompt: 'What single truth surprised you the most once written in your own handwriting?',
      benefit: 'Transfers mental cognitive load onto physical paper, restoring agency and calm focus.'
    }
  }
];
