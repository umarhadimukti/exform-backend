import { Question } from "@prisma/client";
import { FormWithQuestions } from "../types/formType";
import { PayloadQuestionAnswers } from "../types/payloadType";

export const requiredButEmpty = async (form: FormWithQuestions, payload: PayloadQuestionAnswers[]): Promise<boolean> =>
{
    const foundQuestion = form.questions.filter((question: Question) => {
        if (question.required) {
            const result = payload.find((p) => p.question_id === question.id);

            if (result?.answer === '' || result?.answer === undefined) {
                return true;
            }
        }
    });

    return foundQuestion.length > 0 ? true : false;
}