import { ID, storage } from "@/appwrite";
const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "64b923fe775b413e6df6", // bucket id
    ID.unique(),
    file
  );
  return fileUploaded;
};
export default uploadImage;
