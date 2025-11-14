export interface ParsedEmail {
  batchYear: number;
  rollNumber: string;
  branchAcronym: string;
  branch: string;
  isValid: boolean;
}

const branchMap: { [key: string]: string } = {
  'bcs': 'CSE',
  'bds': 'DSAI',
  'bec': 'ECE',
};

export function parseCollegeEmail(email: string): ParsedEmail {
  const result: ParsedEmail = {
    batchYear: 0,
    rollNumber: '',
    branchAcronym: '',
    branch: '',
    isValid: false,
  };

  try {
    // Format: 23bcs057@iiitdwd.ac.in
    // Extract the part before @
    const localPart = email.split('@')[0];
    
    if (!localPart) {
      return result;
    }

    // Pattern: YYbranchROLL (e.g., 23bcs057)
    // Extract batch year (first 2 digits)
    const batchMatch = localPart.match(/^(\d{2})/);
    if (!batchMatch) {
      return result;
    }

    const batchDigits = parseInt(batchMatch[1]);
    result.batchYear = 2000 + batchDigits; // Convert 23 to 2023

    // Extract branch acronym (3 letters after batch year)
    const branchMatch = localPart.match(/^\d{2}([a-z]{3})/);
    if (!branchMatch) {
      return result;
    }

    result.branchAcronym = branchMatch[1].toLowerCase();
    result.branch = branchMap[result.branchAcronym] || result.branchAcronym.toUpperCase();

    // Extract roll number (3 digits after branch)
    const rollMatch = localPart.match(/^\d{2}[a-z]{3}(\d{3})/);
    if (!rollMatch) {
      return result;
    }

    result.rollNumber = rollMatch[1];
    result.isValid = true;

    return result;
  } catch (error) {
    console.error('Error parsing email:', error);
    return result;
  }
}

