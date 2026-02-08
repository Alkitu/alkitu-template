# Organism Tests Fix Tracker

**Status**: 56 tests to fix | 855 passing (92.5%)
**Last Updated**: 2026-02-08

---

## 📊 Progress Overview

- [ ] **RequestDetailOrganism** (0/18 fixed)
- [ ] **RequestFormOrganism** (0/6 fixed)
- [ ] **LocationFormOrganism** (0/5 fixed)
- [ ] **NewVerificationFormOrganism** (0/4 fixed)
- [ ] **ServiceFormOrganism** (0/4 fixed)
- [ ] **ThemeSwitcher** (0/4 fixed)
- [ ] **LocationListOrganism** (0/3 fixed)
- [ ] **CategoryListOrganism** (0/2 fixed)
- [ ] **CategoryFormOrganism** (0/2 fixed)
- [ ] **ProfileFormEmployeeOrganism** (0/2 fixed)
- [ ] **ServiceListOrganism** (0/2 fixed)
- [ ] **AuthPageOrganism** (0/1 fixed)
- [ ] **ProfileFormClientOrganism** (0/1 fixed)
- [ ] **RequestListOrganism** (0/1 fixed)
- [ ] **RequestChatPanel** (0/? fixed)

**Total**: 0/56 tests fixed

---

## ✅ Detailed Test List

### RequestChatPanel (? tests)
- [ ] Full file failure - needs investigation

### AuthPageOrganism (1 test)
- [ ] should merge custom styles with theme override

### NewVerificationFormOrganism (4 tests)
- [ ] Rendering > should show success message after verification
- [ ] Verification Success > should redirect to login after successful verification
- [ ] Verification Success > should use translation for success message
- [ ] Resend Verification > should disable resend button while loading

### CategoryFormOrganism (2 tests)
- [ ] should show cancel button when showCancel is true
- [ ] should disable cancel button when loading

### CategoryListOrganism (2 tests)
- [ ] should not delete category when confirmation cancelled
- [ ] should show service count for each category

### RequestListOrganism (1 test)
- [ ] should render request dates correctly

### LocationFormOrganism (5 tests)
- [ ] should show cancel button when showCancel is true
- [ ] should show validation error message
- [ ] should clear field errors when user starts typing
- [ ] should handle network errors gracefully
- [ ] should have proper ARIA attributes for invalid fields

### LocationListOrganism (3 tests)
- [ ] should not delete location when confirmation cancelled
- [ ] should call onLocationChange after successful operation
- [ ] should render locations with all address details

### ProfileFormClientOrganism (1 test)
- [ ] should validate required fields on submit

### ProfileFormEmployeeOrganism (2 tests)
- [ ] should validate required fields on submit
- [ ] should clear success message after 3 seconds

### RequestDetailOrganism (18 tests)
- [ ] should show loading state initially
- [ ] should render request details after successful fetch
- [ ] should render back button when onBack provided
- [ ] should call onBack when back button clicked
- [ ] should show assign button for EMPLOYEE/ADMIN
- [ ] should hide assign button for CLIENT
- [ ] should show change status button for EMPLOYEE/ADMIN
- [ ] should render request timeline
- [ ] should render client information
- [ ] should render service details
- [ ] should render location details
- [ ] should render assigned employee when present
- [ ] should render edit button when onEdit provided and user is not CLIENT
- [ ] should apply custom className
- [ ] should render request notes
- [ ] should render evidence section
- [ ] should disable assign button for cancelled requests
- [ ] should disable assign button for completed requests

### RequestFormOrganism (6 tests)
- [ ] should show loading state while fetching data
- [ ] should validate required template fields
- [ ] should submit form with all data
- [ ] should show error message on submission failure
- [ ] should disable form fields while submitting
- [ ] should clear field errors when user starts typing

### ServiceFormOrganism (4 tests)
- [ ] should show cancel button when showCancel is true
- [ ] should validate required fields
- [ ] should handle JSON template editing
- [ ] should validate JSON template format

### ServiceListOrganism (2 tests)
- [ ] should not delete service when confirmation cancelled
- [ ] should call onServiceChange after successful operation

### ThemeSwitcher (4 tests)
- [ ] Dropdown Mode (Default) > should render dropdown trigger button
- [ ] Dropdown Mode (Default) > should show current theme name on trigger
- [ ] Dropdown Mode (Default) > should render all saved themes in dropdown
- [ ] Accessibility > should have accessible button text

---

## 🎯 How to Use This Tracker

1. **Pick a test** from the list above
2. **Follow the guide** in `ORGANISM-TESTS-FIX-GUIDE.md` or `QUICK-TEST-FIX-CHECKLIST.md`
3. **Fix the test** following the patterns
4. **Verify it works**: Run `npm run test -t "test name" --run`
5. **Check this box** ✓
6. **Update progress** percentages above
7. **Commit your work**: `git commit -m "test: fix [test name]"`
8. **Move to next test**

---

## 📈 Progress Milestones

- [ ] **25% Complete** (14/56 tests fixed)
- [ ] **50% Complete** (28/56 tests fixed)
- [ ] **75% Complete** (42/56 tests fixed)
- [ ] **100% Complete** (56/56 tests fixed) 🎉

---

## 🏆 Contributors

_Add your name when you fix tests:_

- [ ] Your Name - Fixed [X tests] - [Date]
- [ ] Your Name - Fixed [X tests] - [Date]

---

## 📝 Notes

Use this space for notes about tricky fixes or patterns discovered:

```
Example:
- RequestDetailOrganism: All tests needed tRPC mock updates
- LocationFormOrganism: HTML5 validation bypass required
```

---

**See detailed fix instructions in:**
- 📖 `ORGANISM-TESTS-FIX-GUIDE.md` - Complete guide with examples
- ⚡ `QUICK-TEST-FIX-CHECKLIST.md` - Quick reference
