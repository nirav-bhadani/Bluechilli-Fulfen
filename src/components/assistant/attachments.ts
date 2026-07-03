export interface Attachment {
  id: string;
  name: string;
  dataUrl: string;
  isImage: boolean;
}

const MAX_FILES = 4;
const MAX_BYTES = 4 * 1024 * 1024; // 4MB per file

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(files: FileList | File[]): Promise<Attachment[]> {
  const list = Array.from(files).slice(0, MAX_FILES);
  const out: Attachment[] = [];
  for (const file of list) {
    if (file.size > MAX_BYTES) continue;
    try {
      const dataUrl = await readAsDataUrl(file);
      out.push({
        id: `${file.name}_${file.size}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        dataUrl,
        isImage: file.type.startsWith("image/"),
      });
    } catch {
      // Skip unreadable files.
    }
  }
  return out;
}
