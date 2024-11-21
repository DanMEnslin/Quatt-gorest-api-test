import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "allure-jest/node",
  roots: ["./tests"],
};
export default config;
