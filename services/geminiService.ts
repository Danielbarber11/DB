import { QuizData } from "../types";

// We don't need the AI import anymore since the quiz is static
// but we keep the function signature for compatibility

export const generateQuiz = async (topic: string): Promise<QuizData> => {
  // No delay - return immediately for instant transition
  
  // Static data - The Fox Quiz
  const staticQuiz: QuizData = {
    title: "חידון השועלים הגדול",
    description: "בחן את הידע שלך על החיה הערמומית והחכמה ביותר בטבע! האם תצליח לקבל 100?",
    questions: [
      {
        id: "q1",
        text: "לאיזו משפחה ביולוגית משתייך השועל?",
        options: [
          { id: "o1", text: "משפחת הכלביים" },
          { id: "o2", text: "משפחת החתוליים" },
          { id: "o3", text: "משפחת הסמוריים" },
          { id: "o4", text: "משפחת הדוביים" }
        ],
        correctOptionId: "o1"
      },
      {
        id: "q2",
        text: "מהו מין השועל הנפוץ ביותר בעולם (וגם בישראל)?",
        options: [
          { id: "o1", text: "שועל שלג" },
          { id: "o2", text: "שועל מצוי (אדום)" },
          { id: "o3", text: "שועל חולות" },
          { id: "o4", text: "שועל אפור" }
        ],
        correctOptionId: "o2"
      },
      {
        id: "q3",
        text: "למה משמש הזנב המפואר של השועל בעיקר?",
        options: [
          { id: "o1", "text": "לניקוי הגוף" },
          { id: "o2", "text": "לשיווי משקל וחימום הגוף בחורף" },
          { id: "o3", "text": "להרחקת זבובים בלבד" },
          { id: "o4", "text": "לסימון טריטוריה בלבד" }
        ],
        correctOptionId: "o2"
      },
      {
        id: "q4",
        text: "איזה מין של שועל ידוע באוזניו הגדולות במיוחד ביחס לגופו?",
        options: [
          { id: "o1", text: "שועל קוטב" },
          { id: "o2", text: "שועל צוקים" },
          { id: "o3", text: "שועל הפנק" },
          { id: "o4", text: "שועל ערבות" }
        ],
        correctOptionId: "o3"
      },
      {
        id: "q5",
        text: "מהו המאכל העיקרי של השועלים?",
        options: [
          { id: "o1", text: "הם צמחוניים בלבד" },
          { id: "o2", text: "הם אוכלי כל (טורפים וגם פירות/ירקות)" },
          { id: "o3", text: "רק בשר ציד גדול" },
          { id: "o4", text: "דגים בלבד" }
        ],
        correctOptionId: "o2"
      }
    ]
  };

  return staticQuiz;
};