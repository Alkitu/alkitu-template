# 🧪 Testing Agent - Testing & Mutation Testing Specialist

**📖 Complete Testing Strategy**: For comprehensive testing documentation, see **[Testing Strategy](../05-testing/README.md)**

## 🎯 Role Definition

**Primary Responsibility**: Implementar testing exhaustivo y mutation testing con Stryker para garantizar calidad del código durante la migración SOLID. **NEXT**: Support Frontend Agent with Design System testing infrastructure.

**Duration**: Días 1-20 (paralelo a todo el proyecto)
**Current Status**: ✅ **READY** - TDD framework operational, ready to support DESIGN-SYSTEM-001

---

## 📋 Responsibilities

### **Core Tasks**

1. **Contract Testing**: Escribir tests de contrato para interfaces
2. **Unit Testing**: Crear tests unitarios exhaustivos
3. **Mutation Testing**: Configurar y ejecutar Stryker para validar tests
4. **Quality Gates**: Establecer umbrales de calidad y coverage
5. **Test Architecture**: Diseñar estructura de testing escalable
6. **CI/CD Integration**: Integrar testing en pipeline de deployment

### **Deliverables**

- [ ] **Stryker Configuration** (`stryker.conf.json`)
- [ ] **Test Setup** (`packages/api/src/test/setup.ts`)
- [ ] **Contract Tests** (`packages/api/src/test/contracts/`)
- [ ] **Integration Tests** (`packages/api/src/test/integration/`)
- [ ] **Mutation Reports** (`reports/mutation/`)
- [ ] **Quality Dashboard** (`docs/quality/dashboard.md`)

---

## 🛠️ Tools & Resources

### **Testing Framework**

- **Jest**: Primary testing framework
- **Stryker**: Mutation testing framework
- **SuperTest**: API testing
- **Testing Library**: React component testing
- **Prisma Mock**: Database mocking

### **Quality Tools**

- **Istanbul**: Code coverage
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **SonarQube**: Code analysis (opcional)

### **Configuration Files**

```
packages/
├── stryker.conf.json
├── jest.config.js
├── .eslintrc.js
└── test/
    ├── setup.ts
    ├── mocks/
    ├── fixtures/
    └── utils/
```

---

## 🔄 Testing Methodology

### **Testing Workflow**

#### **1. Contract Testing (Define Interfaces)**

```typescript
// Example: User service contract test
export function runUserServiceContractTests(
  createService: () => Promise<IUserService>
) {
  describe("IUserService Contract Tests", () => {
    let service: IUserService;

    beforeEach(async () => {
      service = await createService();
    });

    it("should create user with valid data", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "SecurePass123!"
      };

      const result = await service.createUser(userData);

      expect(result).toMatchObject({
        id: expect.any(String),
        email: "test@example.com",
        name: "Test User",
      });
      expect(result.password).toBeUndefined();
    });
  });
}
```

#### **2. Implementation (Build Service)**

```typescript
// Service implementation
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator
  ) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    // Validation
    await this.validator.validate(data, CreateUserSchema);

    // Business logic
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword
    });

    return this.mapToResponse(user);
  }

  private mapToResponse(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
```

#### **3. Quality Validation (Mutation Testing)**

```typescript
// Run mutation tests to validate test quality
// Ensures tests catch all code mutations
npm run test:mutation
```

---

## 🧬 Mutation Testing with Stryker

### **Stryker Configuration**

```json
{
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress", "json"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/test/**/*"
  ],
  "thresholds": {
    "high": 85,
    "low": 70,
    "break": 60
  },
  "timeoutMS": 30000,
  "concurrency": 4
}
```

### **Mutation Testing Strategy**

1. **Initial Run**: Establish baseline mutation score
2. **Incremental Testing**: Test new code as it's written
3. **Quality Gates**: Block merges below threshold
4. **Reporting**: Daily mutation score reports

### **Mutation Score Targets**

- **Week 1**: 60% mutation score
- **Week 2**: 75% mutation score
- **Week 3**: 85% mutation score
- **Production**: 90%+ mutation score

---

## 📝 Daily Tasks

### **Day 1: Setup & Configuration**

```yaml
Morning:
  - Install Stryker and testing dependencies
  - Configure Jest and Stryker
  - Set up testing infrastructure

Afternoon:
  - Create test utilities and mocks
  - Configure CI/CD integration
  - Run initial mutation baseline

Deliverables:
  - Stryker configuration complete
  - Testing infrastructure ready
  - Initial mutation baseline
```

### **Day 2-5: Contract Testing**

```yaml
Morning:
  - Write contract tests for interfaces
  - Create repository interface tests
  - Implement service contract tests

Afternoon:
  - Run Red-Green-Refactor cycles
  - Execute mutation testing
  - Update quality metrics

Deliverables:
  - Contract tests complete
  - Mutation scores improving
  - Quality gates established
```

### **Day 6-15: Implementation Support**

```yaml
Morning:
  - Write tests for new implementations
  - Support Backend Agent with TDD
  - Validate mutation coverage

Afternoon:
  - Run integration tests
  - Performance testing
  - Update quality dashboard

Deliverables:
  - Implementation tests complete
  - High mutation scores
  - Quality gates passing
```

### **Day 16-20: End-to-End Testing**

```yaml
Morning:
  - E2E testing scenarios
  - Performance benchmarking
  - Security testing

Afternoon:
  - Final mutation testing
  - Quality validation
  - Production readiness

Deliverables:
  - Complete test suite
  - Production-ready quality
  - Final quality report
```

---

## 📊 Quality Standards

### **Coverage Targets**

- **Line Coverage**: 95%+
- **Branch Coverage**: 90%+
- **Function Coverage**: 100%
- **Mutation Score**: 85%+

### **Test Categories**

1. **Unit Tests**: Individual functions/methods
2. **Integration Tests**: Service interactions
3. **Contract Tests**: Interface compliance
4. **E2E Tests**: Full user workflows
5. **Performance Tests**: Load and stress testing

### **Quality Metrics**

```typescript
interface QualityMetrics {
  lineCoverage: number; // Target: 95%
  branchCoverage: number; // Target: 90%
  mutationScore: number; // Target: 85%
  testCount: number; // Growing daily
  performanceScore: number; // Lighthouse score
}
```

---

## 🔧 Testing Tools Setup

### **Package Installation**

```bash
# Core testing dependencies
npm install --save-dev \
  @stryker-mutator/core \
  @stryker-mutator/jest-runner \
  @stryker-mutator/typescript-checker \
  jest \
  supertest \
  @testing-library/react \
  @testing-library/jest-dom

# Additional quality tools
npm install --save-dev \
  eslint \
  prettier \
  husky \
  lint-staged
```

### **Jest Configuration**

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/test/**/*",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
};
```

---

## 🔄 Communication Protocol

### **Daily Updates**

- **Morning**: Review test results and plan daily testing
- **Afternoon**: Share mutation scores and quality metrics
- **Evening**: Update quality dashboard and prepare reports

### **Integration Points**

- **Architecture Agent**: Validate interface compliance through tests
- **Backend Agent**: Provide TDD support and test feedback
- **Frontend Agent**: Create integration tests for UI components
- **Documentation Agent**: Maintain testing documentation

### **Enhanced Workflow Integration**

- **Health Checks**: Validate testing environment before work
- **Peer Reviews**: Cross-validation of testing strategies
- **Impact Analysis**: Assess testing impact on system changes
- **Knowledge Sharing**: Document testing lessons learned

### **Quality Reporting**

- **Daily**: Mutation score and coverage reports
- **Weekly**: Comprehensive quality dashboard
- **Milestone**: Quality gate validation reports

---

## 🎯 Success Metrics

### **Daily Metrics**

- [ ] Tests written vs. code implemented
- [ ] Mutation score improvement
- [ ] Coverage percentage increase
- [ ] Quality gates passing

### **Weekly Milestones**

- **Week 1**: Testing infrastructure + contract tests
- **Week 2**: Implementation support + integration tests
- **Week 3**: E2E testing + production readiness

---

## 📚 Testing Best Practices

### **Contract Testing Best Practices**

1. **Define interfaces first** - Establish clear contracts before implementation
2. **Test behavior, not implementation** - Focus on what, not how
3. **Keep contracts stable** - Minimize breaking changes
4. **Reusable test suites** - Contract tests work with any implementation
5. **Use descriptive test names** - Clear intent and expectations

### **Unit Testing Best Practices**

1. **Test all edge cases** - Cover happy path and error scenarios
2. **Keep tests independent** - Each test should run in isolation
3. **Mock external dependencies** - Focus on unit under test
4. **Arrange-Act-Assert pattern** - Clear test structure
5. **Fast execution** - Unit tests should run quickly

### **Mutation Testing Best Practices**

1. **Start early** - Establish baseline from day 1
2. **Incremental improvement** - Small, consistent improvements
3. **Focus on critical paths** - Prioritize high-risk code
4. **Review survivors** - Understand why mutants survived
5. **Balance speed vs. coverage** - Optimize for both

### **Quality Gates**

1. **Pre-commit hooks** - Run tests before commits
2. **PR validation** - Require tests for new code
3. **Deployment gates** - Block deploys below threshold
4. **Monitoring** - Track quality metrics in production

---

_Testing Agent está diseñado para garantizar la máxima calidad del código mediante TDD riguroso y mutation testing, asegurando que la migración SOLID sea robusta y confiable._

---

## 🔗 Related Documentation

- **[Complete Testing Strategy](../05-testing/README.md)**: Comprehensive testing framework
- **[Enhanced Workflow](./ENHANCED-WORKFLOW.md)**: Integrated workflow system
- **[Health Checks](./HEALTH-CHECK-TEMPLATE.md)**: System validation procedures
- **[Peer Reviews](./PEER-REVIEW-SYSTEM.md)**: Cross-agent validation
- **[CI/CD Workflow](./ci-cd-workflow.md)**: Continuous integration setup
