# 🤖 CI/CD Workflow para Agentes AI

## 📋 Resumen

Este documento describe el flujo completo de CI/CD controlado por agentes AI con metodología TDD (Test-Driven Development) obligatoria.

---

## 🎯 Objetivos

- **TDD Obligatorio**: Todos los cambios DEBEN seguir Green-Refactor-Validation
- **Quality Gates**: 95%+ coverage, 85%+ mutation score
- **Automatización**: CI/CD completamente automatizado
- **Docker**: Entornos consistentes y reproducibles
- **Agentes AI**: Orquestación inteligente del desarrollo

---

## 🔄 Flujo TDD (Test-Driven Development)

### **🟢 GREEN Phase - Make Test Pass**

```bash
# Comandos para agentes
npm run test:unit             # Tests unitarios
npm run test:green            # Verificar tests pasan
```

**Responsabilidad**: Backend Agent / Frontend Agent  
**Criterio de éxito**: Test pasa con código mínimo

### **🔄 REFACTOR Phase - Improve Code**

```bash
# Comandos para agentes
npm run test:refactor         # Tests + quality checks
npm run lint                  # Linting
npm run type-check            # Type checking
npm run test:all              # Todos los tests
```

**Responsabilidad**: Architecture Agent  
**Criterio de éxito**: Código limpio, SOLID, todos los tests pasan

### **🧪 VALIDATION Phase - Quality Gates**

```bash
# Comandos para agentes
npm run test:mutation         # Mutation testing
npm run test:coverage         # Coverage report
npm run quality:gates         # Quality gates completos
```

**Responsabilidad**: Testing Agent  
**Criterio de éxito**: 95%+ coverage, 85%+ mutation score

---

## 🐳 Docker CI/CD Environment

### **Servicios Docker**

```bash
# Comandos para agentes
npm run dev:docker
npm run docker:stop
```

#### **🟢 unit-tester**: Green Phase Testing

- Ejecuta tests unitarios
- Verifica que implementación pasa tests
- Genera reportes de cobertura

#### **🔄 integration-tester**: Refactor Phase Testing

- Ejecuta tests de integración
- Verifica integración entre módulos
- Valida APIs y endpoints

#### **🧪 mutation-tester**: Validation Phase Testing

- Ejecuta mutation testing con Stryker
- Genera reportes de mutation score
- Valida calidad de los tests

#### **📊 quality-checker**: Quality Gates

- Ejecuta linting y type checking
- Valida que pasan todos los quality gates
- Genera reporte final de calidad

#### **🐳 builder**: Build Environment

- Construye todos los packages
- Genera artefactos de producción
- Valida que el build es exitoso

---

## 🚀 GitHub Actions Pipeline

### **Fases del Pipeline**

```yaml
# Secuencia de ejecución
1. 🟢 GREEN Phase → 2. 🔄 REFACTOR Phase → 3. 🧪 VALIDATION Phase
↓
4. 🐳 Docker Build & Test → 5. 🔍 Quality Gates → 6. 🚀 Deploy (Production)
```

### **Artefactos Generados**

- **green-phase-results**: Reportes de tests unitarios
- **refactor-phase-results**: Reportes de refactoring
- **validation-phase-results**: Reportes de mutation testing
- **docker-test-results**: Resultados de testing en Docker
- **quality-report**: Reporte final de calidad

---

## 📊 Quality Gates

### **Métricas Obligatorias**

```typescript
interface QualityMetrics {
  // Coverage Requirements
  unitTestCoverage: ">= 95%";
  integrationTestCoverage: ">= 90%";
  e2eTestCoverage: ">= 80%";

  // Mutation Testing
  mutationScore: ">= 85%";
  mutationSurvivalRate: ">= 85%";

  // Code Quality
  lintErrors: 0;
  lintWarnings: 0;
  typeErrors: 0;

  // Performance
  buildTime: "< 5 minutes";
  testExecutionTime: "< 3 minutes";

  // Security
  vulnerabilities: 0;
  securityScore: ">= 95%";
}
```

### **Enforcement Rules**

1. **NO CODE WITHOUT TESTS**: Código sin tests = Pipeline falla
2. **TDD MANDATORY**: Debe seguir Green-Refactor-Validation
3. **QUALITY GATES**: Todos los gates deben pasar
4. **DOCKER VALIDATION**: Tests deben pasar en Docker
5. **MUTATION TESTING**: 85%+ mutation score obligatorio

---

## 🔧 Scripts para Agentes

### **TDD Development Cycle**

```bash
# Green Phase
npm run test:unit             # Run unit tests
npm run test:green            # Run passing tests

# Refactor Phase
npm run test:refactor         # Run tests + quality checks
npm run test:all              # Run all test suites

# Validation Phase
npm run test:mutation         # Run mutation testing
npm run test:coverage         # Generate coverage report
```

### **Quality & Building**

```bash
# Quality Commands
npm run quality:check         # Basic quality checks
npm run quality:gates         # Complete quality gates
npm run lint                  # Linting
npm run type-check            # Type checking

# Building Commands
npm run build:all             # Build all packages
npm run build:shared          # Build shared package
npm run build:api             # Build API package
npm run build:web             # Build web package
```

### **Docker & CI/CD**

```bash
# Docker Commands
npm run build:docker          # Build Docker containers
npm run dev:docker    # Start development environment

# Agent Commands
npm run agent:test            # Agent-specific testing
npm run agent:build           # Agent-specific building
npm run agent:deploy          # Agent-specific deployment
```

---

## 🎯 Workflow para Agentes

### **Antes de Escribir Código**

1. ✅ Leer requirements y PRDs
2. ✅ Verificar dependencias
3. ✅ Escribir tests unitarios
4. ✅ Verificar que tests están bien escritos

### **Durante Implementación**

1. ✅ Implementar código mínimo (GREEN)
2. ✅ Ejecutar `npm run test:unit`
3. ✅ Verificar que test pasa
4. ✅ Refactorizar código (REFACTOR)
5. ✅ Ejecutar `npm run test:all`

### **Después de Implementación**

1. ✅ Ejecutar `npm run test:mutation`
2. ✅ Verificar mutation score >= 85%
3. ✅ Ejecutar `npm run quality:gates`
4. ✅ Verificar Docker build: `npm run build:docker`
5. ✅ Documentar cambios realizados

---

## 🚨 Troubleshooting

### **Common Issues**

#### **Tests Failing**

```bash
# Debug tests
npm run test:unit -- --verbose
npm run test:integration -- --verbose
npm run test:e2e -- --headed
```

#### **Low Coverage**

```bash
# Generate detailed coverage report
npm run test:coverage -- --verbose
open coverage/lcov-report/index.html
```

#### **Low Mutation Score**

```bash
# Generate mutation report
npm run test:mutation -- --verbose
open reports/mutation/mutation.html
```

#### **Docker Issues**

```bash
# Debug Docker environment
npm run docker:logs
npm run docker:restart api
```

---

## 📈 Metrics & Monitoring

### **Real-time Dashboards**

- **Coverage Reports**: `http://localhost:8080/coverage/`
- **Mutation Reports**: `http://localhost:8080/mutation/`
- **E2E Reports**: `http://localhost:8080/e2e/`
- **Integration Reports**: `http://localhost:8080/integration/`

### **Key Performance Indicators**

```typescript
interface KPIs {
  // Development Velocity
  testWritingTime: "< 10 minutes per feature";
  implementationTime: "< 30 minutes per feature";
  refactoringTime: "< 15 minutes per feature";

  // Quality Metrics
  bugsInProduction: 0;
  testStability: ">= 99%";
  buildStability: ">= 99%";

  // Automation
  manualTestingTime: "< 5% of total testing time";
  deploymentTime: "< 10 minutes";
  rollbackTime: "< 5 minutes";
}
```

---

## 🏆 Success Criteria

### **For Individual Agents**

- ✅ TDD cycle completado (Green-Refactor-Validation)
- ✅ Quality gates passed (95%+ coverage, 85%+ mutation)
- ✅ Docker build successful
- ✅ CI/CD pipeline green
- ✅ Documentation updated

### **For Overall Project**

- ✅ 20-day timeline maintained
- ✅ Commercial quality achieved
- ✅ Zero production bugs
- ✅ Customer-ready template
- ✅ SOLID architecture implemented

---

**Recuerda**: Este es un template comercial que se venderá a desarrolladores. Cada decisión debe priorizar al cliente final que usará este template para construir su producto SaaS. Calidad, mantenibilidad y experiencia del desarrollador son no negociables.
