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

    console.log('Seeding database...');


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


    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('user1', 12),
            signUpDate: new Date(),
            role: 'User',
        }
    });
}


(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();