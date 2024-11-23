import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { set } from 'date-fns'


const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await prisma.game.deleteMany();
    await prisma.speedrun.deleteMany();
    await prisma.speedrunEvent.deleteMany();



    const superMario = await prisma.game.create({ data: {
            name: 'Super Mario',
            genre: 'Platformer',
            description: 'A classic platforming game where you save the princess.',
            releaseDate: new Date('1985-09-13'),
        }
    });

    const anyPercent = await prisma.category.create({
        data: {
            name: 'Any%',
            description: 'Complete the game as fast as possible without restrictions.',
            game: { connect: { id: superMario.id }},
        },
        include: { game: true },
    });


//     const user1 = await prisma.user.create({
//         username: 'PlayerOne',
//         email: 'playerone@example.com',
//         password: 'securepassword123',
//         signUpDate: '2024-11-11',
//         role: 'User',
//     });
}