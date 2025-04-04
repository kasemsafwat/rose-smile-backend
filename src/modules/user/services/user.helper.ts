export const userFileKey = async (
  userId: string,
  fileType: string,
  originalFilename: string
): Promise<string> => {
  const fileExtension = originalFilename.split(".").pop();

  return `users/${userId}/${fileType}/${fileExtension}`;
};
