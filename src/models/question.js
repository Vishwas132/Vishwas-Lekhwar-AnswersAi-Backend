module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      schema: "answersai_dev", // Add schema specification here
      tableName: "questions", // Explicitly set table name
    }
  );

  Question.associate = function (models) {
    Question.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
      // Optionally, specify schema for association
      scope: {
        schema: "answersai_dev",
      },
    });
  };

  return Question;
};
