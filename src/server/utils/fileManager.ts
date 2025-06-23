import fs from "fs";
import path from "path";

// Function to ensure existance of a dir, and create if not exists
export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory has created sucessfully! ${dirPath}`);
  }
}

// Function to delete one file
export function deleteFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File has been deleted sucessfully! ${filePath}`);
    } else {
      console.warn(`The file not exists, file not deleted! ${filePath}`);
    }
  } catch (error) {
    console.error(`Error when file has deleted! ${filePath}: `, error);
  }
}

// Function to clean all files on directory
export function cleanDirectory(dirPath: string) {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        fs.unlinkSync(filePath);
      }
      console.log(`Directory ${dirPath} are clean now!`);
    }
  } catch (error) {
    console.error(`Error when cleaning the directory ${dirPath}: `, error);
  }
}

// Function to change the file extension name
export function changeFileExtension(filePath: string, newExt: string) {
  return filePath.replace(
    /\.\w+$/,
    newExt.startsWith(".") ? newExt : `.${newExt}`
  );
}
