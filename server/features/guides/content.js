export const guides = [
  {
    id: 'getting-started', title: 'Fill your first form',
    summary: 'Save a question and answer, then reuse them on a matching form.',
    steps: [
      'Open a Google Form and click the extension icon to open the drawer.',
      'Select Add Field. Enter the question as it appears on the form, without the leading number or required asterisk.',
      'Enter your answer and select Save & Fill. Review the filled answers before submitting the form yourself.'
    ],
    example: ['Your city?', 'Vilnius']
  },
  {
    id: 'choice-questions', title: 'Multiple choice, dropdowns & scales',
    summary: 'Choose a single option by its position or label.',
    steps: [
      'Enter the question text, then use a number like 2 to select the second option.',
      'You can also enter the exact option label. Use a position if labels are duplicated or numeric.',
      'Skip the dropdown placeholder when counting. On a scale that starts at zero, 1 still selects the first option.'
    ],
    example: ['Preferred contact method?', 'Email']
  },
  {
    id: 'checkboxes', title: 'Checkboxes & grids',
    summary: 'Select several options or save a separate answer for each grid row.',
    steps: [
      'For checkboxes, separate option positions or labels with commas. Use positions for labels containing commas.',
      'For grids, enter each row label as its own saved question. Use one column for a multiple-choice grid or several for a checkbox grid.',
      'Check the form’s rules after filling. A required grid may need an answer in every row.'
    ],
    example: ['Available days?', 'Monday, Thursday']
  },
  {
    id: 'random-lists', title: 'Random answers for testing',
    summary: 'Choose from a list of sample answers for repeatable form testing.',
    steps: [
      'Open Random Fill in the drawer and select Add List.',
      'Name the list, enter comma-separated values, and select Save Lists.',
      'Use @random(cities) as the answer for a list named cities. Save & Fill chooses a value and reuses it until you save again.'
    ],
    example: ['Your city?', '@random(cities)']
  }
];
