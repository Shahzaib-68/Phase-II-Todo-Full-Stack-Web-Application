# SpecificationValidator Skill

**Status**: Ready for use

## Skill Configuration
- **Name**: SpecificationValidator
- **Type**: Validation Skill
- **Reusability**: Available to any agent
- **Input**: Specification document content (Markdown format)
- **Output**: Structured JSON validation report

## Validation Categories

### 1. Completeness
- [x] Document contains an Executive Summary section
- [x] Document contains a Functional Requirements section
- [x] Document contains a Non-Functional Requirements section
- [x] Document contains an Acceptance Criteria section (or per-requirement criteria)
- [x] Document contains an Assumptions & Constraints section
- [x] Every requirement has a unique ID (e.g., FR-001, NFR-001)
- [x] Every individual requirement has associated acceptance criteria
- [x] At least 3 functional requirements are defined

### 2. Consistency
- [x] No contradicting requirements detected
- [x] Terminology is used consistently throughout the document
- [x] All cross-referenced requirement IDs exist
- [x] Version number follows semantic versioning (e.g., 1.0.0)

### 3. Clarity
- [x] No vague or ambiguous terms (e.g., "maybe", "probably", "approximately")
- [x] Requirements use clear, strong action verbs (e.g., "shall", "must")
- [x] Acceptance criteria are measurable and specific
- [x] Overall ambiguity score < 0.20

### 4. Testability
- [x] Every requirement is verifiable
- [x] Acceptance criteria are binary (clear pass/fail)
- [x] Observable outcomes are explicitly defined

### 5. Structure
- [x] Valid Markdown syntax throughout
- [x] Proper heading hierarchy (H1 → H2 → H3, no skipping levels)
- [x] Tables are correctly formatted (pipes aligned, headers present)
- [x] Code blocks specify language where applicable (e.g., ```json)

## Output Format Example

```json
{
  "status": "passed" | "failed",
  "overall_score": 85,
  "checks": {
    "completeness": { "score": 90, "issues": [] },
    "consistency": { "score": 95, "issues": [] },
    "clarity": { "score": 78, "issues": ["Vague term 'approximately' found"] },
    "testability": { "score": 85, "issues": [] },
    "structure": { "score": 92, "issues": [] }
  },
  "actionable_items": [
    {
      "priority": "high" | "medium" | "low",
      "issue": "Description of the issue",
      "action": "Recommended remediation"
    }
  ]
}