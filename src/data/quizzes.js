// ============================================================
// OlympQuiz - Quizzes Data (10+ quizzes with questions)
// ============================================================

export const quizzes = [
  {
    id: 'qz-001', topicId: 'top-m01', subjectId: 'sub-math', title: 'Counting Fun!',
    description: 'Test your counting skills from 1 to 20!',
    difficulty: 'easy', grade: '1', durationMinutes: 5, passingScore: 60,
    totalQuestions: 5, xpReward: 100, icon: '1️⃣',
    createdBy: 'tea-001', createdAt: '2024-05-01',
    questions: [
      { id: 'q1', text: 'How many apples? 🍎🍎🍎', type: 'mcq', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'Count carefully: 1, 2, 3 apples!', points: 20 },
      { id: 'q2', text: 'What number comes after 9?', type: 'mcq', options: ['8', '10', '11', '7'], correctAnswer: '10', explanation: '9, then 10! We reach double digits.', points: 20 },
      { id: 'q3', text: 'Which is the biggest number?', type: 'mcq', options: ['5', '12', '8', '19'], correctAnswer: '19', explanation: '19 is the biggest among these numbers!', points: 20 },
      { id: 'q4', text: 'How many fingers on 2 hands?', type: 'mcq', options: ['8', '9', '10', '12'], correctAnswer: '10', explanation: '5 fingers on each hand = 5 + 5 = 10!', points: 20 },
      { id: 'q5', text: 'What number comes before 15?', type: 'mcq', options: ['13', '14', '16', '17'], correctAnswer: '14', explanation: '...13, 14, 15! 14 comes before 15.', points: 20 },
    ],
  },
  {
    id: 'qz-002', topicId: 'top-m02', subjectId: 'sub-math', title: 'Addition Adventure',
    description: 'Can you add these numbers correctly?',
    difficulty: 'easy', grade: '2', durationMinutes: 8, passingScore: 60,
    totalQuestions: 5, xpReward: 120, icon: '➕',
    createdBy: 'tea-001', createdAt: '2024-05-05',
    questions: [
      { id: 'q1', text: '3 + 4 = ?', type: 'mcq', options: ['6', '7', '8', '5'], correctAnswer: '7', explanation: '3 + 4 = 7. Count on from 3: 4, 5, 6, 7!', points: 20 },
      { id: 'q2', text: '5 + 6 = ?', type: 'mcq', options: ['10', '11', '12', '9'], correctAnswer: '11', explanation: '5 + 6 = 11. Remember: 5 + 5 = 10, then add 1 more!', points: 20 },
      { id: 'q3', text: 'What is 12 + 7?', type: 'mcq', options: ['17', '18', '19', '20'], correctAnswer: '19', explanation: '12 + 7 = 19. Add 7 to 12: 13, 14, 15, 16, 17, 18, 19!', points: 20 },
      { id: 'q4', text: 'A basket has 8 oranges. We add 5 more. How many now?', type: 'mcq', options: ['11', '12', '13', '14'], correctAnswer: '13', explanation: '8 + 5 = 13 oranges!', points: 20 },
      { id: 'q5', text: '25 + 10 = ?', type: 'mcq', options: ['30', '34', '35', '36'], correctAnswer: '35', explanation: '25 + 10 = 35. Adding 10 just increases the tens digit by 1!', points: 20 },
    ],
  },
  {
    id: 'qz-003', topicId: 'top-m04', subjectId: 'sub-math', title: 'Multiplication Master',
    description: 'Test your multiplication tables knowledge!',
    difficulty: 'medium', grade: '3', durationMinutes: 10, passingScore: 60,
    totalQuestions: 5, xpReward: 150, icon: '✖️',
    createdBy: 'tea-001', createdAt: '2024-05-10',
    questions: [
      { id: 'q1', text: '3 × 4 = ?', type: 'mcq', options: ['7', '10', '12', '14'], correctAnswer: '12', explanation: '3 × 4 = 12. Three groups of 4: 4+4+4 = 12!', points: 20 },
      { id: 'q2', text: '6 × 7 = ?', type: 'mcq', options: ['42', '44', '46', '48'], correctAnswer: '42', explanation: '6 × 7 = 42. A classic to memorize!', points: 20 },
      { id: 'q3', text: '5 × 8 = ?', type: 'mcq', options: ['35', '38', '40', '45'], correctAnswer: '40', explanation: '5 × 8 = 40. 5 times any even number ends in 0!', points: 20 },
      { id: 'q4', text: '9 × 3 = ?', type: 'mcq', options: ['24', '27', '28', '30'], correctAnswer: '27', explanation: '9 × 3 = 27. Tip: 9 × 3, digits sum to 9: 2+7=9!', points: 20 },
      { id: 'q5', text: 'A box has 6 rows with 4 items each. Total items?', type: 'mcq', options: ['20', '22', '24', '26'], correctAnswer: '24', explanation: '6 × 4 = 24 items in the box!', points: 20 },
    ],
  },
  {
    id: 'qz-004', topicId: 'top-e01', subjectId: 'sub-eng', title: 'Alphabet & Phonics Quiz',
    description: 'How well do you know your ABCs?',
    difficulty: 'easy', grade: '1', durationMinutes: 5, passingScore: 60,
    totalQuestions: 5, xpReward: 100, icon: '🔤',
    createdBy: 'tea-002', createdAt: '2024-05-02',
    questions: [
      { id: 'q1', text: 'Which letter comes after "D"?', type: 'mcq', options: ['C', 'E', 'F', 'B'], correctAnswer: 'E', explanation: 'A, B, C, D, E! E comes after D.', points: 20 },
      { id: 'q2', text: 'Which of these is a VOWEL?', type: 'mcq', options: ['B', 'T', 'O', 'P'], correctAnswer: 'O', explanation: 'The vowels are A, E, I, O, U. O is a vowel!', points: 20 },
      { id: 'q3', text: '"B" sounds like ____ at the start of "Ball"?', type: 'mcq', options: ['"buh"', '"puh"', '"duh"', '"kuh"'], correctAnswer: '"buh"', explanation: 'B makes the "buh" sound like in Ball and Bear!', points: 20 },
      { id: 'q4', text: 'How many vowels are in the English alphabet?', type: 'mcq', options: ['3', '4', '5', '6'], correctAnswer: '5', explanation: 'There are 5 vowels: A, E, I, O, U!', points: 20 },
      { id: 'q5', text: 'Which letter is the LAST in the alphabet?', type: 'mcq', options: ['X', 'Y', 'Z', 'W'], correctAnswer: 'Z', explanation: '...X, Y, Z! Z is the last letter of the alphabet!', points: 20 },
    ],
  },
  {
    id: 'qz-005', topicId: 'top-e03', subjectId: 'sub-eng', title: 'Nouns & Pronouns Challenge',
    description: 'Identify nouns and use pronouns correctly!',
    difficulty: 'medium', grade: '3', durationMinutes: 8, passingScore: 60,
    totalQuestions: 5, xpReward: 130, icon: '📝',
    createdBy: 'tea-002', createdAt: '2024-05-08',
    questions: [
      { id: 'q1', text: 'Which word is a NOUN? "The happy dog runs fast."', type: 'mcq', options: ['happy', 'runs', 'dog', 'fast'], correctAnswer: 'dog', explanation: '"Dog" is a noun - it names an animal!', points: 20 },
      { id: 'q2', text: '"Mumbai" is a ________ noun.', type: 'mcq', options: ['Common', 'Proper', 'Plural', 'Abstract'], correctAnswer: 'Proper', explanation: 'Mumbai is a specific city name, so it is a Proper noun!', points: 20 },
      { id: 'q3', text: 'Replace "Arjun" with the correct pronoun: "Arjun is my friend."', type: 'mcq', options: ['She', 'They', 'He', 'It'], correctAnswer: 'He', explanation: 'Arjun is a boy\'s name, so we use "He"!', points: 20 },
      { id: 'q4', text: 'Which is a COMMON noun?', type: 'mcq', options: ['India', 'Taj Mahal', 'River', 'Ganges'], correctAnswer: 'River', explanation: '"River" is a common noun - it refers to rivers in general, not a specific one!', points: 20 },
      { id: 'q5', text: '"___ are my best friends." (talking about two girls)', type: 'mcq', options: ['He', 'She', 'They', 'It'], correctAnswer: 'They', explanation: '"They" is used for more than one person!', points: 20 },
    ],
  },
  {
    id: 'qz-006', topicId: 'top-g01', subjectId: 'sub-gk', title: 'Amazing Animals Quiz',
    description: 'How much do you know about animals?',
    difficulty: 'easy', grade: '2', durationMinutes: 8, passingScore: 60,
    totalQuestions: 5, xpReward: 110, icon: '🦁',
    createdBy: 'tea-003', createdAt: '2024-05-03',
    questions: [
      { id: 'q1', text: 'Which animal is called the "King of the Jungle"?', type: 'mcq', options: ['Tiger', 'Lion', 'Elephant', 'Leopard'], correctAnswer: 'Lion', explanation: 'The Lion 🦁 is called the King of the Jungle!', points: 20 },
      { id: 'q2', text: 'Which is a domestic animal?', type: 'mcq', options: ['Tiger', 'Zebra', 'Dog', 'Cheetah'], correctAnswer: 'Dog', explanation: 'Dog 🐕 is a domestic animal - it lives with humans!', points: 20 },
      { id: 'q3', text: 'What is the largest land animal?', type: 'mcq', options: ['Giraffe', 'Rhinoceros', 'Elephant', 'Hippo'], correctAnswer: 'Elephant', explanation: 'The African Elephant 🐘 is the largest land animal!', points: 20 },
      { id: 'q4', text: 'Which bird can swim but cannot fly?', type: 'mcq', options: ['Parrot', 'Penguin', 'Eagle', 'Sparrow'], correctAnswer: 'Penguin', explanation: 'Penguins 🐧 are birds that swim but cannot fly!', points: 20 },
      { id: 'q5', text: 'A caterpillar turns into a _______.', type: 'mcq', options: ['Bee', 'Moth', 'Butterfly', 'Dragonfly'], correctAnswer: 'Butterfly', explanation: 'Caterpillars transform into beautiful butterflies 🦋!', points: 20 },
    ],
  },
  {
    id: 'qz-007', topicId: 'top-g04', subjectId: 'sub-gk', title: 'Know Your India!',
    description: 'Test your knowledge about India!',
    difficulty: 'medium', grade: '3', durationMinutes: 10, passingScore: 60,
    totalQuestions: 5, xpReward: 140, icon: '🇮🇳',
    createdBy: 'tea-003', createdAt: '2024-05-12',
    questions: [
      { id: 'q1', text: 'What is the capital of India?', type: 'mcq', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], correctAnswer: 'New Delhi', explanation: 'New Delhi is the capital of India 🇮🇳!', points: 20 },
      { id: 'q2', text: 'What is the national bird of India?', type: 'mcq', options: ['Sparrow', 'Eagle', 'Peacock', 'Flamingo'], correctAnswer: 'Peacock', explanation: 'The Peacock 🦚 is the national bird of India!', points: 20 },
      { id: 'q3', text: 'India has how many states?', type: 'mcq', options: ['25', '26', '27', '28'], correctAnswer: '28', explanation: 'India has 28 states and 8 union territories!', points: 20 },
      { id: 'q4', text: 'What is the national fruit of India?', type: 'mcq', options: ['Apple', 'Mango', 'Banana', 'Orange'], correctAnswer: 'Mango', explanation: 'The Mango 🥭 is India\'s national fruit - the King of Fruits!', points: 20 },
      { id: 'q5', text: 'The national animal of India is the _______?', type: 'mcq', options: ['Lion', 'Elephant', 'Tiger', 'Deer'], correctAnswer: 'Tiger', explanation: 'The Bengal Tiger 🐅 is the national animal of India!', points: 20 },
    ],
  },
  {
    id: 'qz-008', topicId: 'top-g05', subjectId: 'sub-gk', title: 'Space Explorer Quiz',
    description: 'Journey through our solar system!',
    difficulty: 'medium', grade: '4', durationMinutes: 10, passingScore: 60,
    totalQuestions: 5, xpReward: 160, icon: '🪐',
    createdBy: 'tea-003', createdAt: '2024-05-15',
    questions: [
      { id: 'q1', text: 'How many planets are in our solar system?', type: 'mcq', options: ['7', '8', '9', '10'], correctAnswer: '8', explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!', points: 20 },
      { id: 'q2', text: 'Which is the largest planet?', type: 'mcq', options: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'], correctAnswer: 'Jupiter', explanation: 'Jupiter 🪐 is the largest planet in our solar system!', points: 20 },
      { id: 'q3', text: 'Which planet is closest to the Sun?', type: 'mcq', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 'Mercury', explanation: 'Mercury is the closest planet to the Sun!', points: 20 },
      { id: 'q4', text: 'Earth\'s natural satellite is called?', type: 'mcq', options: ['Sun', 'Mars', 'Star', 'Moon'], correctAnswer: 'Moon', explanation: 'The Moon 🌙 is Earth\'s natural satellite!', points: 20 },
      { id: 'q5', text: 'Which planet has rings around it?', type: 'mcq', options: ['Jupiter', 'Saturn', 'Mars', 'Venus'], correctAnswer: 'Saturn', explanation: 'Saturn 🪐 is famous for its beautiful rings made of ice and rock!', points: 20 },
    ],
  },
  {
    id: 'qz-009', topicId: 'top-m06', subjectId: 'sub-math', title: 'Shapes Around Us',
    description: 'Identify shapes in the world around you!',
    difficulty: 'easy', grade: '2', durationMinutes: 6, passingScore: 60,
    totalQuestions: 5, xpReward: 100, icon: '🔷',
    createdBy: 'tea-001', createdAt: '2024-05-20',
    questions: [
      { id: 'q1', text: 'How many sides does a triangle have?', type: 'mcq', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'A triangle has 3 sides! Tri means three!', points: 20 },
      { id: 'q2', text: 'A circle has ___ corners?', type: 'mcq', options: ['0', '1', '2', '4'], correctAnswer: '0', explanation: 'A circle has no corners - it is perfectly round!', points: 20 },
      { id: 'q3', text: 'A square has how many equal sides?', type: 'mcq', options: ['2', '3', '4', '6'], correctAnswer: '4', explanation: 'A square has 4 equal sides and 4 right angles!', points: 20 },
      { id: 'q4', text: 'Which shape does a ball look like?', type: 'mcq', options: ['Cube', 'Cylinder', 'Sphere', 'Cone'], correctAnswer: 'Sphere', explanation: 'A ball is shaped like a sphere - perfectly round in 3D!', points: 20 },
      { id: 'q5', text: 'A rectangle has ___ sides.', type: 'mcq', options: ['3', '4', '5', '6'], correctAnswer: '4', explanation: 'A rectangle has 4 sides - 2 long and 2 short!', points: 20 },
    ],
  },
  {
    id: 'qz-010', topicId: 'top-e04', subjectId: 'sub-eng', title: 'Verbs in Action!',
    description: 'Test your knowledge of verbs and tenses!',
    difficulty: 'medium', grade: '4', durationMinutes: 10, passingScore: 60,
    totalQuestions: 5, xpReward: 140, icon: '🏃',
    createdBy: 'tea-002', createdAt: '2024-05-22',
    questions: [
      { id: 'q1', text: 'Which word is a VERB? "She sings beautifully."', type: 'mcq', options: ['She', 'sings', 'beautifully', 'She sings'], correctAnswer: 'sings', explanation: '"Sings" is a verb - it is the action in the sentence!', points: 20 },
      { id: 'q2', text: '"I ___ to school yesterday." (past tense of "go")', type: 'mcq', options: ['go', 'going', 'went', 'gone'], correctAnswer: 'went', explanation: '"Went" is the past tense of "go"!', points: 20 },
      { id: 'q3', text: 'Which sentence is in PRESENT tense?', type: 'mcq', options: ['She ran fast', 'He will play', 'They are eating', 'We had lunch'], correctAnswer: 'They are eating', explanation: '"They are eating" is in the present continuous tense!', points: 20 },
      { id: 'q4', text: '"She ___ her homework now."', type: 'mcq', options: ['did', 'is doing', 'done', 'will did'], correctAnswer: 'is doing', explanation: '"Is doing" is correct for an action happening right now!', points: 20 },
      { id: 'q5', text: 'The future tense of "eat" is?', type: 'mcq', options: ['ate', 'eaten', 'will eat', 'eating'], correctAnswer: 'will eat', explanation: '"Will eat" is the future tense - something that will happen!', points: 20 },
    ],
  },
]

export const getQuizById = (id) => quizzes.find(q => q.id === id)
export const getQuizzesBySubject = (subjectId) => quizzes.filter(q => q.subjectId === subjectId)
export const getQuizzesByTopic = (topicId) => quizzes.filter(q => q.topicId === topicId)

export default quizzes
