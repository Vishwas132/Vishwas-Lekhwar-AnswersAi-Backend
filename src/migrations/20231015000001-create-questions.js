module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "questions",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        metadata: {
          type: Sequelize.JSONB,
          defaultValue: {},
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
      },
      {
        schema: "answersai_dev", // Add schema specification here
        tableName: "questions", // Explicitly set table name
      }
    );

    // Add indexes for better query performance
    await queryInterface.addIndex(
      {
        schema: "answersai_dev",
        tableName: "questions",
      },
      ["userId"],
      {
        name: "questions_user_id_idx",
      }
    );

    await queryInterface.addIndex(
      {
        schema: "answersai_dev",
        tableName: "questions",
      },
      ["createdAt"],
      {
        name: "questions_created_at_idx",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("questions");
  },
};
