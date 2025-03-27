import { Question } from "@prisma/client";
import { FormWithQuestions } from "../types/formType";
import { PayloadQuestionAnswers } from "../types/payloadType";

export const validateEmail = (form: FormWithQuestions, payload: PayloadQuestionAnswers[]) =>
{
    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const filteredQuestions = form.questions.filter((question: Question) => {
        if (question.type === 'email') {
            // search answer that's belong to the question
            const answer = payload.find((data: any) => data.question_id === question.id);
            if (answer) {
                // if email is matches with regex, return true
                if (!answer.answer.match(validEmailRegex)) {
                    return true;
                }
            }
        }
    });

    return filteredQuestions.length > 0 ? false : true;

}