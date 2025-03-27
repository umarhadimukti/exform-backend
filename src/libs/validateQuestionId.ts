import { Question } from "@prisma/client";
import { FormWithQuestions } from "../types/formType";
import { PayloadQuestionAnswers } from "../types/payloadType";

export const validateQuestionId = (form: FormWithQuestions, payload: PayloadQuestionAnswers[]): boolean =>
{
    const foundAnswer = payload.filter((data: PayloadQuestionAnswers) => {
        const question = form.questions.some((question: Question) => {
            return question.id === data.question_id;
        });

        if (!question) return true;
    });

    return foundAnswer.length > 0 ? false : true;
}