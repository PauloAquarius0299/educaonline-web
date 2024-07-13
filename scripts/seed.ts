const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Limpar todas as tabelas existentes antes de inserir novos dados
    await database.course.deleteMany();
    await database.subCategory.deleteMany();
    await database.category.deleteMany();
    await database.level.deleteMany();
    
    const categories = [
      {
        name: "TI & Software",
        subCategories: {
          create: [
            { name: "Desenvolvimento Web" },
            { name: "Ciencias de Dados" },
            { name: "Cybersecurity" },
            { name: "Outros" },
          ],
        },
      },
      {
        name: "Adminstração",
        subCategories: {
          create: [
            { name: "E-Commerce" },
            { name: "Marketing" },
            { name: "Finanças" },
            { name: "Outros" },
          ],
        },
      },
      {
        name: "Design",
        subCategories: {
          create: [
            { name: "Design Grafico" },
            { name: "3D e Animação" },
            { name: "Desgin de Interior" },
            { name: "Outros" },
          ],
        },
      },
      {
        name: "Saude",
        subCategories: {
          create: [
            { name: "Musculação" },
            { name: "Yoga" },
            { name: "Nutrição" },
            { name: "Outros" },
          ],
        },
      },
    ];

    // Sequentially create each category with its subcategories
    for (const category of categories) {
      await database.category.create({
        data: {
          name: category.name,
          subCategories: category.subCategories,
        },
        include: {
          subCategories: true,
        },
      });
    }

    await database.level.createMany({
      data: [
        { name: "Inicial" },
        { name: "Intermediario" },
        { name: "Experiente" },
        { name: "Nivel Alto" },
      ],
      //skipDuplicates: true, 
    });

    console.log("Seeding successfully");
  } catch (error) {
    console.log("Seeding failed", error);
  } finally {
    await database.$disconnect();
  }
}

main();