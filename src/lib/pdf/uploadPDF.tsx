import { extractTextFromPDF, type ExtractionProgress } from "@/lib/pdf/processPDF.ts";

const uploadPDF = async (file: File, onProgress?: ExtractionProgress, signal?: AbortSignal) => {
  if (!file || !(file instanceof File)) {
    throw new Error("No PDF file provided");
  }

  if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
    throw new Error("File must be a PDF");
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    const result = await extractTextFromPDF(arrayBuffer, onProgress, signal);

    if (!result.success) {
      throw new Error(result.error ?? "Failed to process PDF");
    }

    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      message: "PDF processed successfully",
      document: result.document,
      pageCount: result.pageCount,
      pages: result.pages,
      detectedImages: result.detectedImages,
      metadata: result.metadata,
    };
  } catch (error) {
    console.error("Failed to process upload", error);

    throw error;
  }
};

export default uploadPDF;
