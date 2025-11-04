# Dynamic Questions System - TaTTTy Generator

## Overview

The TaTTTy AI generator uses a **dynamic question system** where the two questions shown to users are fully configurable via:
1. **Frontend data file** (`/data/field-labels.ts`)
2. **Database table** (`generator_questions`)
3. **CMS integration** (future)

This allows you to:
- ✅ Change question text without code deployment
- ✅ A/B test different question phrasings
- ✅ Support multiple languages
- ✅ Add/remove questions dynamically
- ✅ Customize validation rules per question

---

## Current Implementation

### Frontend Configuration

**File:** `/data/field-labels.ts`

```typescript
export interface TatttyQuestion {
  id: string;              // Unique identifier (e.g., 'question_one')
  order: number;           // Display order (1, 2, 3...)
  label: string;           // Question heading
  placeholder: string;     // Input placeholder text
  helpText?: string;       // Optional help text below input
  required: boolean;       // Is this question required?
  minCharacters: number;   // Minimum character count
  maxCharacters?: number;  // Optional maximum character count
}

export const tatttyQuestions: TatttyQuestion[] = [
  {
    id: 'question_one',
    order: 1,
    label: 'What does this tattoo mean to you?',
    placeholder: 'Tell your story... (e.g., "My grandmother who raised me passed away last year...")',
    helpText: 'Share the personal meaning, memory, or emotion behind this tattoo',
    required: true,
    minCharacters: 50,
    maxCharacters: 500,
  },
  {
    id: 'question_two',
    order: 2,
    label: 'How do you want it to look?',
    placeholder: 'Describe the visual style... (e.g., "A realistic portrait with flowers, soft colors...")',
    helpText: 'Describe visual elements, symbols, or imagery you envision',
    required: true,
    minCharacters: 50,
    maxCharacters: 500,
  },
];
```

### Helper Functions

```typescript
// Get question by order (1-based)
getTatttyQuestion(order: number): TatttyQuestion | undefined

// Get question by ID
getTatttyQuestionById(id: string): TatttyQuestion | undefined

// Get all questions sorted by order
getAllTatttyQuestions(): TatttyQuestion[]

// Validate question input
validateTatttyQuestion(questionId: string, value: string): {
  isValid: boolean;
  error?: string;
}
```

---

## Database Schema

**Table:** `generator_questions`

```sql
CREATE TABLE generator_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Question configuration
    question_id VARCHAR(50) UNIQUE NOT NULL,
    generator_type VARCHAR(50) NOT NULL REFERENCES generator_types(id),
    
    -- Display order
    order_number INTEGER NOT NULL,
    
    -- Question content
    label TEXT NOT NULL,
    placeholder TEXT NOT NULL,
    help_text TEXT,
    
    -- Validation rules
    required BOOLEAN DEFAULT TRUE,
    min_characters INTEGER DEFAULT 50,
    max_characters INTEGER DEFAULT 500,
    
    -- Display settings
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Multi-language support
    language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata for flexibility
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Ensure unique order per generator and language
    CONSTRAINT unique_question_order UNIQUE (generator_type, order_number, language)
);
```

### Seed Data

Current questions are seeded with:

```sql
INSERT INTO generator_questions (
    question_id, generator_type, order_number, 
    label, placeholder, help_text,
    required, min_characters, max_characters,
    is_active, language
) VALUES
-- Question 1
('question_one', 'tattty', 1,
 'What does this tattoo mean to you?',
 'Tell your story...',
 'Share the personal meaning, memory, or emotion behind this tattoo',
 TRUE, 50, 500, TRUE, 'en'),
 
-- Question 2
('question_two', 'tattty', 2,
 'How do you want it to look?',
 'Describe the visual style...',
 'Describe visual elements, symbols, or imagery you envision',
 TRUE, 50, 500, TRUE, 'en');
```

---

## Usage in Components

### Current Usage (SourceCard)

**File:** `/components/shared/SourceCard.tsx`

```typescript
import { sourceCardLabels } from '../../data';

// Using legacy labels (backward compatible)
<label>{sourceCardLabels.question1}</label>
<label>{sourceCardLabels.question2}</label>
```

### Recommended Usage (Dynamic)

```typescript
import { tatttyQuestions, validateTatttyQuestion } from '../../data';

// Get questions dynamically
const questions = tatttyQuestions;

// Render questions
{questions.map((question) => (
  <div key={question.id}>
    <label>{question.label}</label>
    {question.helpText && <span className="help">{question.helpText}</span>}
    <textarea
      placeholder={question.placeholder}
      minLength={question.minCharacters}
      maxLength={question.maxCharacters}
      required={question.required}
    />
  </div>
))}

// Validate input
const validation = validateTatttyQuestion('question_one', userInput);
if (!validation.isValid) {
  showError(validation.error);
}
```

---

## How to Change Questions

### Option 1: Edit Data File (Quick)

**File:** `/data/field-labels.ts`

```typescript
export const tatttyQuestions: TatttyQuestion[] = [
  {
    id: 'question_one',
    order: 1,
    label: 'NEW QUESTION TEXT HERE',  // ← Change this
    placeholder: 'New placeholder...',
    helpText: 'New help text',
    required: true,
    minCharacters: 50,
    maxCharacters: 500,
  },
  // ...
];
```

**Deployment:** Requires code deploy

---

### Option 2: Update Database (Dynamic)

```sql
-- Update question text
UPDATE generator_questions
SET 
    label = 'What inspired this tattoo idea?',
    placeholder = 'Share your inspiration...',
    help_text = 'Tell us what sparked this tattoo concept',
    updated_at = CURRENT_TIMESTAMP
WHERE question_id = 'question_one'
  AND generator_type = 'tattty'
  AND language = 'en';
```

**Deployment:** No code deploy needed (if using API)

---

### Option 3: CMS Integration (Future)

**API Endpoint:** `GET /api/generator-questions?generator=tattty&language=en`

```json
{
  "questions": [
    {
      "id": "question_one",
      "order": 1,
      "label": "What does this tattoo mean to you?",
      "placeholder": "Tell your story...",
      "helpText": "Share the personal meaning...",
      "required": true,
      "minCharacters": 50,
      "maxCharacters": 500
    },
    {
      "id": "question_two",
      "order": 2,
      "label": "How do you want it to look?",
      "placeholder": "Describe the visual style...",
      "helpText": "Describe visual elements...",
      "required": true,
      "minCharacters": 50,
      "maxCharacters": 500
    }
  ]
}
```

**Frontend Load:**
```typescript
// Load questions from API on app init
const questions = await fetch('/api/generator-questions?generator=tattty&language=en')
  .then(res => res.json())
  .then(data => data.questions);
```

---

## Multi-Language Support

### Database Structure

Each question can have multiple language versions:

```sql
-- English version
INSERT INTO generator_questions (question_id, generator_type, order_number, label, language)
VALUES ('question_one', 'tattty', 1, 'What does this tattoo mean to you?', 'en');

-- Spanish version
INSERT INTO generator_questions (question_id, generator_type, order_number, label, language)
VALUES ('question_one', 'tattty', 1, '¿Qué significa este tatuaje para ti?', 'es');

-- French version
INSERT INTO generator_questions (question_id, generator_type, order_number, label, language)
VALUES ('question_one', 'tattty', 1, 'Que signifie ce tatouage pour vous?', 'fr');
```

### Frontend Query

```sql
-- Get questions for specific language
SELECT * FROM generator_questions
WHERE generator_type = 'tattty'
  AND language = 'es'
  AND is_active = TRUE
ORDER BY order_number ASC;
```

---

## A/B Testing Questions

### Method 1: Metadata Field

Store A/B test variants in metadata:

```sql
-- Version A (control)
UPDATE generator_questions
SET metadata = jsonb_set(
    metadata,
    '{ab_test}',
    '{"variant": "A", "test_id": "meaning_test_1"}'
)
WHERE question_id = 'question_one';

-- Version B (test)
INSERT INTO generator_questions (question_id, generator_type, order_number, label, metadata)
VALUES (
    'question_one_b',
    'tattty',
    1,
    'What personal story inspired this tattoo?',
    '{"ab_test": {"variant": "B", "test_id": "meaning_test_1"}}'
);
```

### Method 2: Feature Flags

```typescript
// Load question based on A/B test group
const userVariant = getUserABTestVariant('meaning_test_1');
const questionId = userVariant === 'B' ? 'question_one_b' : 'question_one';
const question = getTatttyQuestionById(questionId);
```

---

## Adding More Questions

### 3-Question Generator Example

```typescript
export const tatttyQuestions: TatttyQuestion[] = [
  {
    id: 'question_one',
    order: 1,
    label: 'What does this tattoo mean to you?',
    // ...
  },
  {
    id: 'question_two',
    order: 2,
    label: 'How do you want it to look?',
    // ...
  },
  {
    id: 'question_three',  // NEW QUESTION
    order: 3,
    label: 'Where on your body will it go?',
    placeholder: 'Describe the placement... (e.g., "On my forearm, visible when wearing short sleeves...")',
    helpText: 'Consider size, visibility, and how it flows with your body',
    required: false,
    minCharacters: 20,
    maxCharacters: 200,
  },
];
```

**Database:**
```sql
INSERT INTO generator_questions (question_id, generator_type, order_number, label, ...)
VALUES ('question_three', 'tattty', 3, 'Where on your body will it go?', ...);
```

---

## Validation System

### Frontend Validation

```typescript
import { validateTatttyQuestion } from '../../data';

const handleSubmit = () => {
  const questions = getAllTatttyQuestions();
  
  for (const question of questions) {
    const value = getQuestionValue(question.id);
    const validation = validateTatttyQuestion(question.id, value);
    
    if (!validation.isValid) {
      showError(question.label, validation.error);
      return;
    }
  }
  
  // All valid, proceed with generation
  submitGeneration();
};
```

### Backend Validation

```python
# Python backend validation
def validate_tattty_questions(question_one: str, question_two: str) -> dict:
    errors = []
    
    # Load validation rules from database
    questions = db.query(GeneratorQuestion).filter_by(
        generator_type='tattty',
        language='en',
        is_active=True
    ).order_by(GeneratorQuestion.order_number).all()
    
    inputs = [question_one, question_two]
    
    for question, input_text in zip(questions, inputs):
        if question.required and not input_text.strip():
            errors.append(f"{question.label} is required")
        
        if len(input_text.strip()) < question.min_characters:
            errors.append(f"{question.label}: Minimum {question.min_characters} characters")
        
        if question.max_characters and len(input_text.strip()) > question.max_characters:
            errors.append(f"{question.label}: Maximum {question.max_characters} characters")
    
    return {"valid": len(errors) == 0, "errors": errors}
```

---

## API Integration

### Load Questions from Database

**Endpoint:** `GET /api/generator-questions`

```python
@app.get("/api/generator-questions")
async def get_generator_questions(
    generator: str = 'tattty',
    language: str = 'en'
):
    questions = db.query(GeneratorQuestion).filter_by(
        generator_type=generator,
        language=language,
        is_active=True
    ).order_by(GeneratorQuestion.order_number).all()
    
    return {
        "questions": [
            {
                "id": q.question_id,
                "order": q.order_number,
                "label": q.label,
                "placeholder": q.placeholder,
                "helpText": q.help_text,
                "required": q.required,
                "minCharacters": q.min_characters,
                "maxCharacters": q.max_characters
            }
            for q in questions
        ]
    }
```

### Update Questions via API

**Endpoint:** `PUT /api/generator-questions/:id`

```python
@app.put("/api/generator-questions/{question_id}")
async def update_question(question_id: str, data: QuestionUpdate):
    question = db.query(GeneratorQuestion).filter_by(
        question_id=question_id
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    question.label = data.label
    question.placeholder = data.placeholder
    question.help_text = data.help_text
    question.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"success": True, "question": question}
```

---

## Migration from Hardcoded to Dynamic

### Step 1: Keep Backward Compatibility

```typescript
// Old code still works
import { sourceCardLabels } from '../../data';
const q1Label = sourceCardLabels.question1; // ← Legacy

// New code
import { tatttyQuestions } from '../../data';
const q1Label = tatttyQuestions[0].label; // ← Dynamic
```

### Step 2: Update Components

```typescript
// Before (Hardcoded)
<label>What does this tattoo mean to you?</label>

// After (Dynamic)
import { getTatttyQuestion } from '../../data';
const question1 = getTatttyQuestion(1);
<label>{question1.label}</label>
```

### Step 3: Connect to Database

```typescript
// Load questions from API on app init
import { useEffect, useState } from 'react';

export function useDynamicQuestions(generator: string) {
  const [questions, setQuestions] = useState<TatttyQuestion[]>([]);
  
  useEffect(() => {
    fetch(`/api/generator-questions?generator=${generator}`)
      .then(res => res.json())
      .then(data => setQuestions(data.questions));
  }, [generator]);
  
  return questions;
}

// In component
const questions = useDynamicQuestions('tattty');
```

---

## Benefits of Dynamic Questions

### ✅ For Developers
- No code deployment for question changes
- Easy A/B testing
- Multi-language support
- Flexible validation rules

### ✅ For Product Managers
- Test different question phrasings
- Gather user feedback data
- Optimize for conversions
- Localize for different markets

### ✅ For Users
- Clearer, more relevant questions
- Better placeholder examples
- Helpful contextual hints
- Consistent experience across languages

---

## Future Enhancements

### 1. Question Branching
```json
{
  "id": "question_three",
  "showIf": {
    "question_one": {"contains": "memorial"},
    "question_two": {"contains": "portrait"}
  }
}
```

### 2. Dynamic Placeholders
```json
{
  "placeholder": "Tell your story about {{subject}}...",
  "variables": {
    "subject": "extracted from previous answer"
  }
}
```

### 3. AI-Powered Suggestions
```json
{
  "suggestions": [
    "A memorial tattoo honoring someone special",
    "A symbol representing personal growth",
    "A design celebrating a life milestone"
  ]
}
```

### 4. Question Templates
```sql
-- Template for memorial tattoos
INSERT INTO question_templates (name, questions)
VALUES ('memorial', '[{"label": "Who are you remembering?", ...}]');
```

---

## Summary

**Current State:**
- ✅ Questions stored in `/data/field-labels.ts`
- ✅ Helper functions for access and validation
- ✅ Database schema ready (`generator_questions` table)
- ✅ Seed data in SQL schema
- ✅ Backward compatible with legacy code

**To Make Fully Dynamic:**
1. Create API endpoint to fetch questions
2. Update `SourceCard.tsx` to use dynamic questions
3. Add CMS admin panel for editing questions
4. Implement multi-language loading
5. Add A/B testing framework

**Files Updated:**
- `/data/field-labels.ts` - Dynamic question structure
- `/database_schema.sql` - `generator_questions` table + seed data
- This documentation file

**The two questions are now configurable and ready for CMS integration!**
