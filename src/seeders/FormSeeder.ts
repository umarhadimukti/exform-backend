import { faker } from "@faker-js/faker";
import { FormSeeder as FormSeederType } from '../types/formType';
import { prisma } from "../db/connection";
import AuthService from "../libs/services/AuthService";
import { User } from "@prisma/client";

class FormSeeder
{

    public factory(userId: number): FormSeederType
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

    public async seed(counter: number = 10)
    {
        console.log('🌱 start seeding form seeder..');

        let users: User[] = await prisma.user.findMany();
        if (users.length === 0) {
            console.log('no user found, starting create new default user..');

            const authService = new AuthService();
            const defaultUser = await prisma.user.create({
                data: {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john_doe@gmail.com',
                    password: await authService.hashPassword('test1234'),
                    role_id: 1,
                }
            });

            users = [defaultUser];
        }

        for (let i = 0; i < counter; i++) {
            // get random user
            const user = users[Math.floor(Math.random() * users.length)];

            // common's form type
            const formTypes: string[] = [
                'Customer Survey',
                'Feedback Form',
                'Registration Form',
                'Contact Form',
                'Application Form'
              ];

        }
        
    }
}

export default new FormSeeder;