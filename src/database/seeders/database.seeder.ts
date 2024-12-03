import seedStudents from "./student.seeder";
import seedUsers from "./user.seeder";


const seedDatabase = (): void => {
    console.log('Seeding database...');
    seedStudents(10);
    seedUsers();
    console.log('Database seeded successfully');
};

export default seedDatabase;