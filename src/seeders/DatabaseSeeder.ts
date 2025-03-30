import { Response, Request } from "express"
import FormSeeder from "./form/FormSeeder";
import QuestionSeeder from "./question/QuestionSeeder";

class DatabaseSeeder
{

    public async run (req: Request, res: Response): Promise<Response>
    {
        try {
            const parsedTotalForm: number = parseInt(req.body.total_form as string, 10) ?? 0;
            const parsedTotalQuestion: number = parseInt(req.body.total_question as string, 10) ?? 0;

            // seeder
            await FormSeeder.seed(parsedTotalForm);
            await QuestionSeeder.seed(parsedTotalQuestion);

            console.log('✅ seeding completed.');

            return res.status(201).json({
                status: true,
                message: `seeding completed.`
            });
        } catch (error) {
            console.log('❌ seeding failed.');

            return res.status(500).json({
                status: false,
                message: `failed to seed database: ${error}`
            });
        } finally {
            console.log('🔚seeding process ended.');
        }
    }

}

export default new DatabaseSeeder;