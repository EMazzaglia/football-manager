export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js"],
  rootDir: ".",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleDirectories: ["node_modules", "src"]
};