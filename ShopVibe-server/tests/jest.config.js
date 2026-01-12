import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
