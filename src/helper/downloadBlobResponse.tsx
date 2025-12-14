import { AxiosResponse } from "axios";

export function downloadBlobResponse(
  resp: AxiosResponse<any>,
  filename = "file.bin",
  mimeType?: string
) {
  let blob: Blob;
  if (resp.data instanceof Blob) {
    blob = resp.data;
  } else if (resp.data instanceof ArrayBuffer) {
    blob = new Blob([resp.data], {
      type: mimeType ?? "application/octet-stream",
    });
  } else {
    blob = new Blob([JSON.stringify(resp.data)], {
      type: mimeType ?? "application/octet-stream",
    });
  }

  const finalBlob = mimeType ? blob.slice(0, blob.size, mimeType) : blob;
  const url = window.URL.createObjectURL(finalBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
