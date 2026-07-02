import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Button, Chip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Divider, LinearProgress, Alert, CircularProgress,
} from '@mui/material'
import AddRoundedIcon          from '@mui/icons-material/AddRounded'
import SearchRoundedIcon       from '@mui/icons-material/SearchRounded'
import TableSortLabel          from '@mui/material/TableSortLabel'
import EditRoundedIcon         from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon   from '@mui/icons-material/VisibilityRounded'
import AssignmentRoundedIcon   from '@mui/icons-material/AssignmentRounded'
import AutoAwesomeRoundedIcon  from '@mui/icons-material/AutoAwesomeRounded'
import DeleteRoundedIcon       from '@mui/icons-material/DeleteRounded'
import LockRoundedIcon          from '@mui/icons-material/LockRounded'
import { quizzesApi, subjectsApi, classesApi } from '../../services/apiCatalog'
import QuestionEditor, { emptyQuestion, QUESTION_TYPES } from './QuestionEditor'

const difficultyColors = { easy: 'success', medium: 'warning', hard: 'error' }

/* ─── Simulated GenAI question bank (15+ per category for variety) ──────── */
const AI_BANK = {
  Math: {
    easy: [
      { text: 'What is 6 × 7?', options: ['40', '42', '45', '48'], correctAnswer: '42', explanation: '6 × 7 = 42', points: 10 },
      { text: 'What is 15 + 28?', options: ['41', '43', '42', '40'], correctAnswer: '43', explanation: '15 + 28 = 43', points: 10 },
      { text: 'What is half of 80?', options: ['30', '40', '45', '35'], correctAnswer: '40', explanation: 'Half of 80 is 80 ÷ 2 = 40', points: 10 },
      { text: 'Which number is even?', options: ['13', '27', '34', '51'], correctAnswer: '34', explanation: '34 is divisible by 2', points: 10 },
      { text: 'What is 100 − 37?', options: ['63', '67', '73', '57'], correctAnswer: '63', explanation: '100 − 37 = 63', points: 10 },
      { text: 'What is 9 × 8?', options: ['63', '72', '81', '56'], correctAnswer: '72', explanation: '9 × 8 = 72', points: 10 },
      { text: 'What is 3/4 of 40?', options: ['25', '30', '35', '20'], correctAnswer: '30', explanation: '3/4 × 40 = 30', points: 10 },
      { text: 'Which is the smallest number?', options: ['0.5', '0.05', '0.55', '0.005'], correctAnswer: '0.005', explanation: '0.005 has the smallest value', points: 10 },
      { text: 'What is 144 ÷ 12?', options: ['10', '11', '12', '13'], correctAnswer: '12', explanation: '144 ÷ 12 = 12', points: 10 },
      { text: 'What comes after 99?', options: ['100', '90', '109', '910'], correctAnswer: '100', explanation: '99 + 1 = 100', points: 10 },
      { text: 'Sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: '180°', explanation: 'All triangle angles add up to 180°', points: 10 },
      { text: 'What is 7²?', options: ['14', '21', '49', '42'], correctAnswer: '49', explanation: '7 × 7 = 49', points: 10 },
      { text: 'How many cm in a metre?', options: ['10', '100', '1000', '10000'], correctAnswer: '100', explanation: '1 m = 100 cm', points: 10 },
      { text: 'What is 50% of 90?', options: ['40', '45', '50', '55'], correctAnswer: '45', explanation: '50% of 90 = 45', points: 10 },
      { text: 'Round 347 to the nearest hundred?', options: ['300', '350', '400', '340'], correctAnswer: '300', explanation: '347 is closer to 300 than 400', points: 10 },
    ],
    medium: [
      { text: 'What is 12 × 12?', options: ['124', '144', '132', '148'], correctAnswer: '144', explanation: '12 × 12 = 144', points: 15 },
      { text: 'What is 25% of 200?', options: ['40', '50', '60', '45'], correctAnswer: '50', explanation: '25% × 200 = 50', points: 15 },
      { text: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctAnswer: '6', explanation: 'A hexagon has 6 sides', points: 15 },
      { text: 'What is the square root of 81?', options: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '9 × 9 = 81', points: 15 },
      { text: 'Solve: 3x = 24, x = ?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '3 × 8 = 24', points: 15 },
      { text: 'What is 2/5 + 1/5?', options: ['3/10', '3/5', '3/25', '1/5'], correctAnswer: '3/5', explanation: 'Same denominator: 2/5 + 1/5 = 3/5', points: 15 },
      { text: 'Perimeter of a square with side 9 cm?', options: ['18 cm', '27 cm', '36 cm', '81 cm'], correctAnswer: '36 cm', explanation: '4 × 9 = 36 cm', points: 15 },
      { text: 'What is the value of π (pi) approximately?', options: ['3.14', '3.41', '2.14', '3.12'], correctAnswer: '3.14', explanation: 'π ≈ 3.14159…', points: 15 },
      { text: 'What is 8³?', options: ['24', '64', '512', '256'], correctAnswer: '512', explanation: '8 × 8 × 8 = 512', points: 15 },
      { text: 'If a = 5, what is 4a − 3?', options: ['17', '20', '22', '15'], correctAnswer: '17', explanation: '4 × 5 − 3 = 20 − 3 = 17', points: 15 },
      { text: 'What is the HCF of 12 and 18?', options: ['3', '6', '9', '12'], correctAnswer: '6', explanation: 'Factors of 12: 1,2,3,4,6,12; 18: 1,2,3,6,9,18 → HCF = 6', points: 15 },
      { text: 'A train travels 60 km in 1 hour. Speed in m/s?', options: ['16.67', '60', '36', '100'], correctAnswer: '16.67', explanation: '60 km/h = 60000/3600 ≈ 16.67 m/s', points: 15 },
      { text: 'What is 3.5 × 4?', options: ['12', '14', '16', '10'], correctAnswer: '14', explanation: '3.5 × 4 = 14', points: 15 },
      { text: 'Simplify: 24/36', options: ['3/4', '2/3', '4/5', '1/2'], correctAnswer: '2/3', explanation: '24 ÷ 12 = 2, 36 ÷ 12 = 3', points: 15 },
      { text: 'Area of a circle with radius 7 cm (π = 22/7)?', options: ['44 cm²', '154 cm²', '49 cm²', '22 cm²'], correctAnswer: '154 cm²', explanation: 'πr² = 22/7 × 49 = 154 cm²', points: 15 },
    ],
    hard: [
      { text: 'What is the LCM of 12 and 18?', options: ['24', '36', '48', '72'], correctAnswer: '36', explanation: 'LCM(12,18) = 36', points: 20 },
      { text: 'If 2x + 5 = 21, what is x?', options: ['7', '8', '9', '6'], correctAnswer: '8', explanation: '2x = 16, x = 8', points: 20 },
      { text: 'What fraction of 60 is 15?', options: ['1/3', '1/4', '1/5', '1/6'], correctAnswer: '1/4', explanation: '15/60 = 1/4', points: 20 },
      { text: 'Area of rectangle 8cm × 6cm?', options: ['28 cm²', '48 cm²', '42 cm²', '56 cm²'], correctAnswer: '48 cm²', explanation: '8 × 6 = 48 cm²', points: 20 },
      { text: 'What is 2³ + 3²?', options: ['15', '17', '13', '19'], correctAnswer: '17', explanation: '8 + 9 = 17', points: 20 },
      { text: 'Solve: x² = 144', options: ['10', '12', '14', '11'], correctAnswer: '12', explanation: '√144 = 12', points: 20 },
      { text: 'A sum doubles in 5 years at simple interest. Rate = ?', options: ['10%', '20%', '15%', '25%'], correctAnswer: '20%', explanation: 'SI = P → P×r×5/100 = P → r = 20%', points: 20 },
      { text: 'What is the probability of rolling a 6 on a fair die?', options: ['1/4', '1/5', '1/6', '1/3'], correctAnswer: '1/6', explanation: 'One outcome out of 6 possible', points: 20 },
      { text: 'If angles of a quadrilateral are in ratio 1:2:3:4, smallest angle = ?', options: ['30°', '36°', '40°', '45°'], correctAnswer: '36°', explanation: '1x+2x+3x+4x=360 → x=36', points: 20 },
      { text: 'Volume of cube with side 5 cm?', options: ['25 cm³', '75 cm³', '100 cm³', '125 cm³'], correctAnswer: '125 cm³', explanation: '5³ = 125 cm³', points: 20 },
      { text: 'Mean of 4, 8, 12, 16, 20?', options: ['10', '12', '14', '16'], correctAnswer: '12', explanation: '(4+8+12+16+20)/5 = 60/5 = 12', points: 20 },
      { text: 'What is 15% of 640?', options: ['80', '96', '104', '120'], correctAnswer: '96', explanation: '640 × 15/100 = 96', points: 20 },
      { text: 'Factorise: x² − 9', options: ['(x−3)(x+3)', '(x−9)(x+1)', '(x+3)²', '(x−3)²'], correctAnswer: '(x−3)(x+3)', explanation: 'Difference of squares: a²−b² = (a−b)(a+b)', points: 20 },
      { text: 'Two trains 300 km apart approach each other at 60 and 90 km/h. Meet in?', options: ['2 h', '3 h', '2.5 h', '4 h'], correctAnswer: '2 h', explanation: 'Combined speed = 150 km/h; 300/150 = 2 h', points: 20 },
      { text: 'If 5 workers build a wall in 12 days, 4 workers take?', options: ['10 days', '12 days', '15 days', '16 days'], correctAnswer: '15 days', explanation: '5×12 = 4×d → d = 15', points: 20 },
    ],
  },
  English: {
    easy: [
      { text: 'Which word is a noun?', options: ['Run', 'Happy', 'Book', 'Quickly'], correctAnswer: 'Book', explanation: 'A noun is a person, place, or thing', points: 10 },
      { text: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctAnswer: 'Children', explanation: 'Irregular plural: child → children', points: 10 },
      { text: 'Which is a vowel?', options: ['B', 'C', 'E', 'T'], correctAnswer: 'E', explanation: 'Vowels: A, E, I, O, U', points: 10 },
      { text: 'Opposite of "happy" is?', options: ['Sad', 'Angry', 'Tired', 'Bored'], correctAnswer: 'Sad', explanation: 'Happy and sad are antonyms', points: 10 },
      { text: 'Which sentence is correct?', options: ['She go home', 'She goes home', 'She going home', 'She gone home'], correctAnswer: 'She goes home', explanation: 'Third person singular uses goes', points: 10 },
      { text: 'How many letters are in the English alphabet?', options: ['24', '25', '26', '27'], correctAnswer: '26', explanation: 'The English alphabet has 26 letters', points: 10 },
      { text: 'What is the past tense of "go"?', options: ['Goed', 'Went', 'Gone', 'Going'], correctAnswer: 'Went', explanation: 'Irregular verb: go → went', points: 10 },
      { text: 'Choose the correct spelling:', options: ['Beutiful', 'Beautiful', 'Beautifull', 'Beutifull'], correctAnswer: 'Beautiful', explanation: 'B-E-A-U-T-I-F-U-L', points: 10 },
      { text: 'A cat has ___ legs.', options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 'Four', explanation: 'All cats have four legs', points: 10 },
      { text: 'Which word is a verb?', options: ['Chair', 'Blue', 'Jump', 'Tall'], correctAnswer: 'Jump', explanation: 'A verb is an action word', points: 10 },
      { text: 'Opposite of "big" is?', options: ['Large', 'Tiny', 'Huge', 'Tall'], correctAnswer: 'Tiny', explanation: 'Tiny is the antonym of big', points: 10 },
      { text: 'The sun rises in the ___?', options: ['West', 'North', 'East', 'South'], correctAnswer: 'East', explanation: 'The sun always rises in the east', points: 10 },
      { text: 'Which animal says "Moo"?', options: ['Dog', 'Cow', 'Cat', 'Horse'], correctAnswer: 'Cow', explanation: 'Cows make a mooing sound', points: 10 },
      { text: '"She ___ her homework." Correct option:', options: ['do', 'does', 'done', 'doing'], correctAnswer: 'does', explanation: 'Third person singular present: does', points: 10 },
      { text: 'Which punctuation ends a question?', options: ['.', '!', '?', ','], correctAnswer: '?', explanation: 'Questions end with a question mark', points: 10 },
    ],
    medium: [
      { text: 'What is a synonym for "brave"?', options: ['Cowardly', 'Courageous', 'Cautious', 'Careless'], correctAnswer: 'Courageous', explanation: 'Brave and courageous have the same meaning', points: 15 },
      { text: 'Identify the adjective: "The tall girl ran fast."', options: ['girl', 'ran', 'tall', 'fast'], correctAnswer: 'tall', explanation: 'Tall describes the noun "girl"', points: 15 },
      { text: 'Which is correct punctuation?', options: ['Its raining.', "It's raining.", "Its' raining.", "Its raining!"], correctAnswer: "It's raining.", explanation: "It's = it is (contraction)", points: 15 },
      { text: 'What tense is "She was singing"?', options: ['Present', 'Future', 'Past Continuous', 'Past Simple'], correctAnswer: 'Past Continuous', explanation: 'Was + verb-ing = past continuous', points: 15 },
      { text: 'Choose the correct article: "___ honest man."', options: ['A', 'An', 'The', 'No article'], correctAnswer: 'An', explanation: '"An" before words starting with vowel sounds', points: 15 },
      { text: 'A word opposite in meaning is called an?', options: ['Synonym', 'Antonym', 'Homonym', 'Acronym'], correctAnswer: 'Antonym', explanation: 'Antonyms are words with opposite meanings', points: 15 },
      { text: 'Which is an adverb?', options: ['Quickly', 'Quick', 'Quicker', 'Quickest'], correctAnswer: 'Quickly', explanation: 'Adverbs often end in -ly and modify verbs', points: 15 },
      { text: 'Change to reported speech: He said, "I am tired."', options: ['He said he was tired.', 'He said he is tired.', 'He told am tired.', 'He said I was tired.'], correctAnswer: 'He said he was tired.', explanation: 'Direct to indirect: present → past', points: 15 },
      { text: 'Correct plural of "ox"?', options: ['Oxes', 'Oxen', 'Ox', 'Oxs'], correctAnswer: 'Oxen', explanation: 'Irregular plural: ox → oxen', points: 15 },
      { text: '"Neither he ___ she was present."', options: ['or', 'nor', 'and', 'but'], correctAnswer: 'nor', explanation: '"Neither…nor" is the correct correlative conjunction pair', points: 15 },
      { text: 'What does the prefix "un-" mean?', options: ['Again', 'Before', 'Not', 'After'], correctAnswer: 'Not', explanation: '"Un-" negates the word, e.g. unhappy = not happy', points: 15 },
      { text: 'Identify the preposition: "The book is on the table."', options: ['book', 'is', 'on', 'table'], correctAnswer: 'on', explanation: '"On" shows position — it is a preposition', points: 15 },
      { text: 'Future tense of "eat" is?', options: ['Ate', 'Eaten', 'Will eat', 'Eating'], correctAnswer: 'Will eat', explanation: 'Future simple: will + base verb', points: 15 },
      { text: 'Which word is a conjunction?', options: ['Quickly', 'Because', 'Beautiful', 'Chair'], correctAnswer: 'Because', explanation: 'Conjunctions join clauses, e.g. because', points: 15 },
      { text: '"The child cried ___ it was hurt." (correct option)', options: ['so', 'because', 'although', 'unless'], correctAnswer: 'because', explanation: '"Because" introduces the reason', points: 15 },
    ],
    hard: [
      { text: 'What figure of speech is "The thunder roared"?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correctAnswer: 'Personification', explanation: 'Thunder is given a human action (roaring)', points: 20 },
      { text: 'Passive voice: "She wrote the letter" becomes?', options: ['The letter wrote she.', 'The letter was written by her.', 'She had written the letter.', 'The letter is written.'], correctAnswer: 'The letter was written by her.', explanation: 'Active to passive: object + was + past participle + by + subject', points: 20 },
      { text: 'Identify the clause: "Although it was raining, we played."', options: ['Independent', 'Dependent', 'Relative', 'Noun'], correctAnswer: 'Dependent', explanation: '"Although it was raining" cannot stand alone', points: 20 },
      { text: 'Which is a compound sentence?', options: ['She sings.', 'She sings and dances.', 'Because she sings.', 'She who sings.'], correctAnswer: 'She sings and dances.', explanation: 'Two independent clauses joined by "and"', points: 20 },
      { text: 'Correct spelling?', options: ['Accomodation', 'Accommodation', 'Accomadation', 'Acomodation'], correctAnswer: 'Accommodation', explanation: 'Double c, double m: accommodation', points: 20 },
      { text: 'What is an oxymoron?', options: ['Repetition of sounds', 'Contradiction in terms', 'Exaggeration for effect', 'A comparison using like/as'], correctAnswer: 'Contradiction in terms', explanation: 'e.g. "deafening silence" — contradictory words together', points: 20 },
      { text: 'Subjunctive mood: "If I ___ you, I would apologise."', options: ['am', 'was', 'were', 'be'], correctAnswer: 'were', explanation: 'Subjunctive uses "were" for unreal/hypothetical conditions', points: 20 },
      { text: 'Which rhetorical device: "Peter Piper picked a peck of pickled peppers"?', options: ['Assonance', 'Alliteration', 'Onomatopoeia', 'Irony'], correctAnswer: 'Alliteration', explanation: 'Repetition of the "p" consonant sound', points: 20 },
      { text: 'A Bildungsroman is a novel about?', options: ['War', 'Coming of age', 'Mystery', 'Utopia'], correctAnswer: 'Coming of age', explanation: 'Bildungsroman focuses on moral/psychological growth', points: 20 },
      { text: '"The pen is mightier than the sword" is an example of?', options: ['Simile', 'Metaphor', 'Hyperbole', 'Litotes'], correctAnswer: 'Metaphor', explanation: 'A direct comparison without "like" or "as"', points: 20 },
      { text: 'Identify: "I have been studying for three hours."', options: ['Present Perfect', 'Past Perfect', 'Present Perfect Continuous', 'Past Continuous'], correctAnswer: 'Present Perfect Continuous', explanation: 'Have/has + been + verb-ing = present perfect continuous', points: 20 },
      { text: 'What is the tone of a piece of writing?', options: ['The main idea', 'The author\'s attitude', 'The narrative structure', 'The dialogue'], correctAnswer: 'The author\'s attitude', explanation: 'Tone reflects the author\'s feelings or attitude toward the subject', points: 20 },
      { text: '"Larger than life" is an example of?', options: ['Simile', 'Irony', 'Hyperbole', 'Allusion'], correctAnswer: 'Hyperbole', explanation: 'An exaggeration used for emphasis', points: 20 },
      { text: 'Which sentence uses the Oxford comma correctly?', options: ['I bought apples oranges and bananas.', 'I bought apples, oranges, and bananas.', 'I bought apples, oranges and bananas.', 'I bought, apples, oranges, bananas.'], correctAnswer: 'I bought apples, oranges, and bananas.', explanation: 'The Oxford comma is placed before the final "and"', points: 20 },
      { text: 'Which word best completes: "The detective was ___ in her questioning." (thorough, persistent)', options: ['ambiguous', 'tenacious', 'reticent', 'loquacious'], correctAnswer: 'tenacious', explanation: 'Tenacious = persistent, not giving up', points: 20 },
    ],
  },
  Science: {
    easy: [
      { text: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide', explanation: 'Plants use CO₂ + sunlight to produce food', points: 10 },
      { text: 'What is the boiling point of water?', options: ['50°C', '80°C', '100°C', '120°C'], correctAnswer: '100°C', explanation: 'Water boils at 100°C at standard pressure', points: 10 },
      { text: 'Which organ pumps blood in the human body?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], correctAnswer: 'Heart', explanation: 'The heart pumps blood through the circulatory system', points: 10 },
      { text: 'What force pulls objects toward Earth?', options: ['Magnetism', 'Gravity', 'Friction', 'Tension'], correctAnswer: 'Gravity', explanation: 'Gravity is the force of attraction between masses', points: 10 },
      { text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correctAnswer: 'Mitochondria', explanation: 'Mitochondria produce ATP energy for the cell', points: 10 },
      { text: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctAnswer: '8', explanation: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune', points: 10 },
      { text: 'What do we call animals that eat only plants?', options: ['Carnivore', 'Herbivore', 'Omnivore', 'Insectivore'], correctAnswer: 'Herbivore', explanation: 'Herbivores eat only plant material', points: 10 },
      { text: 'Which sense organ detects light?', options: ['Ear', 'Nose', 'Eye', 'Tongue'], correctAnswer: 'Eye', explanation: 'Eyes contain photoreceptors to detect light', points: 10 },
      { text: 'What is the chemical formula for water?', options: ['CO₂', 'H₂O', 'NaCl', 'O₂'], correctAnswer: 'H₂O', explanation: 'Water is two hydrogen atoms bonded to one oxygen atom', points: 10 },
      { text: 'The sun is a ___?', options: ['Planet', 'Moon', 'Star', 'Comet'], correctAnswer: 'Star', explanation: 'The Sun is a medium-sized star', points: 10 },
      { text: 'What do roots absorb from the soil?', options: ['Sunlight', 'Carbon dioxide', 'Water and minerals', 'Oxygen'], correctAnswer: 'Water and minerals', explanation: 'Roots absorb water and dissolved minerals for the plant', points: 10 },
      { text: 'Which part of the plant makes food?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correctAnswer: 'Leaf', explanation: 'Leaves carry out photosynthesis', points: 10 },
      { text: 'Sound travels fastest through?', options: ['Air', 'Water', 'Vacuum', 'Steel'], correctAnswer: 'Steel', explanation: 'Sound travels faster in denser media; steel is fastest', points: 10 },
      { text: 'What type of energy does food contain?', options: ['Kinetic', 'Nuclear', 'Chemical', 'Electrical'], correctAnswer: 'Chemical', explanation: 'Food stores chemical energy that the body converts to other forms', points: 10 },
      { text: 'Which blood cells fight infection?', options: ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma'], correctAnswer: 'White blood cells', explanation: 'White blood cells are part of the immune system', points: 10 },
    ],
    medium: [
      { text: 'What is Newton\'s Second Law?', options: ['F = ma', 'E = mc²', 'V = IR', 'PV = nRT'], correctAnswer: 'F = ma', explanation: 'Force equals mass times acceleration', points: 15 },
      { text: 'Which part of the cell contains DNA?', options: ['Cell wall', 'Nucleus', 'Cytoplasm', 'Ribosome'], correctAnswer: 'Nucleus', explanation: 'DNA is stored in the nucleus', points: 15 },
      { text: 'What type of rock is formed from lava?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Limestone'], correctAnswer: 'Igneous', explanation: 'Igneous rocks form from cooled magma/lava', points: 15 },
      { text: 'Ohm\'s Law states V = ?', options: ['IR', 'I/R', 'I+R', 'I−R'], correctAnswer: 'IR', explanation: 'Voltage = Current × Resistance', points: 15 },
      { text: 'Photosynthesis produces which gas as a byproduct?', options: ['CO₂', 'N₂', 'O₂', 'H₂'], correctAnswer: 'O₂', explanation: 'Plants release oxygen as a byproduct of photosynthesis', points: 15 },
      { text: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correctAnswer: '6', explanation: 'Carbon has 6 protons (atomic number = proton count)', points: 15 },
      { text: 'Which hormone regulates blood sugar?', options: ['Adrenaline', 'Insulin', 'Estrogen', 'Cortisol'], correctAnswer: 'Insulin', explanation: 'Insulin, produced by the pancreas, lowers blood glucose', points: 15 },
      { text: 'Speed of light in vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: '3×10⁸ m/s', explanation: 'c ≈ 3×10⁸ m/s (300,000 km/s)', points: 15 },
      { text: 'Which organ filters blood in the body?', options: ['Heart', 'Liver', 'Kidney', 'Spleen'], correctAnswer: 'Kidney', explanation: 'Kidneys filter waste from blood to produce urine', points: 15 },
      { text: 'What is the pH of pure water?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'Pure water is neutral with pH = 7', points: 15 },
      { text: 'What layer of the Earth is liquid?', options: ['Crust', 'Mantle', 'Inner core', 'Outer core'], correctAnswer: 'Outer core', explanation: 'The outer core is liquid iron and nickel', points: 15 },
      { text: 'Which gas makes up most of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correctAnswer: 'Nitrogen', explanation: 'Nitrogen makes up ~78% of the atmosphere', points: 15 },
      { text: 'What process converts glucose to energy without oxygen?', options: ['Photosynthesis', 'Aerobic respiration', 'Anaerobic respiration', 'Osmosis'], correctAnswer: 'Anaerobic respiration', explanation: 'Anaerobic respiration produces energy without oxygen', points: 15 },
      { text: 'What is the unit of electric current?', options: ['Volt', 'Watt', 'Ohm', 'Ampere'], correctAnswer: 'Ampere', explanation: 'Current is measured in Amperes (A)', points: 15 },
      { text: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctAnswer: 'Saturn', explanation: 'Saturn has 146 confirmed moons (most in solar system)', points: 15 },
    ],
    hard: [
      { text: 'What is the Heisenberg Uncertainty Principle?', options: ['Energy is conserved', 'Position and momentum cannot both be precisely known', 'Mass and energy are equivalent', 'Like charges repel'], correctAnswer: 'Position and momentum cannot both be precisely known', explanation: 'ΔxΔp ≥ ℏ/2 — increasing precision of position reduces precision of momentum', points: 20 },
      { text: 'What type of bond forms between Na and Cl in NaCl?', options: ['Covalent', 'Metallic', 'Ionic', 'Hydrogen'], correctAnswer: 'Ionic', explanation: 'Na donates an electron to Cl, forming an ionic bond', points: 20 },
      { text: 'CRISPR-Cas9 is a tool for?', options: ['Protein synthesis', 'DNA editing', 'Cell division', 'Nerve signalling'], correctAnswer: 'DNA editing', explanation: 'CRISPR-Cas9 allows precise editing of DNA sequences', points: 20 },
      { text: 'What is entropy a measure of?', options: ['Energy stored', 'Disorder in a system', 'Temperature change', 'Pressure'], correctAnswer: 'Disorder in a system', explanation: 'Entropy (S) measures randomness or disorder in a thermodynamic system', points: 20 },
      { text: 'Mitosis results in how many daughter cells?', options: ['1', '2', '4', '8'], correctAnswer: '2', explanation: 'Mitosis produces 2 genetically identical daughter cells', points: 20 },
      { text: 'What is the half-life concept in radioactivity?', options: ['Time for half the atoms to double', 'Time for half the radioactive atoms to decay', 'Half the energy released', 'Half the original mass'], correctAnswer: 'Time for half the radioactive atoms to decay', explanation: 'Half-life is the time for 50% of a radioactive isotope to decay', points: 20 },
      { text: 'Which subatomic particle determines the element?', options: ['Neutron', 'Electron', 'Proton', 'Positron'], correctAnswer: 'Proton', explanation: 'The number of protons (atomic number) defines the element', points: 20 },
      { text: 'What is Avogadro\'s number?', options: ['6.022×10²³', '6.022×10²²', '3.14×10²³', '1.6×10⁻¹⁹'], correctAnswer: '6.022×10²³', explanation: '6.022×10²³ entities per mole of substance', points: 20 },
      { text: 'Which type of radiation has the highest penetrating power?', options: ['Alpha', 'Beta', 'Gamma', 'X-ray'], correctAnswer: 'Gamma', explanation: 'Gamma rays are electromagnetic and highly penetrating', points: 20 },
      { text: 'What does the Hardy-Weinberg principle describe?', options: ['Genetic drift', 'Natural selection rates', 'Allele frequency equilibrium', 'Mutation rates'], correctAnswer: 'Allele frequency equilibrium', explanation: 'In the absence of evolution, allele frequencies remain constant', points: 20 },
      { text: 'Which organelle is responsible for protein synthesis?', options: ['Golgi body', 'Lysosome', 'Ribosome', 'Vacuole'], correctAnswer: 'Ribosome', explanation: 'Ribosomes translate mRNA into proteins', points: 20 },
      { text: 'What is the Second Law of Thermodynamics?', options: ['Energy is conserved', 'Entropy of an isolated system always increases', 'Temperature is absolute zero at equilibrium', 'Heat flows both ways equally'], correctAnswer: 'Entropy of an isolated system always increases', explanation: 'Entropy never decreases in a closed system', points: 20 },
      { text: 'Electromagnetic induction was discovered by?', options: ['Newton', 'Faraday', 'Maxwell', 'Hertz'], correctAnswer: 'Faraday', explanation: 'Michael Faraday discovered electromagnetic induction in 1831', points: 20 },
      { text: 'What is the function of the myelin sheath?', options: ['Produce hormones', 'Speed up nerve impulse', 'Store ATP', 'Digest pathogens'], correctAnswer: 'Speed up nerve impulse', explanation: 'Myelin insulates axons, allowing faster signal transmission', points: 20 },
      { text: 'Which process creates ATP in the mitochondria?', options: ['Glycolysis', 'Fermentation', 'Oxidative phosphorylation', 'Photophosphorylation'], correctAnswer: 'Oxidative phosphorylation', explanation: 'The electron transport chain drives ATP synthesis via oxidative phosphorylation', points: 20 },
    ],
  },
  GK: {
    easy: [
      { text: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'A week has 7 days', points: 10 },
      { text: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 'Mercury', explanation: 'Mercury is the first planet from the Sun', points: 10 },
      { text: 'What is the national bird of India?', options: ['Sparrow', 'Eagle', 'Peacock', 'Parrot'], correctAnswer: 'Peacock', explanation: 'The peacock is India\'s national bird', points: 10 },
      { text: 'How many colours are in a rainbow?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'VIBGYOR — 7 colours', points: 10 },
      { text: 'Water freezes at?', options: ['0°C', '10°C', '100°C', '50°C'], correctAnswer: '0°C', explanation: 'Water freezes at 0°C (32°F)', points: 10 },
      { text: 'Which is the tallest animal?', options: ['Elephant', 'Horse', 'Giraffe', 'Camel'], correctAnswer: 'Giraffe', explanation: 'Giraffes can reach heights of 5–6 metres', points: 10 },
      { text: 'How many hours are in a day?', options: ['12', '20', '24', '48'], correctAnswer: '24', explanation: 'A day has 24 hours', points: 10 },
      { text: 'What colour is the sky on a clear day?', options: ['Green', 'Blue', 'Yellow', 'White'], correctAnswer: 'Blue', explanation: 'The sky appears blue due to Rayleigh scattering', points: 10 },
      { text: 'Which fruit is known as the king of fruits?', options: ['Apple', 'Banana', 'Mango', 'Orange'], correctAnswer: 'Mango', explanation: 'Mango is widely called the king of fruits', points: 10 },
      { text: 'How many months are in a year?', options: ['10', '11', '12', '13'], correctAnswer: '12', explanation: 'There are 12 months in a calendar year', points: 10 },
      { text: 'The Great Wall is in which country?', options: ['India', 'Japan', 'China', 'Korea'], correctAnswer: 'China', explanation: 'The Great Wall of China stretches thousands of kilometres', points: 10 },
      { text: 'What do bees produce?', options: ['Milk', 'Honey', 'Wax only', 'Silk'], correctAnswer: 'Honey', explanation: 'Bees collect nectar and produce honey', points: 10 },
      { text: 'Which shape has three sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correctAnswer: 'Triangle', explanation: 'A triangle has exactly three sides', points: 10 },
      { text: 'Which instrument measures temperature?', options: ['Barometer', 'Thermometer', 'Compass', 'Scale'], correctAnswer: 'Thermometer', explanation: 'A thermometer measures temperature in degrees', points: 10 },
      { text: 'The national flag of India has how many colours?', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'Saffron, white, and green with a blue Ashoka Chakra', points: 10 },
    ],
    medium: [
      { text: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Twain', 'Keats'], correctAnswer: 'Shakespeare', explanation: 'William Shakespeare wrote this tragedy', points: 15 },
      { text: 'Largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 'Pacific', explanation: 'Pacific Ocean covers about 46% of water surface', points: 15 },
      { text: 'Capital of France?', options: ['Rome', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris', explanation: 'Paris is the capital and largest city of France', points: 15 },
      { text: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Process Unit', 'Core Processing Unit'], correctAnswer: 'Central Processing Unit', explanation: 'CPU is the brain of a computer', points: 15 },
      { text: 'Mahatma Gandhi was born in?', options: ['1860', '1869', '1875', '1880'], correctAnswer: '1869', explanation: 'Mahatma Gandhi was born on 2 Oct 1869', points: 15 },
      { text: 'Which country is the largest by area?', options: ['China', 'USA', 'Canada', 'Russia'], correctAnswer: 'Russia', explanation: 'Russia is the world\'s largest country at ~17.1 million km²', points: 15 },
      { text: 'How many bones are in an adult human body?', options: ['196', '206', '216', '226'], correctAnswer: '206', explanation: 'An adult human body has 206 bones', points: 15 },
      { text: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Picasso', 'Da Vinci', 'Raphael'], correctAnswer: 'Da Vinci', explanation: 'Leonardo da Vinci painted the Mona Lisa around 1503', points: 15 },
      { text: 'Which is the smallest continent?', options: ['Europe', 'Antarctica', 'Australia', 'South America'], correctAnswer: 'Australia', explanation: 'Australia is the smallest continent by area', points: 15 },
      { text: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: '1945', explanation: 'WWII ended in 1945 with Allied victory', points: 15 },
      { text: 'Which element has the symbol "Fe"?', options: ['Fluorine', 'Iron', 'Fermium', 'Francium'], correctAnswer: 'Iron', explanation: 'Fe comes from Latin "Ferrum"', points: 15 },
      { text: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], correctAnswer: 'Tokyo', explanation: 'Tokyo has been Japan\'s capital since 1869', points: 15 },
      { text: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctAnswer: 'Diamond', explanation: 'Diamond scores 10 on the Mohs hardness scale', points: 15 },
      { text: 'How many continents are on Earth?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'The 7 continents are Asia, Africa, North America, South America, Antarctica, Europe, Australia', points: 15 },
      { text: 'Who invented the light bulb?', options: ['Tesla', 'Edison', 'Bell', 'Faraday'], correctAnswer: 'Edison', explanation: 'Thomas Edison patented the practical incandescent bulb in 1879', points: 15 },
    ],
    hard: [
      { text: 'Largest planet in our solar system?', options: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'], correctAnswer: 'Jupiter', explanation: 'Jupiter is 11× larger than Earth', points: 20 },
      { text: 'Who invented the telephone?', options: ['Edison', 'Bell', 'Tesla', 'Marconi'], correctAnswer: 'Bell', explanation: 'Alexander Graham Bell patented the telephone in 1876', points: 20 },
      { text: 'Chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 'Au', explanation: 'Au from Latin "aurum"', points: 20 },
      { text: 'First country to reach Mars?', options: ['USA', 'Russia', 'China', 'India'], correctAnswer: 'USA', explanation: 'Mariner 4 (NASA) flew past Mars in 1964', points: 20 },
      { text: 'Which treaty ended World War I?', options: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of Westphalia', 'Treaty of Utrecht'], correctAnswer: 'Treaty of Versailles', explanation: 'The Treaty of Versailles was signed in 1919', points: 20 },
      { text: 'What is the Coriolis effect?', options: ['Ocean tides caused by the moon', 'Deflection of moving objects due to Earth\'s rotation', 'Greenhouse gas warming', 'Volcanic eruption pattern'], correctAnswer: 'Deflection of moving objects due to Earth\'s rotation', explanation: 'Earth\'s rotation deflects winds/currents right in Northern, left in Southern hemisphere', points: 20 },
      { text: 'In which year was the United Nations founded?', options: ['1939', '1944', '1945', '1948'], correctAnswer: '1945', explanation: 'The UN was founded on 24 October 1945', points: 20 },
      { text: 'What does "UNICEF" stand for?', options: ['United Nations Children\'s Emergency Fund', 'United Nations International Children\'s Emergency Fund', 'Universal Children\'s Education Fund', 'United Nations Cultural Education Foundation'], correctAnswer: 'United Nations International Children\'s Emergency Fund', explanation: 'UNICEF was established in 1946', points: 20 },
      { text: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'], correctAnswer: 'Neil Armstrong', explanation: 'Neil Armstrong stepped on the Moon on 20 July 1969 (Apollo 11)', points: 20 },
      { text: 'What is the speed of sound in air at 20°C?', options: ['343 m/s', '300 m/s', '440 m/s', '250 m/s'], correctAnswer: '343 m/s', explanation: 'Sound travels at approximately 343 m/s in air at 20°C', points: 20 },
      { text: 'Which country has the longest coastline?', options: ['Russia', 'Australia', 'Norway', 'Canada'], correctAnswer: 'Canada', explanation: 'Canada has the world\'s longest coastline at ~202,080 km', points: 20 },
      { text: 'Machu Picchu is located in which country?', options: ['Mexico', 'Brazil', 'Peru', 'Colombia'], correctAnswer: 'Peru', explanation: 'Machu Picchu is a 15th-century Inca citadel in Peru', points: 20 },
      { text: 'What is the primary language of Brazil?', options: ['Spanish', 'Portuguese', 'French', 'English'], correctAnswer: 'Portuguese', explanation: 'Brazil was colonised by Portugal; Portuguese is its official language', points: 20 },
      { text: 'Which scientist proposed the theory of relativity?', options: ['Newton', 'Bohr', 'Einstein', 'Hawking'], correctAnswer: 'Einstein', explanation: 'Albert Einstein published the Special Theory of Relativity in 1905', points: 20 },
      { text: 'What is the currency of Japan?', options: ['Won', 'Yuan', 'Yen', 'Baht'], correctAnswer: 'Yen', explanation: 'The Japanese Yen (¥) is Japan\'s official currency', points: 20 },
    ],
  },
}

function pickRandom(arr, n) {
  // Shuffle with a time-seeded random to guarantee different ordering every call
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  // If more questions requested than available, cycle through bank with shuffled repeats
  if (n <= shuffled.length) {
    return shuffled.slice(0, n).map((q, i) => ({ ...q, type: q.type || 'mcq', id: `gen-q-${Date.now()}-${i}` }))
  }
  const result = []
  while (result.length < n) {
    const reshuffled = [...arr].sort(() => Math.random() - 0.5)
    result.push(...reshuffled)
  }
  return result.slice(0, n).map((q, i) => ({ ...q, type: q.type || 'mcq', id: `gen-q-${Date.now()}-${i}` }))
}

/* ─── Assign-to-classes dialog ─────────────────────────────────────────── */
function AssignDialog({ quiz, classes, onClose, onSaved }) {
  const initial = (quiz.assignedClassIds || []).map(c => c?._id || c)
  const [selected, setSelected] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const id = quiz._id ?? quiz.id
      const res = await quizzesApi.update(id, { assignedClassIds: selected })
      onSaved(res.data?.quiz || { ...quiz, assignedClassIds: selected })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update assignment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={800}>Assign Quiz</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Assign <strong>{'"'}{quiz.title}{'"'}</strong> to one or more classes. Leave empty to keep it open to all students at the matching grade.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormControl fullWidth>
          <InputLabel>Classes</InputLabel>
          <Select
            multiple
            label="Classes"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            renderValue={(s) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {s.length === 0 ? <em>Open to all</em> : s.map(id => {
                  const c = classes.find(c => c._id === id)
                  return <Chip key={id} label={c ? `${c.name} (G${c.grade})` : id} size="small" />
                })}
              </Box>
            )}
          >
            {classes.length === 0 ? (
              <MenuItem disabled>No classes yet — create one under Classes</MenuItem>
            ) : classes.map(c => (
              <MenuItem key={c._id} value={c._id}>
                {c.name} — Grade {c.grade}{c.section ? ` · ${c.section}` : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ borderRadius: '10px' }}>
          {saving ? <CircularProgress size={20} /> : 'Save Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const emptyQuizForm = { title: '', subjectId: '', grade: '3', difficulty: 'easy', durationMinutes: 10, xpReward: 50, quizType: 'test', questionsToServe: '', assignedClassIds: [] }

export default function QuizManagementPage() {

  // Quizzes that any student has already started — these are locked from editing
  const attemptedQuizIds = useSelector(s => s.quiz.attemptedQuizIds)

  const [quizList,     setQuizList]     = useState([])
  const [loadingList,  setLoadingList]  = useState(true)
  const [listError,    setListError]    = useState('')
  const [subjects,     setSubjects]     = useState([])
  const [classes,      setClasses]      = useState([])
  const [saveError,    setSaveError]    = useState('')

  useEffect(() => {
    Promise.all([quizzesApi.getAll(), subjectsApi.getAll(), classesApi.getAll().catch(() => ({ data: { classes: [] } }))])
      .then(([qData, sData, cData]) => {
        setQuizList(qData.data.quizzes ?? qData.data)
        const subs = sData.data.subjects ?? sData.data
        setSubjects(subs)
        setClasses(cData.data?.classes ?? [])
        // set default subjectId once subjects are loaded
        if (subs.length) setQuizForm(f => ({ ...f, subjectId: f.subjectId || subs[0]._id }))
      })
      .catch(() => setListError('Failed to load data. Is the backend running?'))
      .finally(() => setLoadingList(false))
  }, [])
  const [search,       setSearch]       = useState('')
  const [filter,       setFilter]       = useState('all')
  const [sortCol,      setSortCol]      = useState('title')
  const [sortDir,      setSortDir]      = useState('asc')

  const handleSort = (col) => {
    setSortDir(prev => (sortCol === col && prev === 'asc') ? 'desc' : 'asc')
    setSortCol(col)
  }
  const [showCreate,   setShowCreate]   = useState(false)
  const [editQuiz,     setEditQuiz]     = useState(null)
  const [viewQuiz,     setViewQuiz]     = useState(null)
  const [deleteQuiz,   setDeleteQuiz]   = useState(null)
  const [assignQuiz,   setAssignQuiz]   = useState(null)

  /* GenAI state */
  const [aiPrompt,     setAiPrompt]     = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)
  const [aiQuestions,  setAiQuestions]  = useState([])
  const [aiGenerated,  setAiGenerated]  = useState(false)
  const [aiError,      setAiError]      = useState('')
  const [quizForm,     setQuizForm]     = useState(emptyQuizForm)

  const filtered = quizList
    .filter(q => {
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || q.difficulty === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      let aVal, bVal
      if (sortCol === 'title')       { aVal = a.title || ''; bVal = b.title || '' }
      else if (sortCol === 'subject'){ aVal = subjectLabel(a.subjectId); bVal = subjectLabel(b.subjectId) }
      else if (sortCol === 'grade')  { aVal = String(a.grade || ''); bVal = String(b.grade || '') }
      else if (sortCol === 'questions') { aVal = a.totalQuestions ?? a.questions?.length ?? 0; bVal = b.totalQuestions ?? b.questions?.length ?? 0 }
      else if (sortCol === 'difficulty') { const order = { easy: 0, medium: 1, hard: 2 }; aVal = order[a.difficulty] ?? 0; bVal = order[b.difficulty] ?? 0 }
      else if (sortCol === 'xp')     { aVal = a.xpReward ?? 0; bVal = b.xpReward ?? 0 }
      else                           { aVal = ''; bVal = '' }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const openCreate = () => {
    setQuizForm({ ...emptyQuizForm, subjectId: subjects[0]?._id || '' })
    setAiPrompt('')
    setAiQuestions([])
    setAiGenerated(false)
    setSaveError('')
    setShowCreate(true)
  }

  /* ─── AI generation (ChatGPT → local bank fallback) ─── */
  const selectedSubjectName = subjects.find(s => s._id === quizForm.subjectId)?.name || 'GK'
  const aiSubjectKey = selectedSubjectName.toLowerCase().includes('math') ? 'Math'
    : selectedSubjectName.toLowerCase().includes('english') ? 'English'
    : selectedSubjectName.toLowerCase().includes('science') ? 'Science'
    : 'GK'

  const handleGenerate = async () => {
    setAiLoading(true)
    setAiGenerated(false)
    setAiError('')

    const countMatch = aiPrompt.match(/\b(\d+)\b/)
    const requestedCount = countMatch ? Math.max(1, parseInt(countMatch[1], 10)) : 10
    const pointsMap = { easy: 10, medium: 15, hard: 20 }
    const pts = pointsMap[quizForm.difficulty] || 10

    try {
      const systemPrompt = `You are an expert quiz creator for a school education platform called OlympQuiz.
Generate exactly ${requestedCount} MCQ questions for Grade ${quizForm.grade} students.
Subject: ${selectedSubjectName}. Difficulty: ${quizForm.difficulty}.
${aiPrompt ? `Additional instruction: ${aiPrompt}` : ''}
Rules:
- Each question must have exactly 4 distinct options.
- correctAnswer must be an exact copy of one of the options.
- Keep language age-appropriate for Grade ${quizForm.grade}.
- Make every question unique and different from each other.
- Return ONLY a valid JSON array — no markdown, no explanation outside the array.
JSON format:
[{"text":"...","options":["A","B","C","D"],"correctAnswer":"B","explanation":"Brief explanation.","points":${pts}}]`

      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Server error ${res.status}`)
      }

      const data = await res.json()
      const raw = data.content?.trim() || '[]'
      const json = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
      const parsed = JSON.parse(json)
      const questions = parsed.map((q, i) => ({
        type: 'mcq',
        text: q.text || '',
        options: q.options || [],
        correctAnswer: q.correctAnswer || '',
        explanation: q.explanation || '',
        points: q.points ?? pts,
        id: `gpt-q-${Date.now()}-${i}`,
      }))
      setAiQuestions(questions)
      setAiGenerated(true)
      if (!quizForm.title) {
        setQuizForm(f => ({ ...f, title: `${selectedSubjectName} Quiz — ${quizForm.difficulty} (Grade ${quizForm.grade})` }))
      }
      setAiLoading(false)
      return
    } catch (err) {
      setAiError(`AI error: ${err.message}. Falling back to local bank.`)
    }

    // ── Local bank fallback ──
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    const bank = AI_BANK[aiSubjectKey]?.[quizForm.difficulty] || AI_BANK.GK.easy
    const generated = pickRandom(bank, requestedCount)
    setAiQuestions(generated)
    setAiGenerated(true)
    if (!quizForm.title) {
      setQuizForm(f => ({ ...f, title: `${selectedSubjectName} Quiz — ${quizForm.difficulty} (Grade ${quizForm.grade})` }))
    }
    setAiLoading(false)
  }

  const handleSaveQuiz = async () => {
    setSaveError('')
    const questions = aiQuestions.length > 0 ? aiQuestions : []
    const payload = {
      title:           quizForm.title,
      subjectId:       quizForm.subjectId,
      grade:           quizForm.grade,
      difficulty:      quizForm.difficulty,
      durationMinutes: quizForm.durationMinutes,
      xpReward:        quizForm.xpReward,
      quizType:        quizForm.quizType,
      questionsToServe: quizForm.questionsToServe ? Number(quizForm.questionsToServe) : null,
      assignedClassIds: quizForm.assignedClassIds || [],
      questions,
    }
    try {
      if (editQuiz) {
        const data = await quizzesApi.update(editQuiz._id ?? editQuiz.id, payload)
        const updated = data.data.quiz
        setQuizList(prev => prev.map(q => (q._id ?? q.id) === (editQuiz._id ?? editQuiz.id) ? updated : q))
        setEditQuiz(null)
        setShowCreate(false)
      } else {
        const data = await quizzesApi.create(payload)
        const created = data.data.quiz
        setQuizList(prev => [...prev, created])
        setShowCreate(false)
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Failed to save quiz.')
      return
    }
    setAiQuestions([])
    setAiGenerated(false)
  }

  const openEdit = (quiz) => {
    if (attemptedQuizIds.includes(quiz._id ?? quiz.id)) return
    setQuizForm({
      title:           quiz.title,
      subjectId:       quiz.subjectId?._id ?? quiz.subjectId ?? '',
      grade:           String(quiz.grade || '3'),
      difficulty:      quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      xpReward:        quiz.xpReward,
      quizType:        quiz.quizType || 'test',
      questionsToServe: quiz.questionsToServe ?? '',
      assignedClassIds: (quiz.assignedClassIds || []).map(c => c?._id || c),
    })
    setAiQuestions(quiz.questions || [])
    setAiGenerated(false)
    setEditQuiz(quiz)
    setShowCreate(true)
  }

  // subjectId may be a populated object { _id, name } or a raw ObjectId string
  const subjectLabel = (subjectId) => {
    if (!subjectId) return '—'
    // If already populated with a name
    if (typeof subjectId === 'object' && subjectId.name) return subjectId.name
    // Look up by _id in subjects list
    const id = typeof subjectId === 'object' ? subjectId._id : subjectId
    const found = subjects.find(s => s._id === id)
    return found ? found.name : '—'
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>📝 Quiz Management</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage quizzes for your students</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate} sx={{ borderRadius: '10px' }}>
          Create Quiz
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Quizzes', value: quizList.length,                               color: '#1E40AF' },
          { label: 'Easy',          value: quizList.filter(q => q.difficulty === 'easy').length,   color: '#10B981' },
          { label: 'Medium',        value: quizList.filter(q => q.difficulty === 'medium').length, color: '#F59E0B' },
          { label: 'Hard',          value: quizList.filter(q => q.difficulty === 'hard').length,   color: '#EF4444' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search quizzes…" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
        <FormControl sx={{ minWidth: 130 }} size="small">
          <InputLabel>Difficulty</InputLabel>
          <Select value={filter} label="Difficulty" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quiz Table */}
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' } }}>
                {[['title','Quiz'],['subject','Subject'],['grade','Grade'],['questions','Questions'],['difficulty','Difficulty'],['xp','XP']].map(([col, label]) => (
                  <TableCell key={col} sortDirection={sortCol === col ? sortDir : false}>
                    <TableSortLabel
                      active={sortCol === col}
                      direction={sortCol === col ? sortDir : 'asc'}
                      onClick={() => handleSort(col)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingList && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>Loading quizzes…</TableCell></TableRow>
              )}
              {!loadingList && listError && (
                <TableRow><TableCell colSpan={7}><Alert severity="error">{listError}</Alert></TableCell></TableRow>
              )}
              {!loadingList && !listError && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No quizzes found</TableCell></TableRow>
              )}
              {filtered.map(quiz => (
                  <TableRow key={quiz._id ?? quiz.id} hover sx={attemptedQuizIds.includes(quiz._id ?? quiz.id) ? { bgcolor: '#FAFAFA' } : {}}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '1.4rem' }}>{quiz.subjectId?.icon || '📝'}</Typography>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Typography variant="body2" fontWeight={600}>{quiz.title}</Typography>
                            {attemptedQuizIds.includes(quiz._id ?? quiz.id) && (
                              <Chip
                                icon={<LockRoundedIcon sx={{ fontSize: '0.7rem !important' }} />}
                                label="Attempted"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
                              />
                            )}
                          </Box>
                        <Typography variant="caption" color="text.secondary">
                          {quiz.durationMinutes} min
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={subjectLabel(quiz.subjectId)} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>Grade {quiz.grade}</TableCell>
                  <TableCell>{quiz.totalQuestions || quiz.questions?.length || 0}</TableCell>
                  <TableCell>
                    <Chip label={quiz.difficulty} size="small" color={difficultyColors[quiz.difficulty]}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>⚡ {quiz.xpReward}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Preview quiz" placement="top">
                      <IconButton size="small" onClick={() => setViewQuiz(quiz)}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={attemptedQuizIds.includes(quiz._id ?? quiz.id)
                        ? '🔒 Quiz is locked — a student has already attempted it'
                        : 'Edit quiz'}
                      placement="top"
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openEdit(quiz)}
                          disabled={attemptedQuizIds.includes(quiz._id ?? quiz.id)}
                          sx={attemptedQuizIds.includes(quiz._id ?? quiz.id) ? { color: 'text.disabled' } : {}}
                        >
                          {attemptedQuizIds.includes(quiz._id ?? quiz.id)
                            ? <LockRoundedIcon fontSize="small" />
                            : <EditRoundedIcon fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Assign to class" placement="top">
                      <IconButton size="small" color="primary" onClick={() => setAssignQuiz(quiz)}>
                        <AssignmentRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete quiz" placement="top">
                      <IconButton size="small" color="error" onClick={() => setDeleteQuiz(quiz)}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialogs */}

      {/* ── Create / Edit Quiz Dialog ── */}
      <Dialog open={showCreate || Boolean(editQuiz)} onClose={() => { setShowCreate(false); setEditQuiz(null) }}
        maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {editQuiz ? '✏️ Edit Quiz' : '📝 Create New Quiz'}
        </DialogTitle>
        <DialogContent dividers>
          {saveError && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{saveError}</Alert>}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Quiz Title *" value={quizForm.title}
                onChange={e => setQuizForm(f => ({ ...f, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Quiz Type</InputLabel>
                <Select value={quizForm.quizType || 'test'} label="Quiz Type"
                  onChange={e => setQuizForm(f => ({ ...f, quizType: e.target.value }))}>
                  <MenuItem value="test">📝 Test</MenuItem>
                  <MenuItem value="practice">🎯 Practice</MenuItem>
                  <MenuItem value="flashcard">💡 Flashcard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select value={quizForm.subjectId} label="Subject"
                  onChange={e => setQuizForm(f => ({ ...f, subjectId: e.target.value }))}>
                  {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.icon} {s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select value={quizForm.grade} label="Grade"
                  onChange={e => setQuizForm(f => ({ ...f, grade: e.target.value }))}>
                  {['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(g => (
                    <MenuItem key={g} value={g}>{isNaN(g) ? g : `Grade ${g}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select value={quizForm.difficulty} label="Difficulty"
                  onChange={e => setQuizForm(f => ({ ...f, difficulty: e.target.value }))}>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Duration (min)" value={quizForm.durationMinutes}
                onChange={e => setQuizForm(f => ({ ...f, durationMinutes: Number(e.target.value) }))} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="XP Reward" value={quizForm.xpReward}
                onChange={e => setQuizForm(f => ({ ...f, xpReward: Number(e.target.value) }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Questions per attempt (random pick)"
                helperText={`Leave blank to serve all ${aiQuestions.length || 'configured'} questions`}
                value={quizForm.questionsToServe}
                inputProps={{ min: 1, max: aiQuestions.length || undefined }}
                onChange={e => setQuizForm(f => ({ ...f, questionsToServe: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign to classes</InputLabel>
                <Select
                  multiple
                  label="Assign to classes"
                  value={quizForm.assignedClassIds || []}
                  onChange={e => setQuizForm(f => ({ ...f, assignedClassIds: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? <em>Open to all</em> : selected.map(id => {
                        const c = classes.find(c => c._id === id)
                        return <Chip key={id} label={c ? `${c.name} (G${c.grade})` : id} size="small" />
                      })}
                    </Box>
                  )}
                >
                  {classes.length === 0 ? (
                    <MenuItem disabled>No classes yet — create one under Classes</MenuItem>
                  ) : classes.map(c => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} — Grade {c.grade}{c.section ? ` · ${c.section}` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* GenAI Section */}
          <Box sx={{
            p: 2.5, borderRadius: '16px', mb: 2,
            background: 'linear-gradient(135deg, #6C63FF10 0%, #A78BFA20 100%)',
            border: '1.5px solid #6C63FF30',
          }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <AutoAwesomeRoundedIcon sx={{ color: '#6C63FF' }} />
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#6C63FF' }}>AI Quiz Generator</Typography>
              <Chip label="⚡ ChatGPT" size="small" sx={{ bgcolor: '#10B98120', color: '#065F46', fontWeight: 700, fontSize: '0.65rem' }} />
              <Box sx={{ flex: 1 }} />
            </Box>



            <TextField fullWidth multiline rows={2}
              placeholder={`e.g. "Generate 10 questions on multiplication for Grade ${quizForm.grade} students"`}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              sx={{ mb: 1.5, bgcolor: 'background.paper', borderRadius: '10px',
                '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <Button variant="contained" startIcon={aiLoading ? null : <AutoAwesomeRoundedIcon />}
              onClick={handleGenerate} disabled={aiLoading}
              sx={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)', borderRadius: '10px',
                '&:hover': { background: 'linear-gradient(135deg, #5B52EE, #9670F9)' } }}>
              {aiLoading ? 'Asking ChatGPT...' : aiGenerated ? '✨ Regenerate' : '✨ Generate with AI'}
            </Button>
            {aiLoading && <LinearProgress sx={{ mt: 1.5, borderRadius: '100px' }} />}
            {aiError && (
              <Alert severity="warning" sx={{ mt: 1.5 }}>
                {aiError}
              </Alert>
            )}
            {aiGenerated && !aiError && (
              <Alert severity="success" sx={{ mt: 1.5 }}>
                ✅ {aiQuestions.length} questions generated{openAiKey ? ' by ChatGPT' : ''}! Edit or add more below.
              </Alert>
            )}
          </Box>

          {/* Questions editor */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                📋 Questions ({aiQuestions.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value=""
                    displayEmpty
                    onChange={e => {
                      if (!e.target.value) return
                      setAiQuestions(prev => [...prev, emptyQuestion(e.target.value)])
                    }}
                    renderValue={() => '+ Add Question'}
                    sx={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                    {QUESTION_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{t.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.desc}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {aiQuestions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary', bgcolor: 'action.hover', borderRadius: '12px' }}>
                <Typography variant="body2">No questions yet. Use AI or add manually above.</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {aiQuestions.map((q, qi) => (
                <QuestionEditor
                  key={qi}
                  index={qi}
                  question={q}
                  onChange={updated => setAiQuestions(prev => prev.map((item, i) => i === qi ? updated : item))}
                  onDelete={() => setAiQuestions(prev => prev.filter((_, i) => i !== qi))}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => { setShowCreate(false); setEditQuiz(null) }} variant="outlined" sx={{ borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuiz} variant="contained"
            disabled={!quizForm.title || !quizForm.subjectId}
            sx={{ borderRadius: '10px', px: 3 }}>
            {editQuiz ? 'Save Changes' : 'Save Quiz'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── View Quiz Dialog ── */}
      {viewQuiz && (
        <Dialog open onClose={() => setViewQuiz(null)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle fontWeight={800}>{viewQuiz.icon} {viewQuiz.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={subjectLabel(viewQuiz.subjectId)} size="small" />
              <Chip label={`Grade ${viewQuiz.grade}`} size="small" />
              <Chip label={viewQuiz.difficulty} size="small" color={difficultyColors[viewQuiz.difficulty]} />
              <Chip label={`⏱ ${viewQuiz.durationMinutes} min`} size="small" />
              <Chip label={`⚡ ${viewQuiz.xpReward} XP`} size="small" sx={{ bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 700 }} />
            </Box>
            {(viewQuiz.questions || []).map((q, i) => (
              <Box key={i} sx={{ mb: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: '10px' }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>Q{i + 1}. {q.text}</Typography>
                {(q.options || []).map((opt, j) => (
                  <Typography key={j} variant="caption" sx={{
                    display: 'block',
                    color: opt === q.correctAnswer ? 'success.main' : 'text.secondary',
                    fontWeight: opt === q.correctAnswer ? 700 : 400,
                  }}>
                    {opt === q.correctAnswer ? '✓' : '○'} {opt}
                  </Typography>
                ))}
              </Box>
            ))}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setViewQuiz(null)} variant="contained" sx={{ borderRadius: '10px' }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ── Assign Dialog ── */}
      {assignQuiz && (
        <AssignDialog
          quiz={assignQuiz}
          classes={classes}
          onClose={() => setAssignQuiz(null)}
          onSaved={(updated) => {
            setQuizList(prev => prev.map(q => (q._id ?? q.id) === (updated._id ?? updated.id) ? { ...q, ...updated } : q))
            setAssignQuiz(null)
          }}
        />
      )}

      <Dialog open={Boolean(deleteQuiz)} onClose={() => setDeleteQuiz(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={800}>Delete Quiz?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{'"'}{deleteQuiz?.title}{'"'}</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteQuiz(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button color="error" variant="contained" sx={{ borderRadius: '10px' }}
            onClick={async () => {
              const id = deleteQuiz._id ?? deleteQuiz.id
              try {
                await quizzesApi.delete(id)
                setQuizList(prev => prev.filter(q => (q._id ?? q.id) !== id))
              } catch (err) { console.error('Delete failed', err) }
              setDeleteQuiz(null)
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
