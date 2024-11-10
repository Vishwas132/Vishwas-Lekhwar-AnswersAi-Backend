module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure the schema exists
    await queryInterface.createSchema("answersai_dev");

    // Create users table in the specific schema
    await queryInterface.createTable(
      {
        tableName: "users",
        schema: "answersai_dev",
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }
    );

    // Add index on email for faster lookups
    await queryInterface.addIndex(
      {
        tableName: "users",
        schema: "answersai_dev",
      },
      ["email"],
      {
        name: "users_email_idx",
        unique: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      tableName: "users",
      schema: "answersai_dev",
    });
  },
};
