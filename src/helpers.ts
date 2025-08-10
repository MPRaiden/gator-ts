/**
 * Validates user ordering input and returns. If invalid return default DESC ordering.
 *
 * @param {string} userInput - users input, should be a valid input option.
 */
export function validateOrderingInput(userInput: string): 'DESC' | 'ASC' {
  if (userInput.toUpperCase() === 'ASC') {
    return 'ASC'
  }

  if (userInput.toUpperCase() === 'DESC') {
    return 'DESC'
  }

  console.warn(`Expected 'DESC' or 'ASC' as ordering put but got ${userInput}, please try again. Ordering by DESC now.`)
  return 'DESC'
}

