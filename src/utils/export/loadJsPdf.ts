/** Satu pintu dynamic-import jspdf — jangan di-import dari modul first-load. */
export async function loadJsPdf() {
  const { jsPDF } = await import('jspdf');
  return jsPDF;
}
