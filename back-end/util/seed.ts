import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { set } from 'date-fns'


const prisma = new PrismaClient();

const main = async () => {
    await prisma.speedrun.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await prisma.game.deleteMany();
    await prisma.speedrunEvent.deleteMany();

    console.log('Seeding database...');


    const superMario = await prisma.game.create({ data: {
            name: 'Super Mario',
            genre: 'Platformer',
            description: 'A classic platforming game where you save the princess.',
            releaseDate: new Date('1985-09-13'),
        }
    });
    const legendOfZelda = await prisma.game.create({
        data: {
            name: 'The Legend of Zelda',
            genre: 'Action-Adventure',
            description: 'An epic adventure to save Princess Zelda and defeat Ganon.',
            releaseDate: new Date('1986-02-21'),
        },
    });
    const pacMan = await prisma.game.create({
        data: {
            name: 'Pac-Man',
            genre: 'Arcade',
            description: 'A maze arcade game where you eat dots and avoid ghosts.',
            releaseDate: new Date('1980-05-22'),
        },
    });
    const donkeyKong = await prisma.game.create({
        data: {
            name: 'Donkey Kong',
            genre: 'Platformer',
            description: 'A platforming game where you save Pauline from Donkey Kong.',
            releaseDate: new Date('1981-07-09'),
        },
    });
    const sonicTheHedgehog = await prisma.game.create({
        data: {
            name: 'Sonic the Hedgehog',
            genre: 'Platformer',
            description: 'A fast-paced platformer where you battle Dr. Robotnik to save animals.',
            releaseDate: new Date('1991-06-23'),
        },
    });
    const tetris = await prisma.game.create({
        data: {
            name: 'Tetris',
            genre: 'Puzzle',
            description: 'A tile-matching puzzle game where you arrange falling blocks.',
            releaseDate: new Date('1984-06-06'),
        },
    });
    const streetFighterII = await prisma.game.create({
        data: {
            name: 'Street Fighter II',
            genre: 'Fighting',
            description: 'A classic fighting game featuring iconic characters and combos.',
            releaseDate: new Date('1991-03-23'),
        },
    });
    const finalFantasyVII = await prisma.game.create({
        data: {
            name: 'Final Fantasy VII',
            genre: 'Role-Playing Game (RPG)',
            description: 'An epic RPG following Cloud Strife in a battle against the Shinra Corporation.',
            releaseDate: new Date('1997-01-31'),
        },
    });
    const doom = await prisma.game.create({
        data: {
            name: 'Doom',
            genre: 'First-Person Shooter',
            description: 'A groundbreaking FPS where you battle demons on Mars.',
            releaseDate: new Date('1993-12-10'),
        },
    });


    const anyPercent = await prisma.category.create({
        data: {
            name: 'Any%',
            description: 'Complete the game as fast as possible without restrictions.',
            game: { connect: { id: superMario.id }},
        },
        include: { game: true },
    });

    const oneTwentyStar = await prisma.category.create({
        data: {
            name: '120 Star',
            description: 'Collect all 120 stars and complete the game.',
            game: { connect: { id: superMario.id }},
        },
        include: { game: true },
    })


    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('user1', 12),
            signUpDate: new Date(),
            role: 'User',
        }
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            email: 'user2@example.com',
            password: await bcrypt.hash('user2', 12),
            signUpDate: new Date(),
            role: 'User',
        }
    });

    const user3 = await prisma.user.create({
        data: {
            username: 'user3',
            email: 'user3@example.com',
            password: await bcrypt.hash('user3', 12),
            signUpDate: new Date(),
            role: 'User',
        }
    });

    const speedrun1 = await prisma.speedrun.create({
        data: {
            time: 5728900,
            videoLink: "https://youtu.be/JoX7RDKRG7Q",
            isValidated: false,
            speedrunner: { connect: { id: user1.id }},
            game: { connect: { id: superMario.id }},
            category: { connect: { id: oneTwentyStar.id }},
        },
        include: {
            validator: true,
            speedrunner: true,
            game: true,
            category: { include: { game: true }},
        },
    })

const superSpeedrunParticipants = [user1, user2, user3];

    const superSpeedruns = await prisma.speedrunEvent.create({ data: {
            name: 'Super Speedruns',
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-01-02'),
            participants: {
                connect: superSpeedrunParticipants.map((user) => ({ id: user.id })), // Connect by ID
              },
        }
    })
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