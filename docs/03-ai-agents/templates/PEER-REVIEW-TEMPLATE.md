# 👥 Peer Review Template - [TICKET-ID]

## 📋 **Review Information**

- **Ticket ID**: [TICKET-ID]
- **Reviewee Agent**: [Agent who completed the work]
- **Reviewer Agent**: [Agent conducting the review]
- **Review Type**: 🔍 **CODE REVIEW** | 🏗️ **ARCHITECTURE REVIEW** | 📝 **DOCUMENTATION REVIEW**
- **Priority**: [HIGH | MEDIUM | LOW]
- **Status**: 🔄 **IN REVIEW** | ✅ **APPROVED** | ❌ **REJECTED** | 🔄 **REVISION NEEDED**
- **Review Date**: [YYYY-MM-DDTHH:mm:ssZ]

---

## 🎯 **Review Scope**

### **What's Being Reviewed**

- [ ] **Code Implementation**: [Specific files/modules]
- [ ] **Architecture Changes**: [Design decisions]
- [ ] **Documentation Updates**: [Documentation changes]
- [ ] **Test Coverage**: [Testing implementation]
- [ ] **Integration Points**: [System integration]

### **Review Criteria**

- [ ] **SOLID Principles Compliance**: All 5 principles properly applied
- [ ] **Code Quality**: Clean, readable, maintainable code
- [ ] **Testing**: Adequate test coverage and quality
- [ ] **Documentation**: Clear and complete documentation
- [ ] **Performance**: No performance degradation
- [ ] **Security**: Security best practices followed

---

## 🧪 **SOLID Principles Review**

### **✅ Single Responsibility Principle (SRP)**

- **Compliance**: [🟢 COMPLIANT | 🟡 MINOR ISSUES | 🔴 NON-COMPLIANT]
- **Assessment**:
  ```markdown
  ✅ Well-separated responsibilities
  ⚠️ [Any concerns or minor issues]
  ❌ [Any violations found]
  ```
- **Recommendations**:
  - [Specific suggestions for improvement]

### **✅ Open/Closed Principle (OCP)**

- **Compliance**: [🟢 COMPLIANT | 🟡 MINOR ISSUES | 🔴 NON-COMPLIANT]
- **Assessment**:
  ```markdown
  ✅ Extension points properly designed
  ⚠️ [Any concerns about extensibility]
  ❌ [Any violations found]
  ```
- **Recommendations**:
  - [Specific suggestions for improvement]

### **✅ Liskov Substitution Principle (LSP)**

- **Compliance**: [🟢 COMPLIANT | 🟡 MINOR ISSUES | 🔴 NON-COMPLIANT]
- **Assessment**:
  ```markdown
  ✅ Implementations properly substitutable
  ⚠️ [Any behavioral contract concerns]
  ❌ [Any violations found]
  ```
- **Recommendations**:
  - [Specific suggestions for improvement]

### **✅ Interface Segregation Principle (ISP)**

- **Compliance**: [🟢 COMPLIANT | 🟡 MINOR ISSUES | 🔴 NON-COMPLIANT]
- **Assessment**:
  ```markdown
  ✅ Interfaces are focused and cohesive
  ⚠️ [Any interface concerns]
  ❌ [Any violations found]
  ```
- **Recommendations**:
  - [Specific suggestions for improvement]

### **✅ Dependency Inversion Principle (DIP)**

- **Compliance**: [🟢 COMPLIANT | 🟡 MINOR ISSUES | 🔴 NON-COMPLIANT]
- **Assessment**:
  ```markdown
  ✅ Proper dependency injection and abstraction
  ⚠️ [Any dependency concerns]
  ❌ [Any violations found]
  ```
- **Recommendations**:
  - [Specific suggestions for improvement]

---

## 💻 **Code Quality Review**

### **Code Structure**

- **Organization**: [🟢 EXCELLENT | 🟡 GOOD | 🔴 NEEDS WORK]
- **Readability**: [🟢 EXCELLENT | 🟡 GOOD | 🔴 NEEDS WORK]
- **Maintainability**: [🟢 EXCELLENT | 🟡 GOOD | 🔴 NEEDS WORK]

```typescript
// ✅ GOOD EXAMPLES
// Highlight examples of well-written code

// ❌ ISSUES FOUND
// Point out specific issues that need attention

// 💡 SUGGESTIONS
// Provide specific improvement suggestions
```

### **Technical Implementation**

- [ ] **Error Handling**: Proper error handling implemented
- [ ] **Input Validation**: All inputs properly validated
- [ ] **Type Safety**: Strong TypeScript typing used
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: Security considerations addressed

### **Database & API**

- [ ] **Prisma Usage**: Proper Prisma patterns used
- [ ] **MongoDB Optimization**: Efficient queries and indexes
- [ ] **tRPC Implementation**: Correct tRPC procedure implementation
- [ ] **Data Validation**: Zod schemas properly implemented

---

## 🧪 **Testing Review**

### **Test Coverage**

- **Unit Tests**: [Coverage %] - [🟢 ≥95% | 🟡 85-94% | 🔴 <85%]
- **Integration Tests**: [Coverage %] - [🟢 ≥85% | 🟡 70-84% | 🔴 <70%]
- **Mutation Score**: [Score %] - [🟢 ≥85% | 🟡 70-84% | 🔴 <70%]

### **Test Quality**

- [ ] **Test Clarity**: Tests are clear and understandable
- [ ] **Test Coverage**: Important paths are tested
- [ ] **Edge Cases**: Edge cases are covered
- [ ] **Mock Usage**: Proper mocking where appropriate
- [ ] **Test Performance**: Tests run efficiently

### **TDD Compliance**

- [ ] **Green-Refactor-Validation**: TDD methodology followed
- [ ] **Test-First**: Tests written before implementation
- [ ] **Incremental**: Small, incremental changes

---

## 📚 **Documentation Review**

### **Code Documentation**

- [ ] **Function Comments**: Complex functions documented
- [ ] **Class Documentation**: Classes have clear purpose
- [ ] **API Documentation**: tRPC procedures documented
- [ ] **Type Documentation**: Complex types explained

### **Change Documentation**

- [ ] **README Updates**: READMEs updated if needed
- [ ] **Change Log**: Changes properly logged
- [ ] **Migration Notes**: Database changes documented
- [ ] **Breaking Changes**: Breaking changes highlighted

---

## 🔄 **Integration Review**

### **System Integration**

- [ ] **Backward Compatibility**: No breaking changes to existing APIs
- [ ] **Database Migrations**: Migrations are safe and reversible
- [ ] **Frontend Compatibility**: Backend changes compatible with frontend
- [ ] **Third-party Services**: External integrations working correctly

### **Performance Impact**

- [ ] **Response Times**: No degradation in API response times
- [ ] **Database Performance**: No slow queries introduced
- [ ] **Memory Usage**: No memory leaks or excessive usage
- [ ] **Build Performance**: Build times not significantly increased

---

## 🚨 **Issues & Recommendations**

### **🔴 Critical Issues (Must Fix)**

```markdown
❌ [Critical Issue 1]: [Description]

- **Impact**: [Why this is critical]
- **Location**: [File/line/function]
- **Fix**: [How to fix]
- **Timeline**: [When to fix]
```

### **🟡 Important Issues (Should Fix)**

```markdown
⚠️ [Important Issue 1]: [Description]

- **Impact**: [Why this matters]
- **Location**: [File/line/function]
- **Suggestion**: [How to improve]
- **Priority**: [When to address]
```

### **💡 Suggestions (Nice to Have)**

```markdown
💡 [Suggestion 1]: [Description]

- **Benefit**: [What improvement this brings]
- **Effort**: [Implementation effort]
- **Alternative**: [Other approaches]
```

---

## 🎯 **Overall Assessment**

### **Strengths**

- [What was done particularly well]
- [Strong points of the implementation]
- [Good practices followed]

### **Areas for Improvement**

- [What could be better]
- [Patterns that could be enhanced]
- [Future considerations]

### **Learning Opportunities**

- [Knowledge sharing opportunities]
- [Patterns that could be reused]
- [Best practices to document]

---

## ✅ **Review Decision**

### **Final Status**

- **Decision**: [✅ APPROVED | ❌ REJECTED | 🔄 REVISION NEEDED]
- **Confidence Level**: [High/Medium/Low]
- **Approval Conditions**: [Any conditions for approval]

### **Required Actions**

- [ ] **Before Merge**: [Actions needed before merging]
- [ ] **After Merge**: [Follow-up actions needed]
- [ ] **Documentation**: [Documentation updates needed]
- [ ] **Testing**: [Additional testing required]

### **Sign-off**

- **Reviewer**: [Reviewer Agent Name]
- **Review Completed**: [YYYY-MM-DDTHH:mm:ssZ]
- **Next Review**: [If revision needed, when to re-review]

---

## 📝 **Additional Notes**

### **Context & Background**

- [Any additional context for the review]
- [Background information that influenced decisions]
- [Constraints or limitations considered]

### **Future Considerations**

- [Ideas for future improvements]
- [Technical debt to address later]
- [Architectural evolution opportunities]

---

**Review Template Version**: 1.0  
**Review Methodology**: Based on SOLID principles and project standards  
**Cross-Reference**: Link to related reviews or decisions
