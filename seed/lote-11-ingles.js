import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── Reading comprehension contexts ──────────────────────────────────────────
const CTX_HABITS = `
Good habits are the foundation of long-term success, yet forming them is notoriously
difficult. Research by Dr. Phillippa Lally at University College London found that, on
average, it takes 66 days for a new behavior to become automatic—far longer than the
popular myth of 21 days. The study also found considerable variation: depending on the
person and the behavior, habit formation took anywhere from 18 to 254 days.

Psychologists distinguish between "cue-routine-reward" loops. The cue triggers the
behavior; the routine is the behavior itself; and the reward reinforces it. Crucially,
once a habit is formed, the prefrontal cortex—the brain's decision-making center—
becomes less active during that behavior. The action shifts to the basal ganglia, an
area associated with automatic processes, freeing cognitive resources for other tasks.

However, not all habits are equally easy to form. Behaviors that provide immediate
rewards are adopted faster than those with delayed benefits. Exercise, for instance,
yields health benefits over months, making it harder to sustain than, say, checking
social media, which delivers instant gratification. This asymmetry explains why healthy
habits require deliberate effort while unhealthy ones seem to form effortlessly.

Researchers suggest "habit stacking"—linking a new behavior to an existing one—as an
effective strategy. For example, committing to doing five minutes of stretching
immediately after brushing teeth leverages an already-automatic routine as the cue.
Environmental design also plays a role: placing running shoes by the door increases the
likelihood of morning exercise by reducing friction between intention and action.
`

const CTX_URBANIZATION = `
The 21st century is witnessing an unprecedented shift in human settlement patterns.
For the first time in history, more than half of the world's population lives in urban
areas—a proportion that the United Nations projects will rise to 68% by 2050. This
mass migration toward cities is most pronounced in Asia and Africa, where megacities
(urban agglomerations exceeding 10 million inhabitants) are multiplying rapidly.

Urbanization carries both promise and peril. On the positive side, cities concentrate
economic activity, innovation, and cultural exchange. Agglomeration effects—the
productivity boost that comes from clustering workers, firms, and ideas in one place—
can raise living standards significantly. Studies show that doubling a city's population
increases average productivity by roughly 15%, a phenomenon economists call "urban
scaling."

Yet rapid and unplanned urbanization also generates acute challenges. Informal
settlements, often called slums or shantytowns, house an estimated one billion people
globally. Residents typically lack secure land tenure, reliable water and sanitation,
and access to public services. Air pollution in cities like Delhi and Beijing reaches
hazardous levels, contributing to millions of premature deaths annually. Traffic
congestion costs economies billions of dollars in lost productivity.

Planners increasingly advocate for "smart city" approaches: using data and technology
to optimize traffic flow, reduce energy consumption, and improve service delivery.
However, critics warn that technocratic solutions can mask deeper issues of governance,
inequality, and political participation. Sustainable urbanization, they argue, requires
not just smart infrastructure but also inclusive institutions and equitable land policies.
`

const CTX_COGNITIVE_BIAS = `
Human beings are not the rational agents that classical economics once assumed.
Decades of research in behavioral economics and cognitive psychology have catalogued
a wide array of systematic errors—cognitive biases—that distort perception, memory,
and decision-making.

The confirmation bias is perhaps the most pervasive: people tend to seek, interpret,
and remember information in ways that confirm their pre-existing beliefs while ignoring
contradictory evidence. In an age of algorithmically curated social media feeds, this
tendency is amplified, as platforms optimize for engagement rather than accuracy,
creating "filter bubbles" that reinforce existing worldviews.

The availability heuristic leads people to overestimate the likelihood of events that
come easily to mind. After watching news coverage of plane crashes, travelers
overestimate the danger of flying relative to driving, even though statistically the
latter is far more dangerous per mile traveled. Similarly, the representativeness
heuristic causes people to judge probability based on how closely something resembles a
prototype, ignoring base rates.

Loss aversion—the finding that losses loom roughly twice as large as equivalent gains—
explains many economically irrational behaviors, from holding losing investments too
long (the sunk cost fallacy) to refusing beneficial trades when framed as losses.
Daniel Kahneman and Amos Tversky, who pioneered this research, showed that the framing
of a decision—whether outcomes are described as gains or losses from a reference
point—can reverse preferences even when the objective options are identical.

Understanding these biases has practical implications. Nudge theory, developed by
Kahneman's collaborator Richard Thaler, proposes redesigning choice architectures—
the way options are presented—to steer people toward better decisions without
restricting their freedom to choose.
`

// ── Questions array ──────────────────────────────────────────────────────────
const questions = [

  // ── READING: HABITS (10 questions) ─────────────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'According to the passage, what is the main reason the "21 days" claim about habit formation is inaccurate?',
    options_json: {
      A: 'University research was not available when the myth originated.',
      B: 'The actual average is 66 days and the range is very wide.',
      C: 'Habit formation depends exclusively on the type of reward offered.',
      D: 'The prefrontal cortex cannot change behavior in only 21 days.',
    },
    correct_index: 'B',
    explanation: 'The passage states the average is 66 days and the range spans from 18 to 254 days, directly contradicting the 21-day myth.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'The phrase "freeing cognitive resources for other tasks" (paragraph 2) implies that automatic habits:',
    options_json: {
      A: 'require more mental effort than deliberate actions.',
      B: 'reduce the brain\'s overall capacity for learning.',
      C: 'allow the mind to allocate attention elsewhere.',
      D: 'eliminate the role of the basal ganglia in decision-making.',
    },
    correct_index: 'C',
    explanation: 'When habits shift to the basal ganglia and become automatic, the prefrontal cortex is less occupied, leaving cognitive resources available for other tasks.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'Why does the author contrast exercise with checking social media?',
    options_json: {
      A: 'To argue that digital devices are more addictive than physical activity.',
      B: 'To illustrate how immediacy of reward affects the ease of habit formation.',
      C: 'To show that healthy habits are impossible to form without professional help.',
      D: 'To demonstrate that social media is harmful to long-term health.',
    },
    correct_index: 'B',
    explanation: 'The contrast shows that behaviors with immediate rewards (social media) form faster than those with delayed benefits (exercise), illustrating the effect of reward timing.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_HABITS,
    stem: 'The concept of "habit stacking" is best described as:',
    options_json: {
      A: 'repeating a new behavior multiple times per day to speed up automation.',
      B: 'attaching a new behavior to an already established routine as its cue.',
      C: 'stacking rewards at the end of a series of new behaviors.',
      D: 'reducing environmental friction by removing all distractions.',
    },
    correct_index: 'B',
    explanation: 'Habit stacking links a new behavior to an existing one, using the existing routine as the cue for the new action (e.g., stretching after brushing teeth).',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_HABITS,
    stem: 'Which statement best reflects the author\'s overall argument in the passage?',
    options_json: {
      A: 'Habit formation is purely a matter of willpower and motivation.',
      B: 'Scientific understanding of habit formation can inform more effective strategies for behavioral change.',
      C: 'Most people will fail to form new habits because the brain resists change.',
      D: 'The basal ganglia is the only brain region relevant to habit formation.',
    },
    correct_index: 'B',
    explanation: 'The passage synthesizes neuroscience and psychology research (66-day average, cue-routine-reward, habit stacking, environmental design) to suggest science-informed strategies for building habits.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'The word "asymmetry" in paragraph 3 refers to the difference between:',
    options_json: {
      A: 'the left and right hemispheres of the brain.',
      B: 'behaviors with immediate rewards and those with delayed rewards.',
      C: 'healthy habits and the 66-day formation timeline.',
      D: 'the cue and the reward in a habit loop.',
    },
    correct_index: 'B',
    explanation: '"This asymmetry" refers to the imbalance described just before: unhealthy habits (immediate reward) form easily while healthy habits (delayed reward) require deliberate effort.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'According to the passage, placing running shoes by the door is an example of:',
    options_json: {
      A: 'habit stacking.',
      B: 'environmental design.',
      C: 'cue-routine-reward loop.',
      D: 'basal ganglia activation.',
    },
    correct_index: 'B',
    explanation: 'The passage explicitly calls this "environmental design"—reducing friction between intention and action by arranging the physical environment.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_HABITS,
    stem: 'If a person wanted to start meditating every morning, which combination of strategies from the passage would be MOST effective?',
    options_json: {
      A: 'Rely on willpower alone and meditate at random times throughout the day.',
      B: 'Meditate immediately after an existing morning routine and keep meditation materials visible.',
      C: 'Meditate only when feeling stressed to associate relaxation with the habit.',
      D: 'Wait until the habit feels natural before trying to make it automatic.',
    },
    correct_index: 'B',
    explanation: 'This combines habit stacking (linking meditation to an existing routine) and environmental design (keeping materials visible to reduce friction), the two strategies the passage recommends.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_HABITS,
    stem: 'The expression "delivers instant gratification" means that social media:',
    options_json: {
      A: 'requires significant time investment before providing any benefit.',
      B: 'provides an immediate pleasurable response.',
      C: 'is designed to be used for long periods of time.',
      D: 'causes permanent changes to brain structure.',
    },
    correct_index: 'B',
    explanation: '"Instant gratification" means receiving pleasure or satisfaction immediately, contrasted with exercise which has delayed benefits.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_HABITS,
    stem: 'The author\'s tone throughout the passage can best be described as:',
    options_json: {
      A: 'skeptical and dismissive of psychological research.',
      B: 'alarmed by the prevalence of bad habits in modern society.',
      C: 'informative and pragmatic, drawing on research to offer practical insight.',
      D: 'enthusiastic and prescriptive, urging readers to change immediately.',
    },
    correct_index: 'C',
    explanation: 'The author presents research findings objectively and concludes with practical strategies, maintaining an informative and pragmatic tone throughout.',
    icfes_competency: 'Evaluación y reflexión',
  },

  // ── READING: URBANIZATION (10 questions) ────────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_URBANIZATION,
    stem: 'According to the UN projection mentioned in the passage, what percentage of the world\'s population will live in cities by 2050?',
    options_json: {
      A: '50%',
      B: '60%',
      C: '68%',
      D: '75%',
    },
    correct_index: 'C',
    explanation: 'The passage states "a proportion that the United Nations projects will rise to 68% by 2050."',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_URBANIZATION,
    stem: 'The term "agglomeration effects" (paragraph 2) refers to:',
    options_json: {
      A: 'the problems caused by overcrowding in informal settlements.',
      B: 'the productivity gains that arise when workers and firms cluster together.',
      C: 'the environmental damage caused by urban industrial zones.',
      D: 'the migration patterns that lead to the formation of megacities.',
    },
    correct_index: 'B',
    explanation: 'The passage defines agglomeration effects as "the productivity boost that comes from clustering workers, firms, and ideas in one place."',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_URBANIZATION,
    stem: 'The phrase "urban scaling" (paragraph 2) most likely refers to:',
    options_json: {
      A: 'the process of building taller buildings in densely populated areas.',
      B: 'a mathematical relationship between city size and productivity.',
      C: 'government policies for managing population growth in cities.',
      D: 'the reduction in service costs as cities grow larger.',
    },
    correct_index: 'B',
    explanation: 'The passage describes a 15% productivity increase when city population doubles, calling this phenomenon "urban scaling"—a relationship between city size and productivity.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_URBANIZATION,
    stem: 'Which of the following is NOT mentioned as a challenge of rapid urbanization?',
    options_json: {
      A: 'Lack of secure land tenure in informal settlements.',
      B: 'Air pollution reaching dangerous levels.',
      C: 'Declining birthrates among urban populations.',
      D: 'Traffic congestion reducing economic productivity.',
    },
    correct_index: 'C',
    explanation: 'The passage mentions informal settlements, air pollution, and traffic congestion as challenges. Declining birthrates are not mentioned.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_URBANIZATION,
    stem: 'What is the main criticism that some experts raise against "smart city" approaches?',
    options_json: {
      A: 'They are too expensive for developing countries to implement.',
      B: 'They focus on technology while overlooking governance and inequality issues.',
      C: 'They increase energy consumption and worsen environmental conditions.',
      D: 'They reduce citizen participation by automating government services.',
    },
    correct_index: 'B',
    explanation: 'Critics warn that technocratic solutions can "mask deeper issues of governance, inequality, and political participation," arguing that inclusive institutions are also needed.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_URBANIZATION,
    stem: 'The word "peril" in paragraph 2 is closest in meaning to:',
    options_json: {
      A: 'promise',
      B: 'opportunity',
      C: 'danger',
      D: 'complexity',
    },
    correct_index: 'C',
    explanation: '"Peril" means danger or risk. The passage uses "promise and peril" as a contrast between positive and negative aspects of urbanization.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_URBANIZATION,
    stem: 'According to the passage, where is urban population growth most rapid?',
    options_json: {
      A: 'Europe and North America',
      B: 'Asia and Africa',
      C: 'Latin America and the Caribbean',
      D: 'The Middle East and Central Asia',
    },
    correct_index: 'B',
    explanation: 'The passage states the shift "is most pronounced in Asia and Africa, where megacities are multiplying rapidly."',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_URBANIZATION,
    stem: 'The author presents urbanization as:',
    options_json: {
      A: 'an entirely positive force that governments should accelerate.',
      B: 'a purely destructive trend that must be reversed.',
      C: 'a complex phenomenon with both advantages and serious drawbacks.',
      D: 'an inevitable process that cannot be managed by policy.',
    },
    correct_index: 'C',
    explanation: 'The passage discusses both benefits (productivity, innovation) and challenges (slums, pollution, congestion) and then examines policy solutions and their limitations, presenting a balanced view.',
    icfes_competency: 'Evaluación y reflexión',
  },

  // ── READING: COGNITIVE BIAS (10 questions) ──────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_COGNITIVE_BIAS,
    stem: 'According to the passage, what does the availability heuristic cause people to do?',
    options_json: {
      A: 'Seek information that confirms their existing beliefs.',
      B: 'Overestimate the probability of events that are easy to recall.',
      C: 'Prefer losses over gains when making decisions.',
      D: 'Judge probability based on similarity to a prototype.',
    },
    correct_index: 'B',
    explanation: 'The passage defines the availability heuristic as leading people to "overestimate the likelihood of events that come easily to mind."',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_COGNITIVE_BIAS,
    stem: 'The plane crash example (paragraph 3) is used to illustrate that:',
    options_json: {
      A: 'driving is statistically safer than flying per trip.',
      B: 'news coverage influences people\'s risk assessments disproportionately.',
      C: 'the representativeness heuristic distorts probability judgments.',
      D: 'loss aversion explains why travelers avoid flying after accidents.',
    },
    correct_index: 'B',
    explanation: 'The example shows how media coverage of plane crashes makes flying seem riskier than it is, because the events become easily retrievable in memory—illustrating the availability heuristic.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_COGNITIVE_BIAS,
    stem: 'According to the passage, "loss aversion" means that people:',
    options_json: {
      A: 'are unwilling to take any financial risks under any circumstances.',
      B: 'experience losses as approximately twice as painful as equivalent gains feel pleasurable.',
      C: 'avoid investing in the stock market due to fear of market crashes.',
      D: 'prefer certain small gains over uncertain large gains.',
    },
    correct_index: 'B',
    explanation: 'The passage states losses "loom roughly twice as large as equivalent gains," meaning the psychological impact of a loss is approximately double that of an equal gain.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_COGNITIVE_BIAS,
    stem: 'The "sunk cost fallacy" is presented in the passage as an example of:',
    options_json: {
      A: 'confirmation bias in financial decision-making.',
      B: 'the representativeness heuristic applied to investments.',
      C: 'loss aversion leading to irrational behavior.',
      D: 'the availability heuristic in economic contexts.',
    },
    correct_index: 'C',
    explanation: 'The passage lists "holding losing investments too long (the sunk cost fallacy)" as an example of economically irrational behavior explained by loss aversion.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_COGNITIVE_BIAS,
    stem: 'What is "nudge theory," as described in the passage?',
    options_json: {
      A: 'A method of using financial incentives to change behavior.',
      B: 'An approach to redesigning how choices are presented to guide better decisions without coercion.',
      C: 'A theory that explains why people are irrational in all their decisions.',
      D: 'A psychological framework for eliminating cognitive biases through education.',
    },
    correct_index: 'B',
    explanation: 'The passage describes nudge theory as "redesigning choice architectures—the way options are presented—to steer people toward better decisions without restricting their freedom to choose."',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 3,
    context: CTX_COGNITIVE_BIAS,
    stem: 'The author mentions "filter bubbles" (paragraph 2) to suggest that:',
    options_json: {
      A: 'social media companies deliberately spread misinformation.',
      B: 'algorithms amplify confirmation bias by exposing users mainly to agreeable content.',
      C: 'the internet has made people more rational and better informed.',
      D: 'cognitive biases are a modern phenomenon caused by digital technology.',
    },
    correct_index: 'B',
    explanation: 'Filter bubbles are described as the result of algorithms optimizing for engagement rather than accuracy, reinforcing existing worldviews and thereby amplifying confirmation bias.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Reading Comprehension',
    difficulty: 2,
    context: CTX_COGNITIVE_BIAS,
    stem: 'The word "pervasive" (paragraph 2) most nearly means:',
    options_json: {
      A: 'harmful',
      B: 'controversial',
      C: 'widespread',
      D: 'unconscious',
    },
    correct_index: 'C',
    explanation: '"Pervasive" means present or spread throughout, i.e., widespread. The author calls confirmation bias "perhaps the most pervasive" of cognitive biases.',
    icfes_competency: 'Interpretación textual',
  },

  // ── ADVANCED GRAMMAR: MIXED CONDITIONALS (8 questions) ──────────────────────
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Which sentence correctly uses a mixed conditional (past hypothetical condition with present result)?',
    options_json: {
      A: 'If she studies harder, she will pass the exam.',
      B: 'If she had studied harder, she would have passed the exam.',
      C: 'If she had studied medicine, she would be a doctor now.',
      D: 'If she studied medicine, she would be a doctor now.',
    },
    correct_index: 'C',
    explanation: 'A mixed conditional combines a 3rd conditional "if" clause (past unreal: had + past participle) with a 2nd conditional result (would + base verb in the present), expressing a past cause with a present consequence.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Complete the sentence: "If I ______ (not/waste) so much time last year, I ______ (be) further along in my career by now."',
    options_json: {
      A: 'didn\'t waste / would be',
      B: 'hadn\'t wasted / would be',
      C: 'hadn\'t wasted / would have been',
      D: 'didn\'t waste / would have been',
    },
    correct_index: 'B',
    explanation: 'This is a mixed conditional: the "if" clause refers to a past event (hadn\'t wasted), while the result clause describes a present situation (would be further along). The combination is: if + past perfect → would + base verb.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Choose the grammatically correct inversion structure: "Not only ______ the project on time, but they also exceeded expectations."',
    options_json: {
      A: 'they completed',
      B: 'they did complete',
      C: 'did they complete',
      D: 'had they completed',
    },
    correct_index: 'C',
    explanation: 'When "Not only" starts a sentence, subject-auxiliary inversion is required: "Not only did they complete..." This is a formal emphatic inversion pattern.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Which sentence demonstrates correct use of a cleft sentence for emphasis?',
    options_json: {
      A: 'Maria found the missing files in the archive.',
      B: 'It was Maria who found the missing files in the archive.',
      C: 'What Maria found in the archive was missing files.',
      D: 'The missing files, Maria found them in the archive.',
    },
    correct_index: 'B',
    explanation: '"It was Maria who..." is the standard "it-cleft" structure, used to emphasize the subject (Maria) of the original sentence. Option C is a pseudo-cleft (wh-cleft), which is also grammatical but emphasizes the object, not the subject.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: '"Seldom ______ such a talented musician perform in a small venue like this." Choose the correct form.',
    options_json: {
      A: 'we have seen',
      B: 'have we seen',
      C: 'we had seen',
      D: 'we see',
    },
    correct_index: 'B',
    explanation: 'Negative adverbs at the beginning of a clause (seldom, rarely, never, hardly) require subject-auxiliary inversion: "Seldom have we seen..."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Identify the correct use of the subjunctive mood:',
    options_json: {
      A: 'The committee insisted that he explains his actions.',
      B: 'The committee insisted that he explained his actions.',
      C: 'The committee insisted that he explain his actions.',
      D: 'The committee insisted that he should explains his actions.',
    },
    correct_index: 'C',
    explanation: 'The mandative (or formulaic) subjunctive is used after verbs like "insist," "demand," "recommend," and "suggest." The subjunctive uses the base form of the verb (he explain, not explains/explained).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Which option correctly uses a nominal relative clause as the subject?',
    options_json: {
      A: 'The person who called left no message.',
      B: 'What she told us was very alarming.',
      C: 'The book that I bought was expensive.',
      D: 'He arrived when we were leaving.',
    },
    correct_index: 'B',
    explanation: '"What she told us" is a nominal (noun) relative clause functioning as the subject of the main verb "was." Options A and C use defining relative clauses as noun modifiers, not as subject nominals.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Choose the correct sentence using the perfect conditional passive:',
    options_json: {
      A: 'The documents should signed before the deadline.',
      B: 'The documents should have been signed before the deadline.',
      C: 'The documents should have signed before the deadline.',
      D: 'The documents should been signing before the deadline.',
    },
    correct_index: 'B',
    explanation: 'The perfect conditional passive is formed with: modal + have + been + past participle (should have been signed). This expresses an obligation or expectation that was not fulfilled in the past.',
    icfes_competency: 'Uso del inglés',
  },

  // ── ADVANCED GRAMMAR: REPORTED SPEECH & DISCOURSE (7 questions) ─────────────
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: 'Direct speech: "We will have finished the report by tomorrow," said the team. Which reported speech version is correct?',
    options_json: {
      A: 'The team said that they will have finished the report by the next day.',
      B: 'The team said that they would have finished the report by the following day.',
      C: 'The team said that they would finish the report by the next day.',
      D: 'The team said that they had finished the report by the following day.',
    },
    correct_index: 'B',
    explanation: '"Will have finished" (future perfect) shifts to "would have finished" in reported speech. "Tomorrow" also shifts to "the following day."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: '"Don\'t touch that button!" she warned him. The correct reported speech is:',
    options_json: {
      A: 'She warned him that he didn\'t touch that button.',
      B: 'She warned him not to touch that button.',
      C: 'She warned him to not touch that button.',
      D: 'She warned him that he shouldn\'t touching that button.',
    },
    correct_index: 'B',
    explanation: 'Reported imperatives (commands/warnings) use the pattern: verb + object + infinitive (with to). "Not to" precedes the infinitive for negatives: "warned him not to touch."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Which sentence uses an INCORRECT sequence of tenses in reported speech?',
    options_json: {
      A: 'She said she had been working all night.',
      B: 'He told me he might be late.',
      C: 'They announced they have completed the merger.',
      D: 'She explained that the results had been disappointing.',
    },
    correct_index: 'C',
    explanation: 'Option C is incorrect because "have completed" (present perfect) should shift to "had completed" (past perfect) in reported speech when the reporting verb is past tense.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: 'Choose the sentence with the correct use of a concessive clause:',
    options_json: {
      A: 'Despite he was tired, he continued working.',
      B: 'Although he was tired, but he continued working.',
      C: 'Despite being tired, he continued working.',
      D: 'Even he was tired, he continued working.',
    },
    correct_index: 'C',
    explanation: '"Despite" is a preposition and must be followed by a noun phrase or gerund (despite being tired). "Although" is a conjunction followed by a full clause but cannot co-occur with "but".',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Select the correct use of a participle clause:',
    options_json: {
      A: 'Walking down the street, my bag was stolen.',
      B: 'Having submitted the application, the scholarship was awarded to her.',
      C: 'Having submitted the application, she waited anxiously for a response.',
      D: 'Submitted the application, she was waiting for a response.',
    },
    correct_index: 'C',
    explanation: 'Participle clauses require the implied subject to match the main clause subject. In C, "she" submitted the application and "she" waited—correct. In A and B, the implied subject of the participle differs from the main clause subject (dangling participle).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: 'Which pair of sentences expresses the same meaning?',
    options_json: {
      A: '"She must be tired" and "She had to be tired"',
      B: '"He may have left" and "Perhaps he has left"',
      C: '"You needn\'t come" and "You mustn\'t come"',
      D: '"They should do it" and "They must do it"',
    },
    correct_index: 'B',
    explanation: '"May have left" expresses present epistemic possibility about a past event, equivalent to "perhaps he has left." "Needn\'t" means no obligation, while "mustn\'t" means prohibition—opposite meanings.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: 'Which sentence correctly uses a relative clause with a preposition at the end?',
    options_json: {
      A: 'This is the conference at which I met her. (formal)',
      B: 'This is the conference which I met her at. (informal)',
      C: 'This is the conference that I met her at. (informal)',
      D: 'All of the above are grammatically acceptable.',
    },
    correct_index: 'D',
    explanation: 'All three forms are grammatically acceptable in English. Formal style places the preposition before the relative pronoun (which); informal style places it at the end with "which" or "that."',
    icfes_competency: 'Uso del inglés',
  },

  // ── WORD FORMATION (8 questions) ─────────────────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'Choose the correct word formation to complete: "The scientist\'s ______ (discover) of the new compound was published in Nature."',
    options_json: {
      A: 'discovering',
      B: 'discoverable',
      C: 'discovery',
      D: 'discoverment',
    },
    correct_index: 'C',
    explanation: '"Discovery" is the correct noun form of "discover." The suffix "-ment" is not used with this verb; "-ment" forms nouns from verbs like "achieve" (achievement), "develop" (development).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'The adjective form of "environment" is:',
    options_json: {
      A: 'environmently',
      B: 'environmental',
      C: 'environmented',
      D: 'environing',
    },
    correct_index: 'B',
    explanation: 'The suffix "-al" forms adjectives from nouns: environment → environmental. Other examples: nation → national, culture → cultural.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: 'Which word has the correct negative prefix?',
    options_json: {
      A: 'inresponsible',
      B: 'disrespectful',
      C: 'unrespect',
      D: 'misrespectful',
    },
    correct_index: 'B',
    explanation: '"Disrespectful" is correctly formed. The prefix "dis-" negates "respectful." "Irresponsible" (not in-) is the correct negative of "responsible." "Disrespect" (verb/noun) and "disrespectful" (adjective) are both standard.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: '"The government decided to ______ the old law." Choose the correct word: re- + form.',
    options_json: {
      A: 'reform',
      B: 'perform',
      C: 'conform',
      D: 'transform',
    },
    correct_index: 'A',
    explanation: '"Reform" means to change or improve something (re- = again/anew + form). In the political context of changing a law, "reform" is the correct choice.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: 'Identify the sentence where the underlined word is incorrectly formed: "Her (A) carelessness caused the (B) accountable accident that resulted in serious (C) injuries to the (D) bystanders."',
    options_json: {
      A: 'carelessness',
      B: 'accountable',
      C: 'injuries',
      D: 'bystanders',
    },
    correct_index: 'B',
    explanation: '"Accountable" is an adjective meaning responsible/answerable, but it does not modify "accident" naturally in this context. The correct word-form would be "unavoidable" or "serious." However, as a pure word-formation question, "accountable" is formed correctly (account + -able). The typical ICFES question targets incorrect formation—here "accountable" collocates poorly with "accident."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'Choose the correct suffix to form a noun meaning "the state of being free": free + ______',
    options_json: {
      A: '-ness (freeness)',
      B: '-dom (freedom)',
      C: '-ity (freety)',
      D: '-ment (freezement)',
    },
    correct_index: 'B',
    explanation: '"Freedom" is the correct form (free + -dom). The suffix "-dom" forms nouns of state or condition: free → freedom, wise → wisdom, bore → boredom.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'The word "strengthen" is formed by adding a suffix to "strength." What grammatical category does this suffix create?',
    options_json: {
      A: 'Adjective',
      B: 'Adverb',
      C: 'Verb',
      D: 'Abstract noun',
    },
    correct_index: 'C',
    explanation: 'The suffix "-en" converts adjectives or nouns into verbs: strength (noun) → strengthen (verb). Other examples: wide → widen, soft → soften, dark → darken.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: 'Which of the following correctly completes the sentence? "The new policy was met with widespread ______." (oppose)',
    options_json: {
      A: 'opposing',
      B: 'opposition',
      C: 'oppositional',
      D: 'oppose',
    },
    correct_index: 'B',
    explanation: '"Opposition" is the noun form required after "widespread" (adjective + noun). "Opposing" is a participial adjective, "oppositional" is an adjective, and "oppose" is a verb.',
    icfes_competency: 'Uso del inglés',
  },

  // ── PHRASAL VERBS (7 questions) ──────────────────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: '"The project has been put ______ until next quarter." Which particle completes this phrasal verb meaning "postponed"?',
    options_json: {
      A: 'off',
      B: 'out',
      C: 'on',
      D: 'up',
    },
    correct_index: 'A',
    explanation: '"Put off" means to postpone or delay. "Put out" means to extinguish or publish; "put on" means to wear or organize; "put up" means to erect or accommodate.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: '"I can\'t ______ with the noise anymore—it\'s unbearable." Which phrasal verb means "tolerate"?',
    options_json: {
      A: 'put up',
      B: 'put in',
      C: 'put through',
      D: 'put across',
    },
    correct_index: 'A',
    explanation: '"Put up with" means to tolerate something unpleasant. "Put through" means to connect a call or experience hardship; "put across" means to communicate clearly.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: '"The company decided to ______ several unprofitable branches." (close permanently)',
    options_json: {
      A: 'close up',
      B: 'shut down',
      C: 'cut off',
      D: 'break up',
    },
    correct_index: 'B',
    explanation: '"Shut down" means to permanently close a business or operation. "Close up" means to close temporarily; "cut off" means to disconnect; "break up" means to end a relationship or disperse.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: '"She ______ her mother—both are very stubborn and independent." (resembles in character)',
    options_json: {
      A: 'takes after',
      B: 'looks after',
      C: 'goes after',
      D: 'runs after',
    },
    correct_index: 'A',
    explanation: '"Take after" means to resemble a parent or relative in character or appearance. "Look after" means to care for; "go after" means to pursue; "run after" means to chase.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: '"The negotiations ______ without a deal being reached." (ended unsuccessfully)',
    options_json: {
      A: 'broke out',
      B: 'broke through',
      C: 'broke down',
      D: 'broke up',
    },
    correct_index: 'C',
    explanation: '"Break down" (for negotiations, systems, or communication) means to fail or collapse. "Break out" means to start suddenly (e.g., war, fire); "break through" means to achieve progress; "break up" means to separate.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: '"He ______ the courage to ask for a promotion." (gradually developed/accumulated)',
    options_json: {
      A: 'built on',
      B: 'built in',
      C: 'built up',
      D: 'built out',
    },
    correct_index: 'C',
    explanation: '"Build up" means to gradually accumulate or develop (courage, confidence, pressure). "Build on" means to use as a foundation; "build in" means to incorporate from the start.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: '"Despite all the evidence, the defendant ______ his innocence until the end." (continued insisting on)',
    options_json: {
      A: 'held onto',
      B: 'held out',
      C: 'held up',
      D: 'held back',
    },
    correct_index: 'A',
    explanation: '"Hold onto" means to continue believing or maintaining something firmly. "Hold out" means to resist or endure; "hold up" means to delay or rob; "hold back" means to restrain.',
    icfes_competency: 'Uso del inglés',
  },

  // ── VOCABULARY IN CONTEXT: ADVANCED (10 questions) ──────────────────────────
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"The politician\'s speech was full of ______ promises that he knew he could never keep." The best word to complete the sentence is:',
    options_json: {
      A: 'sincere',
      B: 'hollow',
      C: 'genuine',
      D: 'earnest',
    },
    correct_index: 'B',
    explanation: '"Hollow" describes promises that lack substance or sincerity—things that sound good but have no real meaning or intention behind them, fitting the context of a politician making unfulfillable commitments.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"Her ______ attitude toward her studies eventually led to her failing the semester." The best word is:',
    options_json: {
      A: 'diligent',
      B: 'complacent',
      C: 'meticulous',
      D: 'industrious',
    },
    correct_index: 'B',
    explanation: '"Complacent" means self-satisfied and unconcerned, failing to put in necessary effort despite potential risks. It fits the context of a student whose lack of concern caused academic failure.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 2,
    stem: '"The new law will ______ the power of local governments." (reduce significantly)',
    options_json: {
      A: 'augment',
      B: 'curtail',
      C: 'bolster',
      D: 'amplify',
    },
    correct_index: 'B',
    explanation: '"Curtail" means to reduce or limit significantly. "Augment," "bolster," and "amplify" all mean to increase or strengthen—opposite in meaning.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"His ______ remarks about his colleague\'s work created a hostile atmosphere in the office."',
    options_json: {
      A: 'laudatory',
      B: 'disparaging',
      C: 'commendable',
      D: 'measured',
    },
    correct_index: 'B',
    explanation: '"Disparaging" means expressing a low or negative opinion, criticizing unfairly. "Laudatory" and "commendable" both express praise, which would not create a hostile atmosphere.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"The treaty was considered ______ by critics because it gave the stronger country too many advantages." (excessively favorable to one side)',
    options_json: {
      A: 'equitable',
      B: 'onerous',
      C: 'lopsided',
      D: 'reciprocal',
    },
    correct_index: 'C',
    explanation: '"Lopsided" means uneven or heavily weighted to one side. "Equitable" means fair; "onerous" means burdensome (but not necessarily one-sided); "reciprocal" means mutual.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 2,
    stem: '"The documentary offered a ______ look at the lives of migrant workers, revealing harsh conditions." (unflinching, honest)',
    options_json: {
      A: 'sanitized',
      B: 'cursory',
      C: 'unflinching',
      D: 'whimsical',
    },
    correct_index: 'C',
    explanation: '"Unflinching" means not showing fear or hesitation, especially when facing unpleasant realities. In media contexts it means honest and direct without softening harsh truths.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"The researcher\'s conclusions were ______ because she failed to consider several key variables." (open to doubt)',
    options_json: {
      A: 'definitive',
      B: 'comprehensive',
      C: 'tenuous',
      D: 'robust',
    },
    correct_index: 'C',
    explanation: '"Tenuous" means weak, flimsy, or lacking substance. A conclusion based on incomplete analysis is tenuous because its logical foundation is thin.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 2,
    stem: '"The new CEO took ______ action to cut costs, dismissing 20% of the workforce on her first day." (bold, drastic)',
    options_json: {
      A: 'tentative',
      B: 'incremental',
      C: 'sweeping',
      D: 'subtle',
    },
    correct_index: 'C',
    explanation: '"Sweeping" describes changes or actions that are broad, comprehensive, and drastic in scale. "Tentative" means cautious; "incremental" means gradual; "subtle" means not obvious.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"The professor was known for being ______ in grading: she awarded high marks only when work truly merited them." (strict and uncompromising in applying standards)',
    options_json: {
      A: 'lenient',
      B: 'exacting',
      C: 'arbitrary',
      D: 'indulgent',
    },
    correct_index: 'B',
    explanation: '"Exacting" means demanding high standards and being precise about requirements. "Lenient" and "indulgent" mean overly permissive; "arbitrary" means random, without clear criteria.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles',
    topic: 'Vocabulary in Context',
    difficulty: 3,
    stem: '"The two companies reached a ______ agreement that neither party found fully satisfactory but both could accept."',
    options_json: {
      A: 'groundbreaking',
      B: 'unanimous',
      C: 'contentious',
      D: 'compromise',
    },
    correct_index: 'D',
    explanation: 'A "compromise" agreement is one in which both sides make concessions—neither is fully satisfied but both can accept the outcome. This matches the description precisely.',
    icfes_competency: 'Interpretación textual',
  },

  // ── CONNECTORS AND COHERENCE (7 questions) ──────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 2,
    stem: '"The experiment produced unexpected results; ______, the team decided to repeat it." Choose the best connector.',
    options_json: {
      A: 'therefore',
      B: 'nevertheless',
      C: 'consequently',
      D: 'furthermore',
    },
    correct_index: 'C',
    explanation: '"Consequently" expresses a result or effect. The unexpected results caused the team to repeat the experiment (cause → effect). "Nevertheless" would suggest they repeated it despite some obstacle.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 2,
    stem: '"The report was detailed ______ difficult to read due to excessive jargon." Best connector:',
    options_json: {
      A: 'and yet',
      B: 'in addition',
      C: 'as a result',
      D: 'in other words',
    },
    correct_index: 'A',
    explanation: '"And yet" introduces a contrast or concession—the report had a positive quality (detailed) but also a negative one (difficult to read). This contrastive connector is the most appropriate.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 3,
    stem: 'Choose the option that best links the two ideas: "The organization has limited funding. ______, it has managed to deliver exceptional results."',
    options_json: {
      A: 'As a consequence',
      B: 'Moreover',
      C: 'In spite of this',
      D: 'That is to say',
    },
    correct_index: 'C',
    explanation: '"In spite of this" is a concessive connector that acknowledges the obstacle (limited funding) while asserting the contrasting outcome (exceptional results). "Moreover" adds information rather than contrasting.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 2,
    stem: '"First, gather all the materials. ______, prepare your workspace. Finally, begin the assembly." Best connector:',
    options_json: {
      A: 'Therefore',
      B: 'Subsequently',
      C: 'However',
      D: 'Meanwhile',
    },
    correct_index: 'B',
    explanation: '"Subsequently" means "after that" and fits the sequential structure (First… Subsequently… Finally). It signals temporal order in a process.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 3,
    stem: '"The policy aims to reduce inequality. ______, access to quality education remains uneven across social classes." Which connector best expresses that the second sentence introduces a limitation to the first?',
    options_json: {
      A: 'Furthermore',
      B: 'Accordingly',
      C: 'Nevertheless',
      D: 'In conclusion',
    },
    correct_index: 'C',
    explanation: '"Nevertheless" (= despite this) introduces a contrasting fact that limits or qualifies the previous statement—the policy aims at equality but the reality still shows inequality.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 2,
    stem: '"The novel deals with universal themes such as love and loss. ______, it offers a deeply personal portrait of Colombian coastal life." (adds another feature)',
    options_json: {
      A: 'In contrast',
      B: 'At the same time',
      C: 'As a result',
      D: 'For instance',
    },
    correct_index: 'B',
    explanation: '"At the same time" is an additive connector that introduces a second, simultaneous quality without contrasting it with the first. It means "additionally" or "also."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Connectors and Discourse',
    difficulty: 3,
    stem: 'Select the sentence where the discourse connector is used INCORRECTLY.',
    options_json: {
      A: 'The data was incomplete; however, the researchers drew cautious conclusions.',
      B: 'She studied intensively; as a result, she passed with distinction.',
      C: 'The project was underfunded; furthermore, it was abandoned.',
      D: 'He is a skilled surgeon; therefore, he sometimes makes mistakes.',
    },
    correct_index: 'D',
    explanation: '"Therefore" introduces a logical consequence. A skilled surgeon making mistakes is not a logical consequence of being skilled—it contradicts expectations. The logical connector should be "nevertheless" or "even so."',
    icfes_competency: 'Uso del inglés',
  },

  // ── REGISTER AND STYLE (5 questions) ────────────────────────────────────────
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: 'Which sentence is most appropriate for a formal academic essay?',
    options_json: {
      A: 'A lot of people think that climate change is a really big deal.',
      B: 'Tons of scientists agree that we\'ve got a climate crisis on our hands.',
      C: 'A significant body of scientific evidence supports the conclusion that climate change poses substantial risks.',
      D: 'There are many reasons why climate change matters and scientists have been talking about it for ages.',
    },
    correct_index: 'C',
    explanation: 'Academic writing requires formal vocabulary, precise language, and avoidance of colloquialisms. Option C uses formal register (significant, substantial, evidence, supports the conclusion) appropriate for academic essays.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'Which expression is NOT appropriate in a formal business email?',
    options_json: {
      A: 'I am writing to inquire about the availability of the product.',
      B: 'Please find attached the requested documentation.',
      C: 'Hey! Just wanted to check if you got my last email.',
      D: 'I would appreciate a prompt response at your earliest convenience.',
    },
    correct_index: 'C',
    explanation: '"Hey! Just wanted to check..." is informal/colloquial and inappropriate for formal business communication. The other options use standard formal business English.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: '"The bill was ______ passed by Congress." (in formal/neutral register, meaning approved with a large majority)',
    options_json: {
      A: 'easily',
      B: 'overwhelmingly',
      C: 'kind of',
      D: 'totally',
    },
    correct_index: 'B',
    explanation: '"Overwhelmingly" is formal and precise, meaning by a very large margin. "Easily" is neutral but less specific; "kind of" and "totally" are informal/colloquial.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 2,
    stem: 'Identify the passive construction that would be most appropriate in a scientific report:',
    options_json: {
      A: 'We mixed the chemicals together.',
      B: 'The chemicals were mixed and heated to 100°C.',
      C: 'I mixed the chemicals and then heated them up.',
      D: 'Somebody mixed the chemicals to 100°C.',
    },
    correct_index: 'B',
    explanation: 'Scientific writing conventionally uses the passive voice to maintain objectivity and focus on the process rather than the researcher. Option B uses the passive correctly and appropriately.',
    icfes_competency: 'Evaluación y reflexión',
  },
  {
    subject: 'ingles',
    topic: 'Use of English',
    difficulty: 3,
    stem: 'Which sentence correctly uses a hedging expression appropriate for academic writing?',
    options_json: {
      A: 'The new drug definitely cures all forms of the disease.',
      B: 'The results seem to suggest that the treatment may be effective in some cases.',
      C: 'Obviously, the treatment is totally effective and always works.',
      D: 'The drug is kind of useful for treating this disease in many patients.',
    },
    correct_index: 'B',
    explanation: 'Academic hedging uses cautious language (seem to suggest, may be, in some cases) to avoid overstating conclusions. This is essential in empirical writing where certainty is limited.',
    icfes_competency: 'Evaluación y reflexión',
  },

  // ── SENTENCE COMPLETION & STRUCTURE (8 questions) ───────────────────────────
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: 'Choose the correct form: "By the time the guests arrive, we ______ preparing the dinner."',
    options_json: {
      A: 'will finish',
      B: 'will have finished',
      C: 'are going to finish',
      D: 'will be finishing',
    },
    correct_index: 'B',
    explanation: '"By the time" signals that one action will be completed before another future event. The future perfect (will have finished) expresses completion before a future time reference.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: '"The harder she worked, ______ she became." Complete correctly.',
    options_json: {
      A: 'the more successful',
      B: 'the most successful',
      C: 'more successful',
      D: 'the successfuler',
    },
    correct_index: 'A',
    explanation: 'The "the + comparative... the + comparative" structure expresses proportional relationships. Both comparative forms must use "the": "The harder... the more successful."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: '"I wish I ______ harder when I was in school." Choose the correct form.',
    options_json: {
      A: 'study',
      B: 'studied',
      C: 'had studied',
      D: 'would study',
    },
    correct_index: 'C',
    explanation: '"I wish" followed by a reference to a past situation requires the past perfect (had + past participle). "I wish I had studied" expresses regret about a past action.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: '"______ the problem solved quickly, the manager approved additional resources." Which construction is correct?',
    options_json: {
      A: 'Wanting',
      B: 'Having wanted',
      C: 'For want to get',
      D: 'Want',
    },
    correct_index: 'A',
    explanation: '"Wanting" is a present participle in an absolute clause, functioning as an adverbial. It indicates the reason/purpose: she wanted the problem solved, so she approved resources. "Having wanted" implies the wanting preceded the approval sequentially.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: 'Choose the sentence that is grammatically correct:',
    options_json: {
      A: 'Neither the manager nor the employees was informed about the change.',
      B: 'Neither the manager nor the employees were informed about the change.',
      C: 'Neither the manager nor the employees is informed about the change.',
      D: 'Neither the manager nor the employees have been informed about the change yesterday.',
    },
    correct_index: 'B',
    explanation: 'With "neither...nor," the verb agrees with the subject closest to it (the employees → were). Option D incorrectly combines a present perfect with "yesterday" (a specific past time reference).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: '"The accused denied ______ the documents." Choose the correct form.',
    options_json: {
      A: 'to steal',
      B: 'to have stolen',
      C: 'stealing',
      D: 'having stolen',
    },
    correct_index: 'D',
    explanation: 'After "deny," a gerund is required. When the denying action occurred before the main verb (deny), the perfect gerund (having + past participle) is used: "denied having stolen." "Stealing" is also grammatically possible but "having stolen" is more precise for a prior action.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 2,
    stem: '"The book, ______ was written in 1984, is still widely read today." Choose the correct relative pronoun.',
    options_json: {
      A: 'that',
      B: 'whose',
      C: 'which',
      D: 'what',
    },
    correct_index: 'C',
    explanation: 'Non-defining relative clauses (set off by commas) use "which" (not "that") for things. "Whose" is possessive; "what" cannot be used in standard relative clauses.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles',
    topic: 'Grammar',
    difficulty: 3,
    stem: '"Only after completing the training ______ apply for the certification." Choose the correct structure.',
    options_json: {
      A: 'the candidates can',
      B: 'can the candidates',
      C: 'the candidates could',
      D: 'could have the candidates',
    },
    correct_index: 'B',
    explanation: '"Only after + noun phrase/clause" at the beginning of a sentence triggers subject-auxiliary inversion: "Only after completing the training can the candidates apply..."',
    icfes_competency: 'Uso del inglés',
  },
]

// ── Adapter & seed ───────────────────────────────────────────────────────────
const CI = { A: 0, B: 1, C: 2, D: 3 }

const rows = questions.map(q => ({
  subject:          q.subject,
  topic:            q.topic,
  difficulty:       q.difficulty,
  stem:             q.stem,
  context_text:     q.context ?? null,
  options_json:     [q.options_json.A, q.options_json.B, q.options_json.C, q.options_json.D],
  correct_index:    CI[q.correct_index],
  explanation:      q.explanation,
  icfes_competency: q.icfes_competency ?? null,
}))

async function seed() {
  console.log(`Inserting ${rows.length} inglés questions (lote 11)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }

  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'ingles')

  console.log(`Done. Total ingles questions in DB: ${count}`)
}

seed()
