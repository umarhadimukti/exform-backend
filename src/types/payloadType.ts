export type PayloadQuestionAnswers = {
    question_id: number,
    answer: string,
};

export type PayloadAnswer = {
    user_id: number,
    form_id: number,
    question_id: number,
    value: string,
};