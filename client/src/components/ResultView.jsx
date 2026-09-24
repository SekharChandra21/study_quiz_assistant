import { useState } from "react";

import StudyHeader from "./StudyHeader";
import ViewTabs from "./ViewTabs";
import FlashcardDeck from "./FlashcardDeck";
import QuizView from "./QuizView";

function ResultView({ studySet }) {
  const [activeView, setActiveView] = useState("flashcards");

  return (
    <section className="study-result">
      <StudyHeader studySet={studySet} />

      <ViewTabs
        activeView={activeView}
        onChange={setActiveView}
      />

      {activeView === "flashcards" && (
        <FlashcardDeck cards={studySet.cards} />
      )}

      {activeView === "quiz" && (
        <QuizView questions={studySet.quiz} />
      )}
    </section>
  );
}

export default ResultView;