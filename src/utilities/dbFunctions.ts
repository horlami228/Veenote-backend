// Define a generic type for the model's document type
type TModel<T> = {
  find: (conditions: any) => Promise<T[]>; // Adjust return type if needed
};
import mongoose from "mongoose";

export async function getModelBy<T> (
  model: TModel<T>,
  key: string,
  value: mongoose.Types.ObjectId
): Promise<T[]> {
  try {
    const records = await model.find({ [key]: value });
    return records;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  // Explicitly return undefined if function reaches here (unexpected)
  return [];
}

