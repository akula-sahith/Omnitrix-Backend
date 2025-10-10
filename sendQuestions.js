import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const questions = [
  // 🌐 Web Development (1–10)
  {
    questionText: "If a website loads faster on your friend’s laptop but not yours, what’s most likely to blame?",
    options: ["Your Wi-Fi speed", "CSS files rebelling", "Browser cache", "Your laptop judging you"],
    correctAnswer: "Your Wi-Fi speed"
  },
  {
    questionText: "What happens if you nest 10 <div>s inside each other with no CSS?",
    options: ["It creates a black hole", "Browser cries quietly", "Infinite white boxes", "Perfectly valid layout"],
    correctAnswer: "Perfectly valid layout"
  },
  {
    questionText: "Which of these CSS properties can instantly ruin your design if misused?",
    options: ["z-index", "border-radius", "color", "display"],
    correctAnswer: "z-index"
  },
  {
    questionText: "JavaScript’s NaN stands for:",
    options: ["Not a Number", "Not a Name", "No actual Need", "Nearly a Null"],
    correctAnswer: "Not a Number"
  },
  {
    questionText: "Which of the following is a REAL tag that was used in early HTML for moving text?",
    options: ["<marquee>", "<scroll>", "<slide>", "<run>"],
    correctAnswer: "<marquee>"
  },
  {
    questionText: "What’s the first thing you usually do when your CSS 'doesn’t work'?",
    options: ["Add !important", "Blame HTML", "Refresh the browser", "Cry and open Stack Overflow"],
    correctAnswer: "Refresh the browser"
  },
  {
    questionText: "Which HTTP code basically says 'the page you’re looking for went on vacation'?",
    options: ["400", "401", "403", "404"],
    correctAnswer: "404"
  },
  {
    questionText: "React’s Virtual DOM can best be described as:",
    options: ["HTML’s ghost twin", "A debugging illusion", "Browser hallucination", "None of these"],
    correctAnswer: "HTML’s ghost twin"
  },
  {
    questionText: "Which JavaScript concept allows functions to remember their scope even after execution?",
    options: ["Promises", "Closures", "Callbacks", "Recursion"],
    correctAnswer: "Closures"
  },
  {
    questionText: "If your website suddenly shows white text on white background, you have achieved:",
    options: ["Minimalism", "Ghost mode", "CSS Invisibility", "User rage"],
    correctAnswer: "User rage"
  },

  // 💻 Programming & DSA (11–20)
  {
    questionText: "You write a function that calls itself endlessly without a base case. What happens first?",
    options: ["Infinite loop", "Stack overflow", "Memory leak", "CPU explosion"],
    correctAnswer: "Stack overflow"
  },
  {
    questionText: "What’s the fastest way to check if a number n is a power of 2 in most languages?",
    options: ["n % 2 == 0 repeatedly", "log2(n) and check integer", "n & (n-1) == 0", "Trial division"],
    correctAnswer: "n & (n-1) == 0"
  },
  {
    questionText: "A 'race condition' occurs when:",
    options: [
      "Code runs slower on Mondays",
      "Two threads access shared data simultaneously without synchronization",
      "Functions return in random order",
      "Your IDE crashes"
    ],
    correctAnswer: "Two threads access shared data simultaneously without synchronization"
  },
  {
    questionText: "In a min-heap, which operation is always O(log n)?",
    options: ["Insertion", "Find min", "Delete arbitrary node", "Traversal"],
    correctAnswer: "Insertion"
  },
  {
    questionText: "In Python, what’s the difference between is and ==?",
    options: [
      "is compares values, == compares references",
      "is compares references, == compares values",
      "Both are the same",
      "is only works for integers"
    ],
    correctAnswer: "is compares references, == compares values"
  },
  {
    questionText: "Which sorting algorithm is stable by default?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"],
    correctAnswer: "Merge Sort"
  },
  {
    questionText: "You need to remove duplicates from a list while preserving order. Best data structure combo?",
    options: ["Array only", "HashSet only", "LinkedHashSet / OrderedDict", "Stack + Queue"],
    correctAnswer: "LinkedHashSet / OrderedDict"
  },
  {
    questionText: "What’s the worst-case time complexity of searching in a balanced BST?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)"
  },
  {
    questionText: "In JavaScript, which of these can cause unexpected type coercion?",
    options: ["==", "===", "typeof", "Object.is"],
    correctAnswer: "=="
  },
  {
    questionText: "You discover your recursive algorithm is extremely slow for large inputs. What’s the likely fix?",
    options: ["Add print statements", "Memoization / dynamic programming", "More recursion", "Switch to Python 2"],
    correctAnswer: "Memoization / dynamic programming"
  },

  // 👽 Ben 10 Special Round (21–25)
  {
    questionText: "Which alien species does Azmuth belong to?",
    options: ["Galvan", "Galvanic Mechamorph", "Celestialsapien", "Tetramand"],
    correctAnswer: "Galvan"
  },
  {
    questionText: "Who created the Ben 10 series?",
    options: ["Man of Action", "Warner Bros Entertainment", "Cartoon Network", "Azmuth"],
    correctAnswer: "Man of Action"
  },
  {
    questionText: "Which alien’s DNA is so complex it almost corrupted the Omnitrix?",
    options: ["Alien X", "Ghostfreak", "Atomix", "Gravattack"],
    correctAnswer: "Alien X"
  },
  {
    questionText: "What was Azmuth’s true reason for creating the Omnitrix?",
    options: [
      "Promote peace through shared DNA understanding",
      "Preserve universal genetic diversity",
      "Test interspecies empathy",
      "Develop adaptive biological technology"
    ],
    correctAnswer: "Preserve universal genetic diversity"
  },
  {
    questionText: "When Ben turns into Grey Matter, his brain capacity increases by:",
    options: ["10x", "100x", "1000x", "Functionally limitless"],
    correctAnswer: "Functionally limitless"
  },

  // ⚙️ Ben 10 + Programming Fusion (26–30)
  {
    questionText: "What happens if Ben activates the Omnitrix while it’s recalibrating?",
    options: [
      "Random alien transformation",
      "Omnitrix system lockdown",
      "Temporary reboot",
      "DNA memory corruption"
    ],
    correctAnswer: "Random alien transformation"
  },
  {
    questionText: "Why does the Omnitrix sometimes choose the 'wrong' alien?",
    options: ["User intent misread", "DNA sequence interference", "Recalibration lag", "Signal translation error"],
    correctAnswer: "User intent misread"
  },
  {
    questionText: "If Kevin 11 absorbed the source code of the Omnitrix, what would likely happen?",
    options: [
      "He rewrites alien algorithms",
      "He merges with Omnitrix AI",
      "He destabilizes DNA architecture",
      "He corrupts Omnitrix firmware"
    ],
    correctAnswer: "He destabilizes DNA architecture"
  },
  {
    questionText: "When Ben transforms into Grey Matter, his intelligence boost could be compared to:",
    options: [
      "Overclocked processor",
      "Neural hyper-threading",
      "Exponential logic recursion",
      "Predictive AI scaling"
    ],
    correctAnswer: "Overclocked processor"
  },
  {
    questionText: "Which alien’s biology best represents multithreading in computing?",
    options: ["Echo Echo", "Ditto", "Nanomech", "Jury Rigg"],
    correctAnswer: "Echo Echo"
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log("✅ All 30 quiz questions seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
};

seedQuestions();
