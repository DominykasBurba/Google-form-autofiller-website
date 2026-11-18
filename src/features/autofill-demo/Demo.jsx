import React, { useState } from 'react';
import { Button } from '../../shared/components.jsx';
import { ExampleField } from './ExampleField.jsx';
import { matchAnswer } from './matchAnswer.js';
import { scenarios, savedAnswers } from './scenarios.js';
import './demo.css';

export function Demo() {
  const [active, setActive] = useState(0);
  const [edits, setEdits] = useState({});
  const [applied, setApplied] = useState({});
  const [feedback, setFeedback] = useState(null);
  const scenario = scenarios[active];
  const answers = savedAnswers(scenario.fields);

  function reset() {
    setEdits({});
    setApplied({});
    setFeedback(null);
  }

  function fill(event) {
    event.preventDefault();
    const matches = {};
    const invalid = [];

    for (const entry of answers) {
      const input = edits[entry.question] ?? entry.answer;
      if (!input.trim()) continue;
      const value = matchAnswer(input, entry);
      if (value === null) invalid.push(entry.question);
      else matches[entry.question] = value;
    }

    setApplied(previous => ({ ...previous, ...matches }));
    setFeedback({ count: Object.keys(matches).length, invalid });
  }

  return (
    <figure className="demo">
      <figcaption className="demo-heading">
        <span className="demo-dot" aria-hidden="true" />
        Autofill demo
        <button type="button" className="demo-reset" onClick={reset} disabled={!feedback && !Object.keys(edits).length}>Reset</button>
      </figcaption>
      <div className="demo-examples" role="group" aria-label="Select a demo example">
        {scenarios.map(({ label }, index) => (
          <Button key={label} variant="secondary" className="demo-example-button" aria-pressed={active === index} onClick={() => {
            if (active === index) return;
            setActive(index);
            reset();
          }}>{label}</Button>
        ))}
      </div>
      <div className="demo-workspace">
        <div className="demo-form">
          <span className="demo-label">Example form</span>
          <h2>{scenario.title}</h2>
          {scenario.fields.map(field => <ExampleField field={field} applied={applied} key={field.question} />)}
        </div>
        <form className="demo-drawer" onSubmit={fill}>
          <span className="demo-label">Saved answers</span>
          <div className="demo-pairs" key={scenario.label}>
            {answers.map(({ question, answer }) => (
              <label key={question}>
                <span>{question}</span>
                <input
                  type="text"
                  value={edits[question] ?? answer}
                  placeholder="Enter an answer"
                  aria-invalid={feedback?.invalid.includes(question) || undefined}
                  onChange={event => {
                    const value = event.target.value;
                    setEdits(previous => ({ ...previous, [question]: value }));
                    setFeedback(null);
                  }}
                />
              </label>
            ))}
          </div>
          {answers.some(answer => answer.options) && (
            <p className="demo-hint">{answers.some(answer => answer.multiple)
              ? 'Separate option names or numbers with commas, like 1, 3.'
              : 'Use an option name or its number, starting at 1.'}</p>
          )}
          <Button className="demo-fill" type="submit">Save &amp; Fill</Button>
        </form>
      </div>
      <p className="demo-status" role="status">
        {feedback ? (
          <>
            {`${feedback.count} ${feedback.count === 1 ? 'answer' : 'answers'} filled.`}
            {feedback.invalid.length > 0 && ` Check the option for ${feedback.invalid.join(', ')}.`}
          </>
        ) : 'Edit a saved answer, then select Save & Fill.'}
      </p>
    </figure>
  );
}
