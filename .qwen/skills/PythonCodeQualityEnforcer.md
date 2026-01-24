# PythonCodeQualityEnforcer Skill

**Status**: Ready for use

## Skill Configuration
- **Name**: PythonCodeQualityEnforcer
- **Type**: Code Quality Skill
- **Reusability**: Available to any code-generating agent
- **Input**: Code path (directory or single Python file)
- **Output**: Structured JSON quality report

## Quality Checks

### 1. Style & Formatting
- [x] Black formatting compliant (max line length 88)
- [x] Imports sorted with isort
- [x] Full PEP 8 compliance (via flake8)
- [x] No trailing whitespace

### 2. Type Safety
- [x] 100% type hints on all public functions, classes, and methods
- [x] Passes mypy in strict mode
- [x] No unnecessary use of `Any` (requires justification if present)

### 3. Complexity
- [x] Cyclomatic complexity ≤ 10 per function/method
- [x] Function/method length ≤ 50 lines
- [x] Maximum nesting depth ≤ 4 levels

### 4. Documentation
- [x] Docstrings present for all public modules, classes, functions, and methods
- [x] Docstrings follow Google or NumPy style
- [x] All parameters, return values, and exceptions documented with types

### 5. Testing
- [x] Unit tests exist for all public functions and classes
- [x] Overall code coverage ≥ 80%
- [x] All tests pass successfully

### 6. Security
- [x] No hardcoded credentials or secrets
- [x] Proper input validation where applicable
- [x] No use of unsafe functions (`eval`, `exec`, `pickle`, etc.)

## Auto-Fix Capabilities

**Can automatically fix**:
- ✅ Code formatting with Black
- ✅ Import sorting with isort
- ✅ Addition of basic type hints (where inferable)
- ✅ Insertion of docstring templates

**Cannot auto-fix** (flagged for manual review):
- ❌ Excessive cyclomatic complexity
- ❌ Functions exceeding length limits
- ❌ Deep nesting
- ❌ Missing or incomplete business logic
- ❌ Security vulnerabilities requiring context

## Output Format Example

```json
{
  "status": "passed" | "failed" | "warning",
  "overall_score": 92,
  "summary": {
    "issues_found": 8,
    "issues_fixed": 5,
    "issues_remaining": 3
  },
  "phases": {
    "style": { "score": 95, "status": "passed" },
    "typing": { "score": 88, "status": "warning" },
    "complexity": { "score": 90, "status": "passed" },
    "documentation": { "score": 100, "status": "passed" },
    "testing": { "score": 82, "status": "passed" },
    "security": { "score": 95, "status": "passed" }
  },
  "fixes_applied": [
    "Applied Black formatting to 5 files",
    "Sorted imports in 3 files",
    "Added missing type hints to 7 functions"
  ]
}