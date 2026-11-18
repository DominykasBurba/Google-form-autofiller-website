import React from 'react';

function ChoiceMark({ checked, kind }) {
  return <span className={`choice-mark ${kind}`} data-checked={checked} role="img" aria-label={checked ? 'Selected' : 'Not selected'} />;
}

function Grid({ field, applied }) {
  const kind = field.type === 'checkbox-grid' ? 'checkbox' : 'radio';

  return (
    <table className="demo-grid">
      <caption>{field.question}</caption>
      <thead><tr><td />{field.options.map(option => <th scope="col" key={option}>{option}</th>)}</tr></thead>
      <tbody>
        {field.rows.map(row => (
          <tr key={row.question}>
            <th scope="row">{row.question}</th>
            {field.options.map((option, index) => (
              <td key={option}><ChoiceMark kind={kind} checked={applied[row.question]?.includes(index) ?? false} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DropdownPreview({ field, value }) {
  const selectedIndex = value?.[0];
  const selectedValue = selectedIndex === undefined ? '' : String(selectedIndex);

  return (
    <div className="demo-dropdown-wrap">
      <select
        className="demo-dropdown"
        value={selectedValue}
        onChange={event => { event.currentTarget.value = selectedValue; }}
        aria-readonly="true"
        aria-label={`${field.question} dropdown preview`}
      >
        <option value="">Select an option</option>
        {field.options.map((option, index) => <option value={index} key={option}>{option}</option>)}
      </select>
      <span className="demo-dropdown-arrow" aria-hidden="true">⌄</span>
    </div>
  );
}

export function ExampleField({ field, applied }) {
  if (field.rows) return <div className="demo-question"><Grid field={field} applied={applied} /></div>;
  const value = applied[field.question];
  const dropdown = field.type === 'dropdown';

  return (
    <div className="demo-question">
      <span>{field.question}</span>
      {dropdown ? (
        <DropdownPreview field={field} value={value} />
      ) : field.options ? (
        <ul className="demo-options">
          {field.options.map((option, index) => (
            <li key={option}><ChoiceMark kind={field.type} checked={value?.includes(index) ?? false} />{option}</li>
          ))}
        </ul>
      ) : (
        <span className="demo-answer" data-filled={value !== undefined}>
          {value ?? 'Your answer'}
        </span>
      )}
    </div>
  );
}
