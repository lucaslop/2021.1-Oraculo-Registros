const { Model, Sequelize } = require("sequelize");

class Section extends Model {
    static init(db) {
        super.init(
            {
                name: { type: Sequelize.TEXT },
            },
            {
                sequelize: db,
                tableName: "sections",
            }
        );
    }

    static associate(models) {
        this.belongsToMany(models.Record, {
            foreignKey: "section_id",
            through: "record_sections",
            as: "sections",
        });
    }
}

module.exports = Section;
