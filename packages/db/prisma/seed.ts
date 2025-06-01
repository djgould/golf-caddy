import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.shot.deleteMany();
  await prisma.round.deleteMany();
  await prisma.hole.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'tiger@example.com',
        name: 'Tiger Woods',
        handicap: 0,
        profileImage: 'https://example.com/tiger.jpg',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Doe',
        handicap: 15.5,
        profileImage: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        handicap: 8.2,
        profileImage: null,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Pebble Beach Golf Links
  const pebbleBeach = await prisma.course.create({
    data: {
      name: 'Pebble Beach Golf Links',
      description:
        'One of the most famous golf courses in the world, featuring stunning ocean views',
      location: {
        type: 'Point',
        coordinates: [-121.9508, 36.5686], // Longitude, Latitude
      },
      bounds: {
        type: 'Polygon',
        coordinates: [
          [
            [-121.955, 36.565],
            [-121.955, 36.572],
            [-121.946, 36.572],
            [-121.946, 36.565],
            [-121.955, 36.565],
          ],
        ],
      },
      address: '1700 17 Mile Dr',
      city: 'Pebble Beach',
      state: 'CA',
      country: 'USA',
      phone: '(831) 574-5609',
      website: 'https://www.pebblebeach.com',
      rating: 75.5,
      slope: 145,
    },
  });

  // Pebble Beach holes data with realistic GPS coordinates
  const pebbleBeachHoles = [
    {
      hole: 1,
      par: 4,
      yardage: 381,
      handicap: 8,
      tee: [-121.9492, 36.5681],
      green: [-121.9478, 36.5669],
    },
    {
      hole: 2,
      par: 5,
      yardage: 516,
      handicap: 12,
      tee: [-121.9476, 36.5666],
      green: [-121.9451, 36.5654],
    },
    {
      hole: 3,
      par: 4,
      yardage: 390,
      handicap: 16,
      tee: [-121.9448, 36.5651],
      green: [-121.9462, 36.5641],
    },
    {
      hole: 4,
      par: 4,
      yardage: 331,
      handicap: 14,
      tee: [-121.9464, 36.5639],
      green: [-121.9481, 36.5632],
    },
    {
      hole: 5,
      par: 3,
      yardage: 188,
      handicap: 18,
      tee: [-121.9483, 36.563],
      green: [-121.9497, 36.5625],
    },
    {
      hole: 6,
      par: 5,
      yardage: 523,
      handicap: 2,
      tee: [-121.9499, 36.5623],
      green: [-121.9523, 36.5635],
    },
    {
      hole: 7,
      par: 3,
      yardage: 106,
      handicap: 10,
      tee: [-121.9525, 36.5637],
      green: [-121.9531, 36.5641],
    },
    {
      hole: 8,
      par: 4,
      yardage: 428,
      handicap: 4,
      tee: [-121.9533, 36.5643],
      green: [-121.9548, 36.5656],
    },
    {
      hole: 9,
      par: 4,
      yardage: 466,
      handicap: 6,
      tee: [-121.9546, 36.5658],
      green: [-121.9522, 36.5668],
    },
    {
      hole: 10,
      par: 4,
      yardage: 446,
      handicap: 1,
      tee: [-121.952, 36.567],
      green: [-121.9535, 36.5682],
    },
    {
      hole: 11,
      par: 4,
      yardage: 380,
      handicap: 11,
      tee: [-121.9537, 36.5684],
      green: [-121.9522, 36.5692],
    },
    {
      hole: 12,
      par: 3,
      yardage: 202,
      handicap: 15,
      tee: [-121.952, 36.5694],
      green: [-121.9506, 36.5701],
    },
    {
      hole: 13,
      par: 4,
      yardage: 399,
      handicap: 3,
      tee: [-121.9504, 36.5703],
      green: [-121.9486, 36.5695],
    },
    {
      hole: 14,
      par: 5,
      yardage: 573,
      handicap: 9,
      tee: [-121.9484, 36.5693],
      green: [-121.9458, 36.5681],
    },
    {
      hole: 15,
      par: 4,
      yardage: 397,
      handicap: 13,
      tee: [-121.9456, 36.5679],
      green: [-121.9472, 36.5669],
    },
    {
      hole: 16,
      par: 4,
      yardage: 402,
      handicap: 5,
      tee: [-121.9474, 36.5667],
      green: [-121.9488, 36.5659],
    },
    {
      hole: 17,
      par: 3,
      yardage: 208,
      handicap: 17,
      tee: [-121.949, 36.5657],
      green: [-121.9504, 36.565],
    },
    {
      hole: 18,
      par: 5,
      yardage: 543,
      handicap: 7,
      tee: [-121.9506, 36.5648],
      green: [-121.9492, 36.5682],
    },
  ];

  // Create holes for Pebble Beach
  const holes = await Promise.all(
    pebbleBeachHoles.map((holeData) =>
      prisma.hole.create({
        data: {
          courseId: pebbleBeach.id,
          holeNumber: holeData.hole,
          par: holeData.par,
          yardage: holeData.yardage,
          handicap: holeData.handicap,
          teeLocation: {
            type: 'Point',
            coordinates: holeData.tee,
          },
          greenLocation: {
            type: 'Point',
            coordinates: holeData.green,
          },
          description: `Hole ${holeData.hole} at Pebble Beach`,
        },
      })
    )
  );

  console.log(`✅ Created ${holes.length} holes for Pebble Beach`);

  // Create a sample round for John Doe
  const round = await prisma.round.create({
    data: {
      userId: users[1]!.id, // John Doe
      courseId: pebbleBeach.id,
      startTime: new Date('2024-06-01T08:00:00Z'),
      endTime: new Date('2024-06-01T12:30:00Z'),
      weather: 'Partly Cloudy',
      temperature: 68,
      windSpeed: 12,
      windDirection: 'SW',
      score: 87,
    },
  });

  // Create sample shots for first 3 holes
  const sampleShots = [
    // Hole 1 - Par 4
    {
      roundId: round.id,
      userId: users[1]!.id,
      holeId: holes[0]!.id,
      shotNumber: 1,
      club: 'Driver',
      distance: 250,
      startLocation: { type: 'Point', coordinates: pebbleBeachHoles[0]!.tee },
      endLocation: { type: 'Point', coordinates: [-121.9485, 36.5675] },
      result: 'fairway',
    },
    {
      roundId: round.id,
      userId: users[1]!.id,
      holeId: holes[0]!.id,
      shotNumber: 2,
      club: '8 Iron',
      distance: 135,
      startLocation: { type: 'Point', coordinates: [-121.9485, 36.5675] },
      endLocation: { type: 'Point', coordinates: [-121.9478, 36.5669] },
      result: 'green',
    },
    // Hole 2 - Par 5
    {
      roundId: round.id,
      userId: users[1]!.id,
      holeId: holes[1]!.id,
      shotNumber: 1,
      club: 'Driver',
      distance: 240,
      startLocation: { type: 'Point', coordinates: pebbleBeachHoles[1]!.tee },
      endLocation: { type: 'Point', coordinates: [-121.9465, 36.566] },
      result: 'rough',
    },
    {
      roundId: round.id,
      userId: users[1]!.id,
      holeId: holes[1]!.id,
      shotNumber: 2,
      club: '3 Wood',
      distance: 210,
      startLocation: { type: 'Point', coordinates: [-121.9465, 36.566] },
      endLocation: { type: 'Point', coordinates: [-121.9455, 36.5656] },
      result: 'fairway',
    },
    {
      roundId: round.id,
      userId: users[1]!.id,
      holeId: holes[1]!.id,
      shotNumber: 3,
      club: 'Pitching Wedge',
      distance: 85,
      startLocation: { type: 'Point', coordinates: [-121.9455, 36.5656] },
      endLocation: { type: 'Point', coordinates: [-121.9451, 36.5654] },
      result: 'green',
    },
  ];

  await prisma.shot.createMany({
    data: sampleShots,
  });

  console.log(`✅ Created ${sampleShots.length} sample shots`);

  // Create Torrey Pines South Course
  const torreyPines = await prisma.course.create({
    data: {
      name: 'Torrey Pines Golf Course - South',
      description:
        'Host of the Farmers Insurance Open, offering dramatic views of the Pacific Ocean',
      location: {
        type: 'Point',
        coordinates: [-117.2513, 32.9006],
      },
      address: '11480 N Torrey Pines Rd',
      city: 'La Jolla',
      state: 'CA',
      country: 'USA',
      phone: '(858) 452-3226',
      website: 'https://www.sandiego.gov/park-and-recreation/golf/torreypines',
      rating: 78.8,
      slope: 143,
    },
  });

  console.log('✅ Created Torrey Pines South Course');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
