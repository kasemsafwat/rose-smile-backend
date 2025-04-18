const compareArrays = (arr1: string[], arr2: string[]) => {
  return arr1.every((id) => arr2.includes(id));
};

export default compareArrays;
