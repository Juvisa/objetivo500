import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const questions = [
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"The employees ______ a pay raise if the company meets its targets this year."',
    options_json: {
      A: 'will receive',
      B: 'would receive',
      C: 'would have received',
      D: 'receive',
    },
    correct_index: 'A',
    explanation: 'This is a first conditional (real future condition): if + present simple → will + base verb. The condition is possible and realistic.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 3,
    stem: 'Choose the sentence with correct use of "used to," "be used to," and "get used to":',
    options_json: {
      A: 'She used to live in Paris, and she is still used to the cold weather there.',
      B: 'He gets used to wake up early when he was a student.',
      C: 'They used to take the bus, but now they are used to driving.',
      D: 'I am used to lived alone before I got married.',
    },
    correct_index: 'C',
    explanation: '"Used to + base verb" describes a past habit that no longer exists. "Be used to + gerund/noun" means to be accustomed to something. Option C uses both correctly: "used to take" (past habit) + "are used to driving" (present accustomed to).',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 2,
    stem: '"The government\'s new initiative aims to ______ youth unemployment by creating 50,000 apprenticeships." (reduce/deal with)',
    options_json: { A: 'aggravate', B: 'tackle', C: 'ignore', D: 'escalate' },
    correct_index: 'B',
    explanation: '"Tackle" means to deal with or address a problem, especially one that is difficult. "Aggravate" and "escalate" mean to make worse; "ignore" means to pay no attention.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 3,
    stem: '"Not until the experiment was repeated three times ______ the results accepted by the scientific community."',
    options_json: {
      A: 'were',
      B: 'the results were',
      C: 'did',
      D: 'have',
    },
    correct_index: 'A',
    explanation: '"Not until..." at the start of a sentence triggers inversion: "Not until X were the results accepted." The auxiliary "were" precedes the subject "the results." This is a formal emphatic inversion.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 2,
    stem: 'A text states: "The rise of e-commerce has fundamentally disrupted brick-and-mortar retail, forcing traditional stores to reinvent themselves or face closure." The phrase "brick-and-mortar" refers to:',
    options_json: {
      A: 'Online shopping platforms and digital marketplaces.',
      B: 'Physical, traditional stores with a real-world presence.',
      C: 'Wholesale distribution centers and warehouses.',
      D: 'Luxury retail brands with premium pricing.',
    },
    correct_index: 'B',
    explanation: '"Brick-and-mortar" is an idiomatic expression for physical shops and stores (as opposed to online/digital businesses), evoking the building materials of traditional storefronts.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 2,
    stem: '"______ he is the CEO, he still answers his own emails." Best connector:',
    options_json: { A: 'Because', B: 'Even though', C: 'Therefore', D: 'Since' },
    correct_index: 'B',
    explanation: '"Even though" introduces a concessive clause, expressing contrast: despite his position (CEO), he still does something unusual (answers his own emails). "Because" and "since" express reason, not contrast.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Vocabulary in Context', difficulty: 3,
    stem: '"Her argument was so ______ that it convinced even the most skeptical members of the panel." (logically strong and well-reasoned)',
    options_json: { A: 'eloquent', B: 'compelling', C: 'verbose', D: 'ambiguous' },
    correct_index: 'B',
    explanation: '"Compelling" means powerfully persuasive or convincing. "Eloquent" refers to expressive language but not necessarily logical force. "Verbose" means using too many words; "ambiguous" means unclear.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Use of English', difficulty: 2,
    stem: 'Which sentence uses the passive voice correctly to emphasize the action rather than the agent?',
    options_json: {
      A: 'Someone stole my bicycle last night.',
      B: 'My bicycle was stolen last night.',
      C: 'My bicycle has steal last night.',
      D: 'Last night my bicycle stealing happened.',
    },
    correct_index: 'B',
    explanation: 'The passive voice (was stolen) shifts focus to the object of the action (my bicycle) and the action itself, de-emphasizing the agent. This is appropriate when the agent is unknown or unimportant.',
    icfes_competency: 'Uso del inglés',
  },
  {
    subject: 'ingles', topic: 'Reading Comprehension', difficulty: 3,
    stem: 'A paragraph reads: "While proponents of social media argue it fosters global connection, critics contend that its net effect is social fragmentation—people increasingly communicate within algorithmically curated echo chambers that reinforce existing beliefs rather than challenging them." The word "contend" most nearly means:',
    options_json: { A: 'agree', B: 'argue', C: 'ignore', D: 'deny' },
    correct_index: 'B',
    explanation: '"Contend" means to argue or assert a position, especially in opposition to another view. Here critics are making their opposing argument against the proponents.',
    icfes_competency: 'Interpretación textual',
  },
  {
    subject: 'ingles', topic: 'Grammar', difficulty: 3,
    stem: '"It\'s high time the government ______ action on climate change." Choose the correct form.',
    options_json: { A: 'takes', B: 'took', C: 'has taken', D: 'will take' },
    correct_index: 'B',
    explanation: '"It\'s high time + past simple" is a fixed construction used to say that something should happen now (or should have happened already). It uses the past simple subjunctively: "It\'s high time they took action."',
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
  console.log(`Insertando ${rows.length} preguntas de Inglés (lote 16)…`)
  const { error } = await supabase.from('questions').insert(rows)
  if (error) { console.error('Error:', error.message); process.exit(1) }
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'ingles')
  console.log(`Listo. Total ingles en BD: ${count}`)
}

seed()
