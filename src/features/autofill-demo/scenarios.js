export const scenarios = [
  {
    label: 'Text & dropdown',
    title: 'Event registration',
    fields: [
      { question: 'Your city?', type: 'text', answer: 'Vilnius' },
      { question: 'Preferred contact method?', type: 'dropdown', options: ['Email', 'Phone', 'Text message'], answer: 'Email' }
    ]
  },
  {
    label: 'Multiple choice',
    title: 'Workshop feedback',
    fields: [
      { question: 'How was the pace?', type: 'radio', options: ['Too slow', 'Just right', 'Too fast'], selected: [1] }
    ]
  },
  {
    label: 'Checkboxes',
    title: 'Workshop registration',
    fields: [
      { question: 'Which topics interest you?', type: 'checkbox', options: ['Accessibility', 'Design systems', 'Forms'], selected: [0, 2] }
    ]
  },
  {
    label: 'Choice grid',
    title: 'Session feedback',
    fields: [
      {
        question: 'Rate each session',
        type: 'radio-grid',
        options: ['Fair', 'Good', 'Great'],
        rows: [
          { question: 'Keynote', selected: [2] },
          { question: 'Workshop', selected: [1] }
        ]
      }
    ]
  },
  {
    label: 'Checkbox grid',
    title: 'Volunteer availability',
    fields: [
      {
        question: 'Choose available times',
        type: 'checkbox-grid',
        options: ['AM', 'PM', 'Evening'],
        numeric: true,
        rows: [
          { question: 'Monday', selected: [0, 2] },
          { question: 'Thursday', selected: [1] }
        ]
      }
    ]
  }
];

export function savedAnswers(fields) {
  return fields.flatMap(field => (field.rows ?? [field]).map(({ question, answer, selected }) => ({
    question,
    options: field.options,
    multiple: field.type === 'checkbox' || field.type === 'checkbox-grid',
    answer: answer ?? selected.map(index => field.numeric ? index + 1 : field.options[index]).join(', ')
  })));
}
