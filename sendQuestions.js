import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const questions = [
  {
    questionText: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Marketing Language",
      "Hyper Transfer Markup Language"
    ],
    correctAnswer: "Hyper Text Markup Language"
  },
  {
    questionText: "Which data structure uses FIFO order?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue"
  },
  {
    questionText: "Which company developed Java?",
    options: ["Microsoft", "Sun Microsystems", "Google", "Apple"],
    correctAnswer: "Sun Microsystems"
  },
  {
    questionText: "Which layer of the OSI model handles routing?",
    options: ["Network Layer", "Transport Layer", "Session Layer", "Application Layer"],
    correctAnswer: "Network Layer"
  },
  {
    questionText: "Which Ben 10 alien has super speed?",
    options: ["Four Arms", "XLR8", "Heatblast", "Diamondhead"],
    correctAnswer: "XLR8"
  },
  {
    questionText: "Who created the Omnitrix?",
    options: ["Azmuth", "Vilgax", "Max Tennyson", "Kevin Levin"],
    correctAnswer: "Azmuth"
  },
  {
    questionText: "Which alien can manipulate fire?",
    options: ["Diamondhead", "Heatblast", "Grey Matter", "Echo Echo"],
    correctAnswer: "Heatblast"
  }
  // add up to 30 total
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log("✅ Quiz questions seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
};

seedQuestions();
