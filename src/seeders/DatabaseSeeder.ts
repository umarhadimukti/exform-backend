import { Response, Request } from "express"
import FormSeeder from "./form/FormSeeder";

class DatabaseSeeder
{

    public async run (req: Request, res: Response): Promise<Response>
    {
        try {
            const parsedTotalData: number = parseInt(req.query.total as string, 10) ?? 0;

            await FormSeeder.seed(parsedTotalData);

            return res.status(201).json({
                status: true,
                message: `seeding completed.`
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: `failed to seed database: ${error}`
            });
        }
    }

}

export default new DatabaseSeeder;