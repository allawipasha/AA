# CLFP Study Guide App

Simple browser app for CLFP exam prep with:

- Domain filtering
- Flashcard mode
- Quiz mode with answer checking
- Progress tracking

## Run locally

```bash
python -m http.server 4173
```

Open http://localhost:4173 in a browser.

## Updating questions

Edit `data/questions.js` and add objects in this format:

```js
{
  domain: 'Domain Name',
  question: 'Question text',
  choices: ['A', 'B', 'C', 'D'],
  answerIndex: 1,
  explanation: 'Why this is correct',
}
```

> Note: Use the latest official CLFP handbook/objectives as the source of truth when expanding the question bank.
