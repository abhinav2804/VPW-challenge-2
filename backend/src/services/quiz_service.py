"""Quiz service for grading and processing voter registration quizzes."""

from src.schemas.quiz import QuizGradeRequest, QuizGradeResponse, QuizDetailedResult
from src.utils.data_loader import load_json


def grade_quiz_submission(payload: QuizGradeRequest) -> QuizGradeResponse:
    """Grade a quiz submission against the official question bank."""
    bank = load_json("quiz_questions.json")

    # Index questions by ID for O(1) lookup
    bank_index = {q["id"]: q for q in bank}

    score = 0
    max_score = len(payload.question_ids)
    detailed = []

    for qid, user_answer in zip(payload.question_ids, payload.answers):
        q_data = bank_index.get(qid)
        if not q_data:
            detailed.append(
                QuizDetailedResult(
                    questionId=qid,
                    correct=False,
                    explanation=f"Question '{qid}' not found in the quiz bank.",
                )
            )
            continue

        is_correct = user_answer.strip().lower() == q_data["correctAnswer"].strip().lower()
        if is_correct:
            score += 1

        detailed.append(
            QuizDetailedResult(
                questionId=qid,
                correct=is_correct,
                explanation=q_data.get("explanation", ""),
            )
        )

    return QuizGradeResponse(score=score, maxScore=max_score, detailed=detailed)
