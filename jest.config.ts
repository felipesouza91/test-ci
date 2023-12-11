/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/shared/either.ts',
    '!<rootDir>/src/main/{configs,adapters}/**/*.ts',
    '!<rootDir>/src/main/main.ts',
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  setupFiles: [
    '<rootDir>/src/validators/webhook/test-env/test-webhook-secret-var.ts'
  ]
}

export default config
