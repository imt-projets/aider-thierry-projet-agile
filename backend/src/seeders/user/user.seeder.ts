import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities"; 


export class UserSeeder extends Seeder {
    async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(entities.User);
    const commentRepository = dataSource.getRepository(entities.Comment);


    const comment1 = commentRepository.create({
      content: "Premier commentaire !",
      date: new Date()
    })

    const comment2 = commentRepository.create({
      content: "Deuxième commentaire !",
      date: new Date()
    })

    const comment3 = commentRepository.create({
      content: "Troisième commentaire !",
      date: new Date()
    })


    await commentRepository.save([comment1,comment2,comment3]);

    const users = [
      userRepository.create({
        firstname: "Alice",
        lastname: "Dupont",
        email: "alice.dupont@example.com",
        password: "Password123!",
        comments: [
          comment1
        ]
      }),
      userRepository.create({
        firstname: "Bob",
        lastname: "Martin",
        email: "bob.martin@example.com",
        password: "SecurePass456!",
        comments: [
          comment2
        ]
      }),
      userRepository.create({
        firstname: "Claire",
        lastname: "Durand",
        email: "claire.durand@example.com",
        password: "MySecret789!",
        comments: []
      })
    ];

    await userRepository.save(users)

    console.log("Utilisateurs et commentaires insérés avec succès !");
  }
}
