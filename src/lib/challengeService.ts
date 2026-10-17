import {
  ChallengeItem,
  ChallengeType,
  ChallengeDifficulty,
  ChallengeValidationResult,
  ChallengeMetrics
} from '@/types';

export const CHALLENGES_DATASET: ChallengeItem[] = [
  // ==========================================
  // 1. LOGIC PUZZLES
  // ==========================================
  {
    id: 'ch-logic-1',
    title: 'The False Positive Paradox',
    category: 'logic',
    topic: 'Philosophy',
    difficulty: 'Deep',
    timeEstimateMinutes: 3,
    instructions:
      'Analyze the base rates and conditional probabilities. Do not rely on intuition alone—calculate the actual ratio of true positives to all positive results.',
    prompt:
      'A rare condition affects exactly 1 in 1,000 people (0.1% of the population). A diagnostic test is developed that is 99% accurate (if you have the condition, it tests positive 99% of the time; if you do not, it tests negative 99% of the time). You take the test at random and it comes back POSITIVE.',
    question:
      'What is the approximate probability that you actually have the rare condition?',
    options: [
      'About 99% (since the test has 99% accuracy)',
      'About 9% (roughly 1 in 11 people with a positive test actually have it)',
      'About 50% (either you have it or you don’t)',
      'About 1% (10 times the general population rate)'
    ],
    correctOptionIndex: 1,
    hint: 'Imagine a representative cohort of 100,000 people. How many actually have the illness? How many healthy people get a false positive?',
    explanation:
      'In a cohort of 100,000 people: 100 have the condition, and 99 of them test positive. But 99,900 are healthy, and 1% of them (999 people) test FALSE positive! Out of all positive tests (99 + 999 = 1,098), only 99 actually have the disease (99 / 1,098 ≈ 9.01%). This is Bayes’ theorem in action: when a base rate is extremely low, false positives often drastically outnumber true positives.',
  },
  {
    id: 'ch-logic-2',
    title: 'The Farmer’s River Crossing',
    category: 'logic',
    topic: 'Philosophy',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Determine the sequence of trips across the river. The boat holds only the farmer and one item. Left alone together, the fox eats the goose, or the goose eats the grain.',
    prompt:
      'A traveler arrives at a river with a fox, a goose, and a sack of grain. There is a small rowboat that can only carry the traveler and one other item at a time. If left unsupervised on either riverbank, the fox will devour the goose, or the goose will eat the grain. The fox does not eat grain.',
    question:
      'What must the traveler carry on their very first crossing to solve the riddle without incident?',
    options: [
      'The Fox',
      'The Grain',
      'The Goose',
      'It is impossible without losing an item'
    ],
    correctOptionIndex: 2,
    hint: 'Look at what happens on the riverbank if you leave the other two behind.',
    explanation:
      'The traveler must take the Goose first! Leaving the Fox with the Grain is safe because foxes do not eat grain. On the second trip, the traveler brings the Fox, but brings the Goose back to the initial bank, deposits the Goose, takes the Grain across to join the Fox, and finally returns alone to fetch the Goose.',
  },
  {
    id: 'ch-logic-3',
    title: 'The Three Mislabelled Fruit Boxes',
    category: 'logic',
    topic: 'Philosophy',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Use the fact that EVERY label is guaranteed to be incorrect. Deduce how a single fruit drawn blindly can clarify all three boxes.',
    prompt:
      'You are presented with three closed crates. One is labeled "Apples", one is labeled "Oranges", and the third is labeled "Apples & Oranges". You are explicitly told that ALL THREE LABELS ARE CURRENTLY WRONG. You may reach into just ONE box and draw out a single fruit without looking inside.',
    question:
      'Which box should you pick a fruit from to guarantee identifying the correct contents of all three boxes?',
    options: [
      'The box labeled "Apples"',
      'The box labeled "Oranges"',
      'The box labeled "Apples & Oranges"',
      'It cannot be determined with only one draw'
    ],
    correctOptionIndex: 2,
    hint: 'Because every label is wrong, what does a fruit from the "Apples & Oranges" box prove about that specific crate?',
    explanation:
      'Pick from the box labeled "Apples & Oranges". Since its label is false, it CANNOT be mixed; it must be ALL Apples or ALL Oranges. If you pull an Apple, that crate is purely Apples. Then the box labeled "Oranges" cannot be Oranges (since all labels are wrong) and cannot be Apples (already found), so it must be Apples & Oranges. The crate labeled "Apples" must therefore be Oranges! The same deduction works if you pull an Orange.',
  },

  // ==========================================
  // 2. CURIOSITY & SCIENCE QUIZZES
  // ==========================================
  {
    id: 'ch-quiz-1',
    title: 'Refraction & The Speed of Light in Glass',
    category: 'quiz',
    topic: 'Science',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Recall the relationship between refractive index, vacuum light speed, and the transmission speed of photons through matter.',
    prompt:
      'In a vacuum, light travels at approximately 300,000 km/s (denoted by constant c). When a beam of light passes into standard optical glass with a refractive index of n = 1.5, its speed changes.',
    question:
      'How fast does light propagate through standard window glass?',
    options: [
      'It slows down to approximately 200,000 km/s (c / 1.5)',
      'It continues at exactly 300,000 km/s because light velocity is an invariant cosmic constant',
      'It slows down to almost zero because photons are absorbed and stored',
      'It accelerates to 450,000 km/s due to photon compression'
    ],
    correctOptionIndex: 0,
    hint: 'Refractive index is defined as n = c / v, where v is the phase velocity of light in that medium.',
    explanation:
      'In optical glass (n ≈ 1.5), light slows to v = c / 1.5 ≈ 200,000 km/s. While individual photons still travel at c between electromagnetic interactions, the phase wave’s forward propagation speed is reduced by coherent interference with the electron fields of the glass atoms. When emerging back into air, light returns to c without requiring additional energy.',
  },
  {
    id: 'ch-quiz-2',
    title: 'Cephalopod Anatomy: The Three Hearts',
    category: 'quiz',
    topic: 'Nature & Space',
    difficulty: 'Quick',
    timeEstimateMinutes: 1,
    instructions:
      'Consider how marine invertebrates with copper-based hemocyanin blood maintain circulation and oxygenation under water pressure.',
    prompt:
      'Octopuses possess blue, copper-rich blood (hemocyanin) which is less efficient at carrying oxygen in cold seawater than iron-based human hemoglobin. To compensate, evolution endowed them with three hearts.',
    question:
      'What is the distinct function of the octopus’s three hearts?',
    options: [
      'Two branchial hearts pump deoxygenated blood through the gills; one systemic heart circulates oxygenated blood through the body.',
      'All three hearts pump blood simultaneously into three separate limbs.',
      'One heart pumps blood, one pumps venom, and the third regulates ink storage.',
      'Two hearts stay permanently asleep as backup redundancy if the main heart stops.'
    ],
    correctOptionIndex: 0,
    hint: 'Think about gills (respiration) versus systemic blood flow to muscles and organs.',
    explanation:
      'Two branchial hearts pump venous blood across the gills where it absorbs dissolved oxygen. The systemic heart then takes the oxygenated blue blood and circulates it to the rest of the body. Interestingly, when an octopus swims using jet propulsion, the systemic heart temporarily stops beating, which is why they prefer crawling along the seabed to conserve cardiovascular energy!',
  },
  {
    id: 'ch-quiz-3',
    title: 'The Voyager Golden Record: Earth’s Cosmic Message',
    category: 'quiz',
    topic: 'Nature & Space',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Think about universal physical constants used by NASA and Carl Sagan’s team to communicate time and location to non-human extraterrestrials.',
    prompt:
      'Launched in 1977 aboard Voyager 1 and 2, the Golden Record carries sounds, images, and music of Earth. To explain how to play the 33⅓ RPM phonograph and decode its signals, NASA could not use English, minutes, or seconds.',
    question:
      'What fundamental cosmic time unit is engraved on the record cover as the universal clock?',
    options: [
      'The hyperfine transition of neutral hydrogen (1.42 GHz, period of ~0.7 nanoseconds)',
      'The rotational period of Earth around the Sun (1 year)',
      'The half-life of Carbon-14',
      'The speed of sound through water'
    ],
    correctOptionIndex: 0,
    hint: 'What is the most abundant chemical element in the universe, and what atomic frequency does it emit across interstellar space?',
    explanation:
      'Hydrogen is the most abundant element in the universe. The spin-flip (hyperfine transition) of neutral atomic hydrogen emits electromagnetic radiation at 21 cm wavelength (1420.4 MHz). The time taken for this transition (approx. 0.704 nanoseconds) was used as the fundamental cosmic clock unit to specify rotational playback speeds and pulsar coordinates on the Golden Record cover.',
  },

  // ==========================================
  // 3. RIDDLES & DEDUCTIVE BRAINTEASERS
  // ==========================================
  {
    id: 'ch-riddle-1',
    title: 'The Midnight Rope Bridge Crossing',
    category: 'riddle',
    topic: 'General Knowledge',
    difficulty: 'Deep',
    timeEstimateMinutes: 3,
    instructions:
      'Calculate the optimal round-trip times. Only 2 people can cross at once, moving at the slower person’s speed, and the single torch must be carried back and forth.',
    prompt:
      'Four travelers (A, B, C, D) must cross a fragile rope bridge in the dark. The bridge holds at most 2 people at once. They share 1 torch, which must accompany every crossing. Crossing speeds: A = 1 min, B = 2 mins, C = 7 mins, D = 10 mins. When two cross together, they move at the slower traveler’s pace.',
    question:
      'What is the minimum total time required for all four travelers to reach the other side?',
    options: [
      '17 minutes (Send the two slowest together in the middle)',
      '19 minutes (Fastest traveler ferries everyone individually)',
      '21 minutes',
      '15 minutes'
    ],
    correctOptionIndex: 0,
    hint: 'Avoid having both C (7m) and D (10m) take separate slow trips! Have them cross together so their slow times overlap.',
    explanation:
      'The optimal sequence:\n1. A & B cross forward → 2 min\n2. A returns with torch → 1 min (total 3 min)\n3. C & D cross together → 10 min (total 13 min)\n4. B returns with torch → 2 min (total 15 min)\n5. A & B cross forward together → 2 min (grand total 17 min)!\nBy having C and D walk together, you consume their heavy penalty only once.',
  },
  {
    id: 'ch-riddle-2',
    title: 'The Two Guarded Doors of Truth',
    category: 'riddle',
    topic: 'Philosophy',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Formulate a question that yields the exact same answer regardless of whether you speak to the truth-teller or the habitual liar.',
    prompt:
      'You stand before two doors: one leads to freedom, the other to a bottomless abyss. A guard stands before each door. One guard always tells the absolute truth; the other guard always lies. You do not know which guard is which. You are allowed to ask exactly ONE question to ONE guard.',
    question:
      'What question guarantees you identify the door to freedom?',
    options: [
      '"Which door would the other guard say leads to freedom?" (Then pick the OPPOSITE door)',
      '"Are you the guard who always tells the truth?"',
      '"Does your door lead to freedom?"',
      '"What would you say if I asked you whether 2 + 2 = 4?"'
    ],
    correctOptionIndex: 0,
    hint: 'What happens when you multiply a positive (+1 truth) by a negative (-1 lie)? Both combinations invert the outcome!',
    explanation:
      'If you ask "Which door would the other guard say leads to freedom?":\n• The Truth-Teller knows the Liar would point to the abyss, so the Truth-Teller truthfully points to the abyss.\n• The Liar knows the Truth-Teller would point to freedom, but the Liar lies and points to the abyss.\nIn both cases, whoever you ask points directly to the abyss! Therefore, you simply open the OTHER door to walk to freedom.',
  },
  {
    id: 'ch-riddle-3',
    title: 'The Sunk Cost Fallacy at the Theater',
    category: 'riddle',
    topic: 'Psychology',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Evaluate rational decision-making versus emotional anchoring on past unrecoverable expenses.',
    prompt:
      'Elena spends $80 on a non-refundable theater ticket. On the evening of the show, a blizzard strikes and she develops a severe flu with chills and a migraine. She realizes she will be miserable if she attends, yet she says: "I must go, otherwise I have wasted $80!"',
    question:
      'What cognitive bias is Elena falling victim to, and what is the economically rational decision?',
    options: [
      'The Sunk Cost Fallacy: The $80 is gone either way; attending adds suffering without recovering the money.',
      'Confirmation Bias: She is only reading favorable reviews of the performance.',
      'Anchoring Effect: She is obsessed with the seat row number.',
      'Hedonic Adaptation: She will enjoy the play once seated.'
    ],
    correctOptionIndex: 0,
    hint: 'Can Elena get her $80 back by suffering through a 3-hour performance in a blizzard with the flu?',
    explanation:
      'The Sunk Cost Fallacy occurs when people continue an activity due to previously invested, unrecoverable resources. Since the $80 cannot be refunded, going to the show costs her an additional price: 3 hours of physical agony with zero enjoyment. Staying warm in bed leaves her with -$80 and recovery; going leaves her with -$80 and illness.',
  },

  // ==========================================
  // 4. GENERAL-KNOWLEDGE CHALLENGES
  // ==========================================
  {
    id: 'ch-gen-1',
    title: 'The Mariana Trench Inversion',
    category: 'general',
    topic: 'Nature & Space',
    difficulty: 'Quick',
    timeEstimateMinutes: 1,
    instructions:
      'Compare planetary vertical extremes. Consider Mount Everest’s elevation above sea level versus the depth of the Pacific seafloor.',
    prompt:
      'Mount Everest is the highest point on Earth at 8,848 meters (29,032 feet) above sea level. The Challenger Deep in the Mariana Trench is the deepest known point in the global ocean.',
    question:
      'If Mount Everest were placed on the ocean floor at the bottom of the Challenger Deep, what would happen?',
    options: [
      'Its peak would remain submerged under more than 2,000 meters (over 1.2 miles) of ocean water.',
      'Its peak would poke out above the sea surface by roughly 500 meters.',
      'Its peak would exactly touch the ocean surface.',
      'It would cause a massive planetary tsunami because the trench is only 4,000 meters deep.'
    ],
    correctOptionIndex: 0,
    hint: 'The Challenger Deep is nearly 11,000 meters deep.',
    explanation:
      'The Challenger Deep plunges to approximately 10,994 meters (36,070 feet) below sea level. Since Mount Everest is 8,848 meters tall, if inverted and set onto the ocean bed, its snow-capped summit would still be submerged under more than 2,140 meters (over 7,000 feet) of dark ocean water!',
  },
  {
    id: 'ch-gen-2',
    title: 'Pando: Earth’s 80,000-Year-Old Living Titan',
    category: 'general',
    topic: 'Nature & Space',
    difficulty: 'Quick',
    timeEstimateMinutes: 1,
    instructions:
      'Examine the biological definition of an individual organism when roots form an interconnected clonal colony.',
    prompt:
      'In the Fishlake National Forest of Utah, there is a grove of 40,000 quaking aspen trees named "Pando" (Latin for "I spread"). Scientists have determined that all 40,000 trunks share an identical genetic marker and a single underground root network.',
    question:
      'What remarkable biological distinction does Pando hold?',
    options: [
      'It is a single living clonal organism and one of the heaviest living beings on Earth (~6,000 metric tons).',
      'It is an artificial experimental forest planted by early Mormon settlers in 1847.',
      'It is the only forest where trees communicate using radio waves.',
      'It is an invasive species of giant fungal mycelium disguised as trees.'
    ],
    correctOptionIndex: 0,
    hint: 'Are they 40,000 individual trees, or stems of one giant connected root organism?',
    explanation:
      'Pando is a single male quaking aspen clone. Every trunk above ground is connected to the same root system that has survived for an estimated 14,000 to 80,000 years, pre-dating human agriculture. Weighing an estimated 6,000 metric tons, it is often considered the heaviest known single living organism on Earth.',
  },
  {
    id: 'ch-gen-3',
    title: 'Eratosthenes & The Curvature of the Earth',
    category: 'general',
    topic: 'History',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Recall ancient Greek geometry. Eratosthenes of Cyrene measured the Earth’s circumference around 240 BCE using shadow angles.',
    prompt:
      'In 240 BCE in Egypt, chief librarian Eratosthenes noticed that at solar noon on the summer solstice, the sun shone directly down a vertical water well in Syene (Aswan) casting zero shadow. At the exact same moment in Alexandria, a vertical obelisk cast a shadow indicating an angle of ~7.2 degrees (about 1/50th of a full 360-degree circle).',
    question:
      'How did Eratosthenes calculate the circumference of the entire Earth with startling accuracy?',
    options: [
      'He multiplied the distance between Syene and Alexandria by 50.',
      'He sailed a fleet of ships around the African continent to time their speed.',
      'He measured the angle of the North Star from a mountaintop.',
      'He used the time delay of sound echoes across the Nile valley.'
    ],
    correctOptionIndex: 0,
    hint: 'If 7.2 degrees is 1/50 of a circle, what is the whole circle relative to that arc distance?',
    explanation:
      'Since 7.2 degrees is 1/50th of 360 degrees, the distance between Alexandria and Syene (~5,000 stadia, roughly 800 km) represented 1/50th of the entire planet’s circumference. Multiplying 5,000 × 50 yielded 250,000 stadia (~40,000 km)—astonishingly close to modern satellite measurements of Earth’s true equatorial circumference (40,075 km)!',
  },

  // ==========================================
  // 5. BEGINNER PROGRAMMING CHALLENGES
  // ==========================================
  {
    id: 'ch-code-1',
    title: 'The Floating Point Precision Trap',
    category: 'code',
    topic: 'Programming',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Inspect the code snippet. Consider how base-10 fractional numbers are encoded in binary floating-point representation (IEEE 754).',
    prompt:
      'A software developer at an online commerce store writes the following pricing verification check in JavaScript/TypeScript:',
    question:
      'What gets logged to the console when this script runs?',
    codeSnippet: 'const total = 0.1 + 0.2;\nif (total === 0.3) {\n  console.log("Discount Applied");\n} else {\n  console.log("Price Mismatch: " + total);\n}',
    options: [
      '"Price Mismatch: 0.30000000000000004" (IEEE 754 cannot represent 0.1 and 0.2 exactly in binary)',
      '"Discount Applied" (0.1 + 0.2 strictly equals 0.3 in modern V8 engines)',
      'SyntaxError: Type coercion disallowed on floating point primitives',
      'NaN (Floating point numbers cannot be added with "+")'
    ],
    correctOptionIndex: 0,
    hint: 'Just as 1/3 cannot be written as a finite decimal in base 10 (0.3333...), fractions like 1/10 cannot be written as finite fractions in base 2!',
    explanation:
      'Computers represent floating-point numbers using binary (base-2) IEEE 754. Fractions like 0.1 (1/10) and 0.2 (1/5) result in repeating infinitely repeating binary decimals. In 64-bit float precision, 0.1 + 0.2 equals 0.30000000000000004. Therefore, strict equality (===) fails! In financial software, engineers store currency as integer cents or use arbitrary-precision Decimal libraries.',
  },
  {
    id: 'ch-code-2',
    title: 'Python’s Mutable Default Argument Gotcha',
    category: 'code',
    topic: 'Programming',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Trace the lifecycle of function definitions. When are default argument objects instantiated in Python?',
    prompt:
      'A developer writes a helper function to append a tag to a list of categories in Python:',
    question:
      'What is the final output of print(b)?',
    codeSnippet: 'def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\na = add_tag("python")\nb = add_tag("javascript")\nprint(b)',
    options: [
      '["python", "javascript"] (The default list is created once at function definition time and shared across calls)',
      '["javascript"] (A fresh empty list is created every time the function is invoked)',
      'None (append() modifies in-place and does not return anything)',
      'TypeError: Default parameters cannot be lists'
    ],
    correctOptionIndex: 0,
    hint: 'Python evaluates default argument expressions ONCE when the "def" statement is executed, not each time the function is called.',
    explanation:
      'In Python, default arguments are evaluated only once when the function is defined, not at each call. Because lists are mutable objects, the single default list created during definition is reused and mutated on every subsequent call where no argument is passed! The idiomatic Python fix is: def add_tag(tag, tags=None): if tags is None: tags = [].',
  },
  {
    id: 'ch-code-3',
    title: 'The Asynchronous Event Loop Order',
    category: 'code',
    topic: 'Programming',
    difficulty: 'Deep',
    timeEstimateMinutes: 3,
    instructions:
      'Trace the execution stack, microtask queue (Promises), and macrotask queue (setTimeout) in JavaScript.',
    prompt:
      'Look closely at the order in which synchronous code, microtasks, and timer macrotasks are processed in the JavaScript runtime:',
    question:
      'In what exact order are numbers printed to the console?',
    codeSnippet: 'console.log(1);\n\nsetTimeout(() => {\n  console.log(2);\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(3);\n});\n\nconsole.log(4);',
    options: [
      '1, 4, 3, 2 (Synchronous first, then Microtask queue, then Macrotask queue)',
      '1, 2, 3, 4 (Linear top-to-bottom order)',
      '1, 3, 4, 2 (Promise resolves before synchronous step 4)',
      '1, 4, 2, 3 (setTimeout with 0ms delay takes priority over Promises)'
    ],
    correctOptionIndex: 0,
    hint: 'Synchronous code runs to completion first. Before the event loop pulls from the macrotask queue (setTimeout), it exhausts ALL pending microtasks (Promises).',
    explanation:
      'The execution flow:\n1. Synchronous: console.log(1) prints 1.\n2. setTimeout registers callback into the Macrotask queue.\n3. Promise.then registers callback into the Microtask queue.\n4. Synchronous: console.log(4) prints 4.\n5. Call stack is empty: Event loop executes Microtask queue → prints 3.\n6. Next event loop tick: Event loop executes Macrotask queue → prints 2.\nResult: 1, 4, 3, 2!',
  },

  // ==========================================
  // 6. MEMORY & OBSERVATION EXERCISES
  // ==========================================
  {
    id: 'ch-mem-1',
    title: 'Spatial Matrix: Deduce the 9th Symbol',
    category: 'memory',
    topic: 'Philosophy',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Observe the 3×3 pattern grid below. Each row and each column must contain each geometric symbol exactly once, with cyclic rotation.',
    prompt:
      'Look at the Latin-square symbol matrix:',
    question:
      'Which geometric token correctly replaces the question mark [ ? ] to complete the matrix?',
    visualPattern: [
      'Row 1: [ ▲ ]  [ ● ]  [ ■ ]',
      'Row 2: [ ■ ]  [ ▲ ]  [ ● ]',
      'Row 3: [ ● ]  [ ■ ]  [ ? ]'
    ],
    options: [
      '▲ (Triangle)',
      '● (Circle)',
      '■ (Square)',
      '◆ (Diamond)'
    ],
    correctOptionIndex: 0,
    hint: 'Examine Row 3: it currently has [ ● ] and [ ■ ]. Which symbol from the triad [ ▲, ●, ■ ] is missing?',
    explanation:
      'Every row and every column forms a complete set of the three shapes: Triangle (▲), Circle (●), and Square (■). Row 3 already contains Circle and Square. Column 3 already contains Square and Circle. Thus, only the Triangle (▲) satisfies both horizontal and vertical Latin square constraints.',
  },
  {
    id: 'ch-mem-2',
    title: 'Observation: The Stroop Cognitive Anomaly',
    category: 'memory',
    topic: 'Psychology',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Scan the four color-word pairings below. Find the single row where the word text, font meaning, and semantic statement are in direct contradiction with the rule: "Words that describe warm colors must be matched with a warm emoji, and words describing cool colors must have a cool emoji".',
    prompt:
      'In psychology, the Stroop Effect demonstrates the delay in reaction time between congruent and incongruent stimuli. Examine these four observation pairs:',
    question:
      'Which line breaks the rule (Warm colors: ☀️, Cool colors: ❄️)?',
    visualPattern: [
      'Pair A: "CRIMSON"   --> [ ☀️ Warm ]',
      'Pair B: "AZURE"     --> [ ❄️ Cool ]',
      'Pair C: "EMERALD"   --> [ ☀️ Warm ]',
      'Pair D: "AMBER"     --> [ ☀️ Warm ]'
    ],
    options: [
      'Pair C: "EMERALD" paired with ☀️ Warm',
      'Pair A: "CRIMSON" paired with ☀️ Warm',
      'Pair B: "AZURE" paired with ❄️ Cool',
      'Pair D: "AMBER" paired with ☀️ Warm'
    ],
    correctOptionIndex: 0,
    hint: 'Emerald is deep green. Is green classified as a warm or a cool color on the artistic color wheel?',
    explanation:
      'On the color wheel, green (Emerald) and blue (Azure) are cool colors, while red (Crimson) and gold/yellow (Amber) are warm colors. Pair C improperly designated Emerald as a warm color (☀️), violating the classification rule.',
  },
  {
    id: 'ch-mem-3',
    title: 'Sequence Deduction: The Clockwise Shift',
    category: 'memory',
    topic: 'General Knowledge',
    difficulty: 'Quick',
    timeEstimateMinutes: 2,
    instructions:
      'Observe the sequence of filled quadrant dots moving step-by-step through a 4-quadrant square.',
    prompt:
      'A dot is moving through the four quadrants of a square (Top-Left, Top-Right, Bottom-Right, Bottom-Left):',
    question:
      'Following this clockwise 90-degree continuous rotation, what is Step 4?',
    visualPattern: [
      'Step 1: [ •  ○ ] (Top-Left)',
      '        [ ○  ○ ]',
      '',
      'Step 2: [ ○  • ] (Top-Right)',
      '        [ ○  ○ ]',
      '',
      'Step 3: [ ○  ○ ] (Bottom-Right)',
      '        [ ○  • ]',
      '',
      'Step 4: [ ? ]'
    ],
    options: [
      '[ ○  ○ ]\n[ •  ○ ] (Bottom-Left Quadrant)',
      '[ •  ○ ]\n[ ○  ○ ] (Top-Left Quadrant)',
      '[ ○  • ]\n[ ○  ○ ] (Top-Right Quadrant)',
      '[ •  • ]\n[ •  • ] (All Quadrants filled)'
    ],
    correctOptionIndex: 0,
    hint: 'Top-Left → Top-Right → Bottom-Right → ... what quadrant comes next in a clockwise sweep?',
    explanation:
      'The active dot rotates 90 degrees clockwise at each step:\n1. Top-Left\n2. Top-Right\n3. Bottom-Right\n4. Bottom-Left.\nTherefore, Step 4 places the active dot in the Bottom-Left corner [ ○  ○ ] / [ •  ○ ].',
  },
  {
    id: 'ch-1',
    title: 'The Monty Hall Problem',
    category: 'logic',
    topic: 'Science',
    difficulty: 'Medium',
    timeEstimateMinutes: 2,
    instructions:
      'Calculate the counter-intuitive conditional probability after the host eliminates one goat door.',
    prompt:
      'You are on a game show with 3 closed doors. Behind one door is a brand new sports car; behind the other two are goats. You pick Door 1.',
    question:
      'The host (who knows where the car is) opens Door 3 to reveal a goat. He then asks: "Do you want to switch to Door 2, or keep Door 1?" Mathematically, what should you do?',
    options: [
      'Switch to Door 2. Your odds of winning jump from 1/3 to 2/3.',
      'Keep Door 1. It’s 50/50 now, so it makes no difference.',
      'Stay with Door 1. Changing your initial gut choice always brings bad luck.',
      'It depends on whether Door 2 has made a noise.'
    ],
    correctOptionIndex: 0,
    hint: 'Think about what happened when you made your first pick: what were the chances you were WRONG initially?',
    explanation:
      'When you initially picked Door 1, there was a 1/3 chance you were right, and a 2/3 chance the car was behind Door 2 or 3. Because the host MUST reveal a goat, the entire 2/3 probability of the remaining doors collapses onto Door 2! Switching doubles your chance of winning.'
  },
  {
    id: 'ch-5',
    title: 'The Untranslatable: "Sonder"',
    category: 'word',
    topic: 'Arts & Culture',
    difficulty: 'Quick',
    timeEstimateMinutes: 1,
    instructions:
      'Examine nuances of language and cultural words coined to describe subtle psychological states.',
    prompt:
      'Language shapes what we perceive. In 2012, writer John Koenig coined a word in "The Dictionary of Obscure Sorrows" that entered the cultural lexicon.',
    question: 'What profound human realization does the word "Sonder" describe?',
    options: [
      'The quiet realization that every random passerby is living a life as vivid and complex as your own.',
      'The melancholy feeling of returning home after a long journey to find things unchanged.',
      'The instinct to stay up late reading because the daytime felt rushed.',
      'The fleeting nostalgia for a place you have never visited.'
    ],
    correctOptionIndex: 0,
    hint: 'Look out a window at pedestrians on a crowded street.',
    explanation:
      '"Sonder" is the realization that each random passerby possesses a life as vivid, chaotic, and intricate as your own—populated with their own ambitions, friends, heartaches, and internal dialogues in which you are merely an extra in the background.'
  }
];

// ==========================================
// SERVICE FUNCTIONS (ACTIVITY LOGIC SEPARATION)
// ==========================================

export function getAllChallenges(): ChallengeItem[] {
  return CHALLENGES_DATASET;
}

export function getChallengeById(id: string): ChallengeItem | undefined {
  return CHALLENGES_DATASET.find((c) => c.id === id);
}

export function getChallengesByCategory(category: ChallengeType | 'All'): ChallengeItem[] {
  if (category === 'All') return CHALLENGES_DATASET;
  return CHALLENGES_DATASET.filter((c) => c.category === category);
}

export function validateChallengeAnswer(
  challenge: ChallengeItem,
  selectedIndex: number
): ChallengeValidationResult {
  const isCorrect = selectedIndex === challenge.correctOptionIndex;
  return {
    isCorrect,
    selectedOption: challenge.options[selectedIndex] ?? '',
    correctOption: challenge.options[challenge.correctOptionIndex] ?? '',
    explanation: challenge.explanation,
  };
}

export function calculateChallengeMetrics(
  completedIds: string[],
  completedScores: Record<string, { selected: number; correct: boolean }>,
  totalChallenges: number = CHALLENGES_DATASET.length
): ChallengeMetrics {
  const completedCount = completedIds.length;
  let correctCount = 0;

  for (const id of completedIds) {
    if (completedScores[id]?.correct) {
      correctCount += 1;
    }
  }

  const accuracyPercentage =
    completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;
  const completionPercentage =
    totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;

  return {
    totalCount: totalChallenges,
    completedCount,
    correctCount,
    accuracyPercentage,
    completionPercentage,
  };
}

export function getSavedChallenges(savedIds: string[]): ChallengeItem[] {
  const idSet = new Set(savedIds);
  return CHALLENGES_DATASET.filter((c) => idSet.has(c.id));
}

export function filterChallenges(options: {
  category?: ChallengeType | 'All';
  difficulty?: ChallengeDifficulty | 'All';
  searchQuery?: string;
  savedOnly?: boolean;
  savedIds?: string[];
}): ChallengeItem[] {
  const {
    category = 'All',
    difficulty = 'All',
    searchQuery = '',
    savedOnly = false,
    savedIds = [],
  } = options;

  let list = CHALLENGES_DATASET;

  if (savedOnly) {
    const idSet = new Set(savedIds);
    list = list.filter((c) => idSet.has(c.id));
  }

  if (category !== 'All') {
    list = list.filter((c) => c.category === category);
  }

  if (difficulty !== 'All') {
    list = list.filter((c) => c.difficulty === difficulty);
  }

  if (searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.prompt.toLowerCase().includes(q) ||
        c.question.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q) ||
        (c.instructions && c.instructions.toLowerCase().includes(q)) ||
        c.explanation.toLowerCase().includes(q) ||
        c.options.some((opt) => opt.toLowerCase().includes(q))
    );
  }

  return list;
}
