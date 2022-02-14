const { Sequelize } = require("sequelize");
const Record = require("../Model/Record");
const Field = require("../Model/Field");
const History = require("../Model/History");
const { User } = require("../Model/User");
const { RecordNumber } = require("../Model/RecordNumber");
const { Department } = require("../Model/Department");
const { Tag } = require("../Model/Tag");
require("dotenv").config();

const { PROD, DATABASE_URL } = process.env;

function loadEnvironment(testing) {
  let options;

  if (DATABASE_URL === undefined || DATABASE_URL === "" || testing === 1) {
    console.error("DATABASE_URL: empty required environment variable");
    if (testing === 1) {
      return null;
    }

    // we should exit on production or homol environment
    process.exit(1);
  }

  // Checks if we are being deployed at production/homol environment
  if (PROD === "true" || testing === 2) {
    options = {
      dialect: "postgres",
      define: {
        timestamps: true,
        underscored: true,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    };
  } else {
    options = {
      dialect: "postgres",
      ssl: true,
      define: {
        timestamps: true,
        underscored: true,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    };
  }

  console.info(`environment: ${PROD}`);
  console.info(`database url: ${DATABASE_URL}`);
  console.info(`database settings: ${JSON.stringify(options)}`);

  return options;
}

async function setupModels(db) {
  // Initializes models
  Record.init(db);
  Field.init(db);
  History.init(db);
  User.init(db);
  Department.init(db);
  RecordNumber.init(db);
  Tag.init(db);

  // Perform associations
  Record.associate(db.models);
  History.associate(db.models);
  Department.associate(db.models);
  Tag.associate(db.models);
}

async function setupSequelize() {
  return new Sequelize(DATABASE_URL, loadEnvironment());
}

async function configure(auth, db) {
  return new Promise((resolve) => {
    auth.then(() => {
      setupModels(db);
      resolve(0);
    });
  });
}

async function initializeDatabase() {
  // Initializes sequelize client
  const db = await setupSequelize();

  // Run database authentication process
  const auth = db.authenticate();
  return configure(auth, db);
}

module.exports = {
  initializeDatabase,
  loadEnvironment,
};
