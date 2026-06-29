// ============================================================
// OlympQuiz - Lessons Data (3+ per topic, sample for key topics)
// ============================================================

export const lessons = [
  // MATHEMATICS - Counting & Numbers
  { id: 'les-m01-1', topicId: 'top-m01', subjectId: 'sub-math', order: 1, title: 'Counting 1 to 10', type: 'lesson', duration: 10, content: 'Let\'s learn to count from 1 to 10! Each number has a name and a symbol. 1 is ONE 🐱, 2 is TWO 🐱🐱, 3 is THREE 🐱🐱🐱...', keyPoints: ['1 to 5 counting', '6 to 10 counting', 'Writing numbers'], xp: 50 },
  { id: 'les-m01-2', topicId: 'top-m01', subjectId: 'sub-math', order: 2, title: 'Counting 11 to 20', type: 'lesson', duration: 12, content: 'Now let\'s explore numbers from 11 to 20! After 10 comes 11, then 12...', keyPoints: ['Teen numbers 11-19', 'The number 20', 'Counting objects'], xp: 60 },
  { id: 'les-m01-3', topicId: 'top-m01', subjectId: 'sub-math', order: 3, title: 'Comparing Numbers', type: 'lesson', duration: 15, content: 'We can compare numbers using greater than (>), less than (<), and equal to (=).', keyPoints: ['Greater than', 'Less than', 'Equal to'], xp: 70 },

  // MATHEMATICS - Addition
  { id: 'les-m02-1', topicId: 'top-m02', subjectId: 'sub-math', order: 1, title: 'What is Addition?', type: 'lesson', duration: 10, content: 'Addition means putting things together! If you have 2 apples 🍎🍎 and add 3 more 🍎🍎🍎, you get 5 apples!', keyPoints: ['Plus sign (+)', 'Adding small numbers', 'Sum = total'], xp: 50 },
  { id: 'les-m02-2', topicId: 'top-m02', subjectId: 'sub-math', order: 2, title: 'Adding Single Digits', type: 'lesson', duration: 15, content: 'Let\'s practice adding single digit numbers. Use your fingers to help!', keyPoints: ['Adding 1-5', 'Adding 6-9', 'Mental math tips'], xp: 60 },
  { id: 'les-m02-3', topicId: 'top-m02', subjectId: 'sub-math', order: 3, title: 'Adding Two-Digit Numbers', type: 'lesson', duration: 20, content: 'Now we\'ll add bigger numbers! We add the ones column first, then the tens column.', keyPoints: ['Ones and tens place', 'Column addition', 'Carrying over'], xp: 80 },

  // MATHEMATICS - Multiplication
  { id: 'les-m04-1', topicId: 'top-m04', subjectId: 'sub-math', order: 1, title: 'Introduction to Multiplication', type: 'lesson', duration: 15, content: 'Multiplication is repeated addition! 3 × 4 means adding 3 four times: 3+3+3+3 = 12', keyPoints: ['Times sign (×)', 'Multiplication as addition', 'Groups of objects'], xp: 70 },
  { id: 'les-m04-2', topicId: 'top-m04', subjectId: 'sub-math', order: 2, title: 'Multiplication Tables 1-5', type: 'lesson', duration: 20, content: 'Let\'s memorize the multiplication tables! Tables 1 through 5 are the building blocks.', keyPoints: ['Table of 1, 2, 3', 'Table of 4, 5', 'Tips to memorize'], xp: 90 },
  { id: 'les-m04-3', topicId: 'top-m04', subjectId: 'sub-math', order: 3, title: 'Multiplication Tables 6-10', type: 'lesson', duration: 20, content: 'Tables 6 to 10! These can be trickier, but with practice you\'ll master them!', keyPoints: ['Table of 6, 7, 8', 'Table of 9, 10', 'Fun tricks for 9s'], xp: 100 },

  // ENGLISH - Alphabet & Phonics
  { id: 'les-e01-1', topicId: 'top-e01', subjectId: 'sub-eng', order: 1, title: 'A, B, C - The Alphabet Song', type: 'lesson', duration: 10, content: 'The English alphabet has 26 letters. Let\'s start with A, B, C! A is for Apple 🍎, B is for Ball ⚽, C is for Cat 🐱', keyPoints: ['26 letters', 'A to M', 'Letter sounds'], xp: 50 },
  { id: 'les-e01-2', topicId: 'top-e01', subjectId: 'sub-eng', order: 2, title: 'N to Z - Completing the Alphabet', type: 'lesson', duration: 10, content: 'Now the second half! N is for Nest 🐦, O is for Orange 🍊, P is for Parrot 🦜...', keyPoints: ['N to Z', 'Letter sounds', 'Uppercase and lowercase'], xp: 50 },
  { id: 'les-e01-3', topicId: 'top-e01', subjectId: 'sub-eng', order: 3, title: 'Vowels and Consonants', type: 'lesson', duration: 15, content: 'Letters are divided into vowels (A, E, I, O, U) and consonants (all others). Vowels make the main sounds in words!', keyPoints: ['5 vowels', '21 consonants', 'Vowel sounds'], xp: 70 },

  // ENGLISH - Nouns & Pronouns
  { id: 'les-e03-1', topicId: 'top-e03', subjectId: 'sub-eng', order: 1, title: 'What are Nouns?', type: 'lesson', duration: 12, content: 'A noun is a naming word! It names a person, place, animal, or thing. Examples: boy, school, dog, book.', keyPoints: ['Person nouns', 'Place nouns', 'Thing nouns'], xp: 60 },
  { id: 'les-e03-2', topicId: 'top-e03', subjectId: 'sub-eng', order: 2, title: 'Common vs Proper Nouns', type: 'lesson', duration: 15, content: 'Common nouns are general (city, boy). Proper nouns are specific names (Mumbai, Arjun) and start with capitals!', keyPoints: ['Common nouns', 'Proper nouns', 'Capitalization'], xp: 70 },
  { id: 'les-e03-3', topicId: 'top-e03', subjectId: 'sub-eng', order: 3, title: 'Pronouns - He, She, It, They', type: 'lesson', duration: 12, content: 'Pronouns replace nouns! Instead of saying "Arjun went to school", we say "He went to school".', keyPoints: ['I, You, He, She', 'It, We, They', 'Using pronouns correctly'], xp: 70 },

  // GK - Animals & Plants
  { id: 'les-g01-1', topicId: 'top-g01', subjectId: 'sub-gk', order: 1, title: 'Wild Animals', type: 'lesson', duration: 15, content: 'Wild animals live in forests, jungles, and savannas. The lion is the King of the Jungle! 🦁 Tigers, elephants, and giraffes are all wild animals.', keyPoints: ['Animals of jungle', 'Animals of safari', 'Habitats'], xp: 60 },
  { id: 'les-g01-2', topicId: 'top-g01', subjectId: 'sub-gk', order: 2, title: 'Domestic Animals', type: 'lesson', duration: 12, content: 'Domestic animals live with humans! Dogs 🐕, cats 🐱, cows 🐄, and horses 🐴 are domestic animals. They help us or are our pets.', keyPoints: ['Pet animals', 'Farm animals', 'Animal products'], xp: 55 },
  { id: 'les-g01-3', topicId: 'top-g01', subjectId: 'sub-gk', order: 3, title: 'Plants Around Us', type: 'lesson', duration: 12, content: 'Plants are living things that make their own food using sunlight! 🌿 Trees, flowers, grass, and shrubs are all plants. They give us oxygen to breathe!', keyPoints: ['Parts of a plant', 'Photosynthesis basics', 'Types of plants'], xp: 60 },

  // GK - Our Country India
  { id: 'les-g04-1', topicId: 'top-g04', subjectId: 'sub-gk', order: 1, title: 'India - Our Motherland', type: 'lesson', duration: 15, content: 'India is a beautiful country in South Asia 🇮🇳. It is the 7th largest country in the world and has a rich history going back thousands of years!', keyPoints: ['Location of India', 'Capital: New Delhi', 'National symbols'], xp: 70 },
  { id: 'les-g04-2', topicId: 'top-g04', subjectId: 'sub-gk', order: 2, title: 'States and Languages', type: 'lesson', duration: 18, content: 'India has 28 states and 8 union territories! People speak many languages - Hindi, Tamil, Bengali, Marathi, and more. Unity in diversity!', keyPoints: ['28 states', 'Major languages', 'State capitals'], xp: 80 },
  { id: 'les-g04-3', topicId: 'top-g04', subjectId: 'sub-gk', order: 3, title: 'National Symbols of India', type: 'lesson', duration: 12, content: 'India has many national symbols! National Bird: Peacock 🦚, National Animal: Tiger 🐅, National Flower: Lotus 🪷, National Fruit: Mango 🥭', keyPoints: ['National bird, animal', 'National flower, fruit', 'National flag colors'], xp: 65 },

  // GK - Solar System
  { id: 'les-g05-1', topicId: 'top-g05', subjectId: 'sub-gk', order: 1, title: 'The Sun and Our Solar System', type: 'lesson', duration: 15, content: 'Our solar system has 8 planets that orbit around the Sun ☀️. The Sun is a giant star at the center. It gives us light and warmth!', keyPoints: ['The Sun', '8 planets', 'Orbit means going around'], xp: 75 },
  { id: 'les-g05-2', topicId: 'top-g05', subjectId: 'sub-gk', order: 2, title: 'The Planets', type: 'lesson', duration: 20, content: 'The 8 planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Remember: "My Very Educated Mother Just Served Us Noodles!"', keyPoints: ['Inner planets', 'Outer planets', 'Planet sizes'], xp: 90 },
  { id: 'les-g05-3', topicId: 'top-g05', subjectId: 'sub-gk', order: 3, title: 'Earth, Moon and Stars', type: 'lesson', duration: 15, content: 'Earth is our home planet 🌍. The Moon 🌙 is Earth\'s natural satellite. Stars are giant balls of burning gas in space - our Sun is a star too!', keyPoints: ['Earth facts', 'Moon phases', 'Stars vs planets'], xp: 80 },
]

export const getLessonsByTopic = (topicId) => lessons.filter(l => l.topicId === topicId)
export const getLessonById = (id) => lessons.find(l => l.id === id)

export default lessons
