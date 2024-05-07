module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/migrations/*.ts',
        '!src/methods/*.ts',
        '!src/main.ts',
        '!src/swagger.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
};
