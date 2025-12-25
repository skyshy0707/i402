module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('Lessons', 'content_type', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          references: {
                          model: {
                            tableName: 'ContentTypes'
                          },
                          key: 'title',
                          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
                      }
        }, { transaction: t })
      ])
    }) 
  },
  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('Lessons', 'content_type', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }, { transaction: t })
      ])
    })
  },
};