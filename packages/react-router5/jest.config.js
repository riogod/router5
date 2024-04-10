module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/modules/__tests__/helpers/.*\\.tsx?$']
}
