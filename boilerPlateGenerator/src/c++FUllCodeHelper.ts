export const InputSimpleDateTypes = <T>(
  dataType: T,
  dataTypeName: string,
): string => {
  let inputCode = "";

  inputCode += `${dataType} ${dataTypeName}; \n`;
  inputCode += `cin >> ${dataTypeName}; \n`;

  return inputCode;
};

function extractValueForSingleVector(input: string): string | null {
  const regex = /<([^>]+)>/;
  const match = input.match(regex);
  return match ? match[1] : null;
}

function extractInnermostValue(input: string): string | null {
  const regex = /<([^<>]*)>/g;
  let match;
  let innermostValue = null;

  while ((match = regex.exec(input)) !== null) {
    innermostValue = match[1]; // Keep updating innermostValue with the last match
  }

  return innermostValue;
}

// INPUTSINGLEVECTOR LIKE VECTOR<ANY TYPE>
export const InputSingleVector = (
  dataType: string,
  dataTypeName: string,
  cnt: number,
): string => {
  // TAKE INPUT
  let inputCode = "";
  inputCode += `int size_${cnt}; \n`;
  inputCode += `cin >> size_${cnt}; \n`;

  // DEFINE VECTOR
  inputCode += `${dataType} ${dataTypeName}(size_${cnt}); \n`;

  // INPUT VECTOR
  inputCode += `
  for(int i = 0; i < size_${cnt}; i++){
    cin >> ${dataTypeName}[i];
  } \n`;

  return inputCode;
};

// INPUT <vector<vector<data type >>

export const InputMultipleVector = (
  dataType: string,
  dataTypeName: string,
  cnt: number,
): string => {
  let inputCode = "";

  // AS IT IS A 2D VECTOR WE HAVE TO TAKE BOTH N AND M AS INPUT

  inputCode += `int n_${cnt}; \n`;
  inputCode += `cin >> n_${cnt}; \n`;
  inputCode += `int m_${cnt}; \n`;
  inputCode += `cin >> m_${cnt}; \n`;

  let vectorDataType = extractInnermostValue(dataType);

  // DEFINE VECTOR

  inputCode += `${dataType} ${dataTypeName} (n_${cnt},vector<${vectorDataType}>(m_${cnt})); \n`;
  console.log("inputCode " + inputCode);

  inputCode += `
for(int i=0; i<n_${cnt}; i++){
    for(int j=0; j<m_${cnt}; j++){
cin >>${dataTypeName}[i][j]; 
    }
}
`;

  // INPUT VECTOR
  //

  return inputCode;
};
