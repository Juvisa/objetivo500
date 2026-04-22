import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CTX_MUSIC = `
Music is one of the few human activities that engages virtually the entire brain simultaneously.
Neuroscientists using brain imaging technology have found that listening to music activates visual,
motor, limbic, and language areas in addition to auditory regions. Playing an instrument intensifies
this effect: musicians show enlarged corpus callosum—the bridge between the brain's two
hemispheres—suggesting that musical training enhances neural connectivity.

Research by Nina Kraus at Northwestern University demonstrated that musicians process speech in
noise more effectively than non-musicians. The auditory brainstem, normally considered a subcortical
relay station, shows enhanced responses in people who have played instruments from an early age.
This finding challenges the traditional view that higher cognitive functions are strictly cortical.

Music therapy has emerged as a clinical application of these neurological insights. Neurologist
Oliver Sacks documented patients with severe amnesia who, despite being unable to form new
memories, could learn new songs—evidence that musical memory follows different neural pathways
than episodic memory. Similarly, music-based interventions have shown benefits for patients with
Parkinson's disease, stroke rehabilitation, and autism spectrum disorder.

The emotional power of music is partly explained by its ability to trigger dopamine release—the
same neurotransmitter associated with pleasure from food or social interaction. A study by Robert
Zatorre found that musical "chills" (frissons) correlate with dopamine release in the nucleus
accumbens. Interestingly, even anticipating a favorite musical passage can produce this response,
suggesting that music engages the brain's predictive mechanisms.
`

const questions = [
  // ── Reading: Music and the Brain (10 questions) ────────────────────────────
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 2,
    context: CTX_MUSIC,
    stem: 'According to the passage, what makes playing an instrument different from simply listening to music?',
    options_json: {
      A: 'It activates only the auditory cortex rather than multiple brain regions.',
      B: 'It intensifies brain activation and is associated with a larger corpus callosum.',
      C: 'It prevents the development of neural connections in non-musicians.',
      D: 'It exclusively benefits patients with neurological disorders.',
    },
    correct_index: 'B',
    explanation: 'The passage states that playing an instrument "intensifies this effect" (full-brain engagement) and that musicians show an "enlarged corpus callosum," suggesting stronger inter-hemispheric connectivity.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 2,
    context: CTX_MUSIC,
    stem: 'What was the significance of Nina Kraus\'s research findings?',
    options_json: {
      A: 'She proved that musicians have better visual memory than non-musicians.',
      B: 'She showed that the auditory brainstem—previously considered a simple relay—is enhanced by musical training.',
      C: 'She demonstrated that music therapy cures Parkinson\'s disease.',
      D: 'She found that dopamine release is triggered only by classical music.',
    },
    correct_index: 'B',
    explanation: 'Kraus\'s key finding was that the auditory brainstem (a subcortical structure, not cortical) shows enhanced responses in musicians, challenging the assumption that higher cognitive gains from music are strictly cortical.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 3,
    context: CTX_MUSIC,
    stem: 'Oliver Sacks\'s observations about amnesiac patients who could learn new songs suggest that:',
    options_json: {
      A: 'Music therapy can fully restore episodic memory in amnesiac patients.',
      B: 'Musical memory is stored through different neural pathways than autobiographical memory.',
      C: 'Patients with amnesia are incapable of forming any new long-term memories.',
      D: 'The hippocampus is not involved in any form of musical processing.',
    },
    correct_index: 'B',
    explanation: 'The fact that amnesiac patients (unable to form new episodic memories) could still learn new songs indicates that musical memory relies on different neural circuits than episodic memory.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 3,
    context: CTX_MUSIC,
    stem: 'The word "frissons" in the last paragraph refers to:',
    options_json: {
      A: 'A type of musical composition that triggers emotional memories.',
      B: 'The physical chills or tingles some people experience in response to music.',
      C: 'A neurological condition caused by excessive dopamine release.',
      D: 'A measure of brain activity during musical listening.',
    },
    correct_index: 'B',
    explanation: 'The passage explicitly equates "frissons" with musical "chills" in parentheses, describing the physical sensation some people experience when music moves them deeply.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 2,
    context: CTX_MUSIC,
    stem: 'According to the passage, dopamine is associated with all of the following EXCEPT:',
    options_json: {
      A: 'The pleasure derived from food.',
      B: 'Musical chills (frissons).',
      C: 'Social interaction.',
      D: 'The growth of the corpus callosum.',
    },
    correct_index: 'D',
    explanation: 'The passage associates dopamine with pleasure from food, social interaction, and musical chills. The enlarged corpus callosum is associated with musical training, not dopamine.',
    icfes_competency: 'Recuperación de información',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 3,
    context: CTX_MUSIC,
    stem: 'The phrase "the brain\'s predictive mechanisms" (final paragraph) most likely refers to:',
    options_json: {
      A: 'The brain\'s ability to compose original music.',
      B: 'The way the brain anticipates upcoming musical patterns, generating a reward response before they occur.',
      C: 'A cognitive test used to measure musical aptitude.',
      D: 'The brain\'s capacity to predict future neurological disorders.',
    },
    correct_index: 'B',
    explanation: 'The passage notes that merely anticipating a favorite passage can produce dopamine release, suggesting the brain generates a reward signal based on its prediction of what sound is coming next.',
    icfes_competency: 'Interpretación textual',
  },

  // ── Grammar: Tenses & Aspect (8 questions) ─────────────────────────────────
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: 'Which sentence uses the present perfect progressive correctly?',
    options_json: {
      A: 'She has been working on the project since Monday.',
      B: 'She has been worked on the project since Monday.',
      C: 'She is being worked on the project since Monday.',
      D: 'She was working on the project since Monday.',
    },
    correct_index: 'A',
    explanation: 'Present perfect progressive: have/has + been + -ing verb. It emphasizes an ongoing activity that started in the past and continues into the present ("since Monday").',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"By next June, she ______ at this company for ten years." Choose the correct tense.',
    options_json: {
      A: 'will work',
      B: 'will be working',
      C: 'will have been working',
      D: 'has been working',
    },
    correct_index: 'C',
    explanation: 'The future perfect progressive (will have been + -ing) emphasizes the duration of an activity up to a future point ("by next June"). It answers "how long will she have been doing it?"',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 3,
    stem: 'Choose the sentence where the past simple and past perfect are used CORRECTLY to show sequence.',
    options_json: {
      A: 'When she arrived, everyone already left.',
      B: 'When she arrived, everyone had already left.',
      C: 'When she had arrived, everyone already left.',
      D: 'When she was arriving, everyone had already left.',
    },
    correct_index: 'B',
    explanation: 'The past perfect (had + past participle) is used for the action that happened first (everyone left first), while the past simple is used for the action that came second (she arrived). Option B correctly sequences the two events.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"I ______ the report yet. I\'ll send it this afternoon." Choose the correct option.',
    options_json: {
      A: 'didn\'t finish',
      B: 'haven\'t finished',
      C: 'hadn\'t finished',
      D: 'won\'t finish',
    },
    correct_index: 'B',
    explanation: '"Yet" with a present time perspective requires the present perfect. "Haven\'t finished yet" means the action is incomplete up to now. Past simple (didn\'t finish) would need a specific past time reference.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 3,
    stem: 'Which sentence uses a stative verb incorrectly in the progressive form?',
    options_json: {
      A: 'She is running in the park.',
      B: 'They are building a new highway.',
      C: 'He is knowing the answer.',
      D: 'We are planning a surprise party.',
    },
    correct_index: 'C',
    explanation: '"Know" is a stative verb expressing a mental state. Stative verbs (know, believe, love, own, seem) are not normally used in progressive tenses. The correct form is "He knows the answer."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"While I ______ dinner, the phone rang." Choose the correct form.',
    options_json: {
      A: 'cooked',
      B: 'was cooking',
      C: 'have cooked',
      D: 'had cooked',
    },
    correct_index: 'B',
    explanation: 'The past progressive (was/were + -ing) describes an ongoing background action that was interrupted by a shorter past simple action. "While I was cooking" sets the scene; "the phone rang" is the interrupting event.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 3,
    stem: 'Select the correct use of the causative "have" structure:',
    options_json: {
      A: 'She had her car repaired at the garage.',
      B: 'She had her car to repair at the garage.',
      C: 'She had repaired her car at the garage.',
      D: 'She had her car repairing at the garage.',
    },
    correct_index: 'A',
    explanation: 'The causative structure is: have + object + past participle. "She had her car repaired" means she arranged for someone else to repair it. Option C means she herself repaired it (past perfect active).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"The concert ______ tomorrow evening." Which option expresses a scheduled future event most naturally?',
    options_json: {
      A: 'will begin',
      B: 'begins',
      C: 'is going to begin',
      D: 'would begin',
    },
    correct_index: 'B',
    explanation: 'The present simple is used for fixed, timetabled future events (concerts, flights, classes). "Begins" implies it is on the schedule. "Will" is used for spontaneous decisions or predictions; "going to" for personal plans.',
    icfes_competency: 'Uso del inglés',
  },

  // ── Vocabulary: Collocations & Fixed Expressions (8 questions) ─────────────
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"She made a ______ decision to leave her job." (sudden and unplanned)',
    options_json: { A: 'snap', B: 'swift', C: 'steady', D: 'sober' },
    correct_index: 'A',
    explanation: '"A snap decision" is a fixed collocation meaning a sudden, impulsive decision made without much deliberation. "Swift" means fast but does not imply impulsiveness.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"The new policy will ______ effect from January 1st."',
    options_json: { A: 'make', B: 'take', C: 'bring', D: 'give' },
    correct_index: 'B',
    explanation: '"Take effect" is the fixed collocation for when a law, rule, or policy begins to apply. "Come into effect" is also correct, but "take effect" is the standard form when used with a time marker.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 3,
    stem: '"The charity relies on ______ donations from individual supporters." (made freely, without obligation)',
    options_json: { A: 'compulsory', B: 'mandatory', C: 'voluntary', D: 'obligatory' },
    correct_index: 'C',
    explanation: '"Voluntary" means done or given of one\'s own free will, without being required to. It correctly collocates with "donations" in a charitable context. All other options mean required or compulsory.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"After years of negotiations, the two parties finally reached a ______ agreement."',
    options_json: { A: 'groundbreaking', B: 'landmark', C: 'monumental', D: 'Both A and B are correct.' },
    correct_index: 'D',
    explanation: 'Both "groundbreaking agreement" and "landmark agreement" are common, fixed collocations in formal English to describe a significant, historically notable agreement. "Monumental" can also work but is less common in this collocation.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 3,
    stem: '"The scientist\'s theory was ______ by subsequent experiments that contradicted its core predictions." (proven wrong)',
    options_json: { A: 'validated', B: 'refuted', C: 'corroborated', D: 'substantiated' },
    correct_index: 'B',
    explanation: '"Refuted" means to prove a theory or argument to be wrong. "Validated," "corroborated," and "substantiated" all mean to confirm or support a theory—the opposite meaning.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"He spoke with such ______ confidence that everyone in the room believed him despite the lack of evidence."',
    options_json: { A: 'unwarranted', B: 'warranted', C: 'tentative', D: 'modest' },
    correct_index: 'A',
    explanation: '"Unwarranted" means not justified or authorized by the facts. "Unwarranted confidence" is a natural collocation meaning confidence that is not backed up by evidence or merit.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 3,
    stem: '"The judge\'s ruling set a legal ______ that would be cited in future cases for decades."',
    options_json: { A: 'precedent', B: 'president', C: 'procedure', D: 'premise' },
    correct_index: 'A',
    explanation: '"Set a precedent" is a fixed legal collocation meaning to establish an example or principle that will be followed in future similar cases. "Precedent" (not "president") is the correct word.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"The new research ______ earlier assumptions about the health benefits of moderate alcohol consumption."',
    options_json: { A: 'undermines', B: 'upholds', C: 'reaffirms', D: 'corroborates' },
    correct_index: 'A',
    explanation: '"Undermine" means to weaken or damage the foundation of something. If new research contradicts earlier assumptions, it undermines them. The other options mean to support or confirm.',
    icfes_competency: 'Interpretación textual',
  },

  // ── Use of English: Coherence & Error Recognition (9 questions) ─────────────
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: 'Identify the sentence with a subject-verb agreement error:',
    options_json: {
      A: 'The team has decided to postpone the meeting.',
      B: 'Neither the director nor the staff members was available.',
      C: 'Each of the students is responsible for their own work.',
      D: 'The number of applications has increased this year.',
    },
    correct_index: 'B',
    explanation: 'With "neither...nor," the verb agrees with the nearer subject. "The staff members" (plural) is closer to the verb, so it should be "were available," not "was available."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 3,
    stem: '"The book ______ she recommended was not available at the library, ______ annoyed her."',
    options_json: {
      A: 'that / which',
      B: 'which / that',
      C: 'that / that',
      D: 'which / which',
    },
    correct_index: 'A',
    explanation: 'The first gap needs a defining relative clause (she specifically recommended this book), so "that" is preferred. The second refers to the entire situation (the book was unavailable), requiring "which" in a non-defining relative clause.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: 'Which option correctly rewrites: "Although he was nervous, he delivered the speech perfectly" using a participle clause?',
    options_json: {
      A: 'Being nervous, he delivered the speech perfectly.',
      B: 'Despite nervous, he delivered the speech perfectly.',
      C: 'Nervously, he delivered the speech perfectly.',
      D: 'Having been nervous, he delivered the speech perfectly.',
    },
    correct_index: 'A',
    explanation: '"Being nervous" is a concessive participial clause meaning "although he was nervous." The participle subject matches the main clause subject (he), making this a well-formed participle construction.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 3,
    stem: 'Select the option that correctly completes the sentence using a gerund or infinitive: "I regret ______ you that your application has been unsuccessful."',
    options_json: {
      A: 'to inform',
      B: 'informing',
      C: 'to have informed',
      D: 'having informed',
    },
    correct_index: 'A',
    explanation: '"Regret + to-infinitive" is used for present or future actions (regret to inform = I\'m sorry to tell you now). "Regret + gerund" refers to past actions (regret informing = I\'m sorry I told you). In a formal notification, "regret to inform" is correct.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: '"I can\'t help ______ when I watch sad movies." (laugh involuntarily)',
    options_json: { A: 'to cry', B: 'crying', C: 'to have cried', D: 'cry' },
    correct_index: 'B',
    explanation: '"Can\'t help" is always followed by a gerund (-ing form). The expression means to be unable to stop oneself from doing something: "I can\'t help crying."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 3,
    stem: 'Choose the sentence with a CORRECT use of articles:',
    options_json: {
      A: 'She plays the piano beautifully; she started a piano at age five.',
      B: 'He is the best student in a class.',
      C: 'They visited the Eiffel Tower and had a wonderful lunch nearby.',
      D: 'I need an advice from an expert before making a decision.',
    },
    correct_index: 'C',
    explanation: 'Option C is correct: "the Eiffel Tower" (unique landmark takes "the") and "a wonderful lunch" (indefinite, first mention). Option D is wrong because "advice" is uncountable—"an advice" is incorrect; it should be "some advice" or "a piece of advice."',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: '"She suggested ______ the meeting until everyone could attend."',
    options_json: { A: 'to postpone', B: 'postponing', C: 'postponed', D: 'to be postponing' },
    correct_index: 'B',
    explanation: '"Suggest" is followed by a gerund (-ing) or a that-clause, never a to-infinitive directly. "Suggested postponing" is the correct form.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 3,
    stem: 'Which sentence correctly uses a double negative for EMPHASIS (not an error)?',
    options_json: {
      A: 'I don\'t know nothing about the problem.',
      B: 'She isn\'t going nowhere tonight.',
      C: '"I cannot say I was not warned." (formal/literary register)',
      D: 'He never did nothing wrong.',
    },
    correct_index: 'C',
    explanation: 'In standard English, double negatives (A, B, D) are grammatically incorrect. However, in formal or literary English, "cannot say... not" creates a double negative that functions as an understatement or litotes (affirmative by negating the negative), which is acceptable and intentional.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: '"______ the heavy rain, the outdoor concert was not cancelled."',
    options_json: { A: 'Despite of', B: 'Although', C: 'In spite of', D: 'Even though' },
    correct_index: 'C',
    explanation: '"In spite of" and "despite" (without "of") are prepositions followed by a noun phrase. "Despite of" is incorrect. "Although" and "even though" are conjunctions that require a full clause, not just "the heavy rain."',
    icfes_competency: 'Uso del inglés',
  },
]

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
  console.log(`Insertando ${rows.length} preguntas de Inglés (lote 14)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'ingles')
  console.log(`Listo. Total ingles en BD: ${count}`)
}

seed()
