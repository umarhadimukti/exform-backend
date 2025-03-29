import { faker } from "@faker-js/faker";
import { FormSeeder as FormSeederType } from '../../types/formType';
import { prisma } from "../../db/connection";
import AuthService from "../../libs/services/AuthService";
import { User } from "@prisma/client";

class FormSeeder
{

    public factory(userId: number)
    {
        
        // common's form type
        const formTypes: string[] = [
            'Customer Survey',
            'Feedback Form',
            'Registration Form',
            'Contact Form',
            'Application Form'
          ];

        // create forms
        const formType = faker.helpers.arrayElement(formTypes);

        // create random invites
        const inviteCount = faker.number.int({ min: 0, max: 5 });
        const invites = Array.from({ length: inviteCount }, () => {
            const sex = faker.person.sexType();
            const firstName = faker.person.firstName(sex);
            const lastName = faker.person.lastName();
            return faker.internet.email({ firstName, lastName })
        });
        

        return {
            data: {
                title: `${formType}: ${faker.company.name()}`,
                description: faker.datatype.boolean(0.8) ? faker.lorem.paragraph(2) : null,
                is_public: faker.datatype.boolean(0.7),
                invites,
                user_id: userId,
            }
        }
    }

    public async seed(counter: number = 10)
    {
        try {
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
                
                await prisma.form.create(this.factory(user.id));
            }

            console.log('✅ seeding completed.');
        } catch (error) {
            console.log('❌ seeding failed\n' + error)
            throw error;
        } finally {
            console.log('🔚 seeding process ended.')
            await prisma.$disconnect();
        }
        
    }
}

export default new FormSeeder;