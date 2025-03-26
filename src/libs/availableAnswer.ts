import { FormWithQuestions } from "../types/formType";
import { PayloadAnswer, PayloadQuestionAnswers } from '../types/payloadType';
import { Question } from "@prisma/client";

export const availableAnswer = (form: FormWithQuestions, payload: PayloadQuestionAnswers[]): boolean =>
{
    const answerTypes: string[] = [ 'dropdown', 'radio' ];

    const foundAnswer = form.questions.filter((question: Question) => {
        if (answerTypes.includes(question?.type)) {
            
            const answer = payload.find((p: PayloadQuestionAnswers) => p.question_id === question?.id);
            if (answer) {
                const optionsArray = Array.isArray(question?.options) ? question.options : [];
                const option = optionsArray.find((opt: any) => {
                    return opt.option === answer.answer;
                });
                
                if (option === undefined) return true;
            }
            
        }
    });

    return foundAnswer.length > 0 ? true : false;
}