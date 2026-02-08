# Test Fix Documentation - READ ME FIRST

**Created**: 2026-02-08
**Purpose**: Guide to fix 56 failing organism tests

---

## 📚 Documentation Set

You have **3 documents** to help fix the failing tests:

### 1. 📖 **ORGANISM-TESTS-FIX-GUIDE.md** (Detailed Guide)
**Use when**: You need detailed explanation of a problem
- Complete analysis of each failing test file
- Detailed fix patterns with before/after code
- Explanation of root causes
- Common pitfalls to avoid
- Step-by-step fix process

**Best for**: First-time fixers, complex issues, learning patterns

---

### 2. ⚡ **QUICK-TEST-FIX-CHECKLIST.md** (Quick Reference)
**Use when**: You know the problem, just need the fix
- Quick diagnosis table
- Copy-paste code fixes
- File-by-file quick fixes
- Speed run workflow
- Pro tips

**Best for**: Experienced fixers, quick lookups, batch fixing

---

### 3. ✅ **TEST-FIX-TRACKER.md** (Progress Tracker)
**Use when**: Tracking which tests are done
- Complete checklist of all 56 tests
- Progress percentages
- Milestone tracking
- Contributor log

**Best for**: Daily work, team coordination, progress tracking

---

## 🚀 Getting Started

### For First-Time Fixers

1. **Start here**: Read the "Executive Summary" in `ORGANISM-TESTS-FIX-GUIDE.md`
2. **Pick a file**: Choose from "Recommended Fix Order" (start with ProfileFormClientOrganism - just 1 test)
3. **Read the pattern**: Find your file in the guide
4. **Apply the fix**: Follow the detailed instructions
5. **Test it**: Run `npm run test -t "test name" --run`
6. **Track progress**: Check the box in `TEST-FIX-TRACKER.md`

### For Experienced Fixers

1. **Pick a test**: From `TEST-FIX-TRACKER.md`
2. **Quick lookup**: Check `QUICK-TEST-FIX-CHECKLIST.md` for the fix pattern
3. **Apply & verify**: Fix → Test → Check box
4. **Batch process**: Fix multiple similar tests in one go

---

## 🎯 Recommended Starting Points

### Easiest (Quick Wins)
Start with these to build confidence:

1. **ProfileFormClientOrganism** (1 test)
   - Simple: Just needs `renderWithProviders`
   - Time: 5-10 minutes
   - Location: Guide page for Pattern 1

2. **RequestListOrganism** (1 test)
   - Simple: Date formatting fix
   - Time: 5-10 minutes
   - Location: Guide page for file #12

3. **AuthPageOrganism** (1 test)
   - Simple: Style merge check
   - Time: 5-10 minutes
   - Location: Guide page for file #13

### Medium Difficulty
Once you're comfortable:

4. **CategoryListOrganism** (2 tests)
   - Pattern: window.confirm() mocking
   - Time: 15-20 minutes
   - Location: Guide page for Pattern 3

5. **ServiceListOrganism** (2 tests)
   - Same pattern as CategoryList
   - Time: 15-20 minutes

### Most Impact (Fix Many Tests at Once)
For experienced fixers:

6. **RequestDetailOrganism** (18 tests)
   - Pattern: tRPC mocks
   - Time: 45-60 minutes
   - High impact: 32% of remaining tests
   - Location: Guide page for file #1

7. **RequestFormOrganism** (6 tests)
   - Pattern: HTML5 validation bypass
   - Time: 20-30 minutes
   - Location: Guide page for file #2

---

## 📊 Current Status

**Tests**: 56 failing | 855 passing (92.5% success rate)

**Files with failures**: 16

**Estimated total time**: 2-4 hours for all 56 tests

**Progress so far**: 7 tests fixed (from initial 63)

---

## 🔧 Quick Fix Commands

```bash
# Run single test
npm run test -t "exact test name" --run

# Run single file
npm run test src/components/organisms/[path]/Component.test.tsx --run

# Run all organism tests
npm run test src/components/organisms/ --run

# Check progress
npm run test src/components/organisms/ --run | grep -E "Test Files|Tests "
```

---

## 💡 Pro Tips

1. **Fix similar tests together**: All confirm() tests use same pattern
2. **Use examples**: ResetPasswordFormOrganism.test.tsx is fully working
3. **Test incrementally**: Fix one, verify, commit, repeat
4. **Don't batch everything**: One file at a time avoids confusion
5. **Read the component**: Understanding what it does makes fixing tests easier

---

## 🎓 Learning Path

### Beginner Path (Build Skills Gradually)
```
1. ProfileFormClientOrganism (1 test) - Learn renderWithProviders
   ↓
2. RequestListOrganism (1 test) - Learn date handling
   ↓
3. CategoryListOrganism (2 tests) - Learn confirm() mocking
   ↓
4. RequestFormOrganism (6 tests) - Learn form validation
   ↓
5. RequestDetailOrganism (18 tests) - Learn tRPC mocking
```

### Speed Run Path (Maximum Efficiency)
```
1. RequestDetailOrganism (18) - Biggest impact first
   ↓
2. RequestFormOrganism (6) - Second biggest
   ↓
3. LocationFormOrganism (5) - Same pattern as #2
   ↓
4. Rest grouped by pattern
```

---

## 🤝 Team Workflow

### Solo Developer
1. Pick a file from tracker
2. Fix all tests in that file
3. Run file tests to verify
4. Check all boxes for that file
5. Commit
6. Move to next file

### Team of 2-3
1. Each person picks different FILE (not individual tests)
2. Use tracker to avoid conflicts
3. Update tracker when starting a file (add your name)
4. Fix → Verify → Commit → Next file
5. Daily sync on progress

### Team of 4+
1. Divide by priority tier
2. Person A: RequestDetailOrganism (18)
3. Person B: RequestForm (6) + LocationForm (5)
4. Person C: NewVerification (4) + ServiceForm (4) + ThemeSwitcher (4)
5. Person D: Rest of the tests
6. Daily standup on blockers

---

## ⚠️ Important Notes

### Don't Do These
- ❌ Change component code to make tests pass (fix tests, not components)
- ❌ Skip running tests after fixing (verify it works)
- ❌ Fix tests in random order (use recommended priority)
- ❌ Apply renderWithProviders everywhere (only where needed)

### Do These
- ✅ Read the component to understand behavior
- ✅ Use working tests as examples
- ✅ Commit after each file or milestone
- ✅ Update tracker as you go
- ✅ Ask for help if stuck (see guides)

---

## 🆘 Getting Help

If you're stuck:

1. **Check the guide**: `ORGANISM-TESTS-FIX-GUIDE.md` - Find your error pattern
2. **Check examples**: Look at ResetPasswordFormOrganism.test.tsx (fully working)
3. **Debug**: Use `screen.debug()` to see what's rendering
4. **Read component**: Understand what it actually does
5. **Check test-utils**: See what renderWithProviders provides
6. **Simplify**: Comment out parts of test to isolate issue

---

## ✨ Success Criteria

**You're done when**:
- [ ] All checkboxes in `TEST-FIX-TRACKER.md` are checked
- [ ] `npm run test src/components/organisms/ --run` shows < 5 failures
- [ ] Success rate is > 99%
- [ ] All files committed to git

**Target**: 920+/924 tests passing

---

## 📞 Questions?

- **What is this?** Guide to fix 56 failing organism component tests
- **Why fix them?** Improve test coverage to 99%+
- **How long?** 2-4 hours total, or split across team
- **Where to start?** ProfileFormClientOrganism (easiest, 1 test)
- **Need help?** Check ORGANISM-TESTS-FIX-GUIDE.md

---

## 🎉 Acknowledgments

- Initial fixes: 7 tests fixed (ResetPassword, NewPassword, VerifyLoginCode families)
- Documentation: Created 2026-02-08
- Status: Ready for team to complete remaining 56 tests

---

**Ready to start? Pick your first test from TEST-FIX-TRACKER.md!**

Good luck! 🚀
