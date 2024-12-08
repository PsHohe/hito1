import seedStudents from "./student.seeder";
import seedUsers from "./user.seeder";

const seedDatabase = async (): Promise<void> => {
    console.log('Seeding database...');
    try {
        await seedStudents(10);
        await seedUsers();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

export default seedDatabase;