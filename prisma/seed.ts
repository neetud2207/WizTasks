/**
 * Development/demo seed data for the Hogwarts Task Ledger.
 * Run with: npm run prisma:seed
 *
 * Creates one demo account so reviewers can log in immediately:
 *   email:    hermione@hogwarts.edu
 *   password: WingardiumLev1osa!
 */
import { PrismaClient, TaskCategory, TaskPriority, TaskStatus, House } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('WingardiumLev1osa!', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'hermione@hogwarts.edu' },
    update: {},
    create: {
      name: 'Hermione Granger',
      email: 'hermione@hogwarts.edu',
      passwordHash,
      house: House.GRYFFINDOR,
    },
  });

  const demoAssignments = [
    {
      title: 'Complete Potion Essay',
      description:
        'Write eighteen inches on the properties of moonstone and its uses in the Draught of Peace.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      category: TaskCategory.POTIONS,
      dueDate: daysFromNow(2),
    },
    {
      title: 'Practice Defensive Charms',
      description: 'Rehearse the Shield Charm and Expelliarmus ahead of next week\'s practical.',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.DEFENSE,
      dueDate: daysFromNow(5),
    },
    {
      title: 'Study Astronomy Notes',
      description: 'Review the movements of Jupiter\'s moons before Friday\'s tower session.',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      category: TaskCategory.ASTRONOMY,
      dueDate: daysFromNow(7),
    },
    {
      title: 'Herbology Assignment',
      description: 'Label the properties of Devil\'s Snare and submit sketches of its anatomy.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.HERBOLOGY,
      dueDate: daysFromNow(-1),
    },
    {
      title: 'Transfiguration Practice',
      description: 'Practice turning a matchstick into a needle; log three successful attempts.',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      category: TaskCategory.TRANSFIGURATION,
      dueDate: daysFromNow(1),
    },
    {
      title: 'Charms Revision',
      description: 'Revisit the Summoning Charm incantation and wand movement diagrams.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.LOW,
      category: TaskCategory.CHARMS,
      dueDate: daysFromNow(4),
    },
  ];

  for (const assignment of demoAssignments) {
    await prisma.task.create({
      data: { ...assignment, userId: demoUser.id },
    });
  }

  console.log('Seed complete. Demo login: hermione@hogwarts.edu / WingardiumLev1osa!');
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
