import { v4 as uuidv4 } from "uuid";

export const userFileKey = async (
  userId: string,
  fileType: string,
  originalFilename: string
): Promise<string> => {
  const fileExtension = originalFilename.split(".").pop();
  const uniqueId = uuidv4();

  return `users/${userId}/${fileType}/${uniqueId}.${fileExtension}`;
};
