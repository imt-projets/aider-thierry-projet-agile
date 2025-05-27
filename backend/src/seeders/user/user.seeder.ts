import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities"; 


export class UserSeeder extends Seeder {
    async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(entities.User);
    const commentRepository = dataSource.getRepository(entities.Comment);

    const usersData = [
      {
        firstname: "Alice",
        lastname: "Dupont",
        email: "alice.dupont@example.com",
        password: "Password123!",
        comments: [
          { content: "Super article !" },
          { content: "Merci pour le partage." }
        ]
      },
      {
        firstname: "Bob",
        lastname: "Martin",
        email: "bob.martin@example.com",
        password: "SecurePass456!",
        comments: [
          { content: "Très intéressant." }
        ]
      },
      {
        firstname: "Claire",
        lastname: "Durand",
        email: "claire.durand@example.com",
        password: "MySecret789!",
        comments: []
      }
    ];

    for (const userData of usersData) {
      const { comments, ...userFields } = userData;
      const user = userRepository.create(userFields);
      await userRepository.save(user);

      for (const commentData of comments) {
        const comment = commentRepository.create({
          ...commentData,
          user: user
        });
        await commentRepository.save(comment);
      }
    }

    console.log("Utilisateurs et commentaires insérés avec succès !");
  }
}
