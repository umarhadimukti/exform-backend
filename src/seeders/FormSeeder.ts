import { faker } from "@faker-js/faker";
import { FormSeeder as FormSeederType } from '../types/formType';

class FormSeeder
{

    public async factory(userId: number): Promise<FormSeederType>
    {
        const inviteCount = faker.number.int({ min: 0, max: 5 });
        const invites = Array.from({ length: inviteCount }, () => faker.internet.email());

        return {
            title: faker.lorem.sentence({ min: 3, max: 8 }).replace('.', ''),
            description: faker.datatype.boolean(0.8) ? faker.lorem.paragraph(2) : null,
            is_public: faker.datatype.boolean(0.7),
            invites,
            user_id: userId,
        }
    }

}