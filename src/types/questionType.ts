export type QuestionOptions = {
    id: number,
    option: string,
};

export type QuestionForm = {
    id: number,
    form_id: string,
    question: string,
    answers: {
        value: string
    }[],
};

export type AnswerQuestion = {
    value: string,
};