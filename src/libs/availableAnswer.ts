import { FormWithQuestions } from "../types/formType";
import { PayloadQuestionAnswers } from '../types/payloadType';
import { Question } from "@prisma/client";

export const availableAnswer = (form: FormWithQuestions, payload: PayloadQuestionAnswers[]): boolean =>
{
    const singleChoose: string[] = [ 'dropdown', 'radio' ];
    const multipleChoose: string[] = [ 'checkbox' ];

    const foundQuestion = form.questions.filter((question: Question) => {
        if (singleChoose.includes(question?.type)) {
            
            const answer = payload.find((p: PayloadQuestionAnswers) => p.question_id === question?.id);
            if (answer) {
                const optionsArray = Array.isArray(question?.options) ? question.options : [];
                const option = optionsArray.find((opt: any) => {
                    return opt.option === answer.answer;
                });
                
                if (option === undefined) return true;
            }

        } else if (multipleChoose.includes(question?.type)) {
            const answer = payload.find((p: PayloadQuestionAnswers) => p.question_id === question?.id);

            if (answer) {
                const optionsArray = Array.isArray(question?.options) ? question.options : [];
                const answerArray = Array.isArray(answer.answer) ? answer.answer : [];
                return answerArray.some((ans: string) => {
                    const option = optionsArray.find((opt: any) => {
                        return opt.option === ans;
                    });

                    if (option === undefined) return true;
                });
            }
        }
    });

    return foundQuestion.length > 0 ? true : false;
}