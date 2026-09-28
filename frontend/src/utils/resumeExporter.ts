import { resumeApi } from '../services/api';

export const downloadResumeFile = async (
  title: string, 
  content: string, 
  format: 'PDF' | 'DOCX' | 'TXT' = 'PDF', 
  companyName?: string, 
  targetRole?: string
) => {
  const safeTitle = (title || 'CareerPilot_Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${safeTitle}.${format.toLowerCase()}`;

  // Automatically attempt saving version to backend
  if (companyName || targetRole) {
    try {
      await resumeApi.createVersion(
        `${companyName || 'Target'} - ${targetRole || 'Role'} Version`,
        targetRole || 'Software Engineer',
        companyName || 'Target Company',
        content
      );
    } catch {}
  }

  if (format === 'PDF') {
    try {
      const blob = await resumeApi.exportPdf(title, content, safeTitle);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return;
    } catch (e) {
      // Printable HTML fallback for PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title || 'CareerPilot Resume'}</title>
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 16px; }
                h2 { font-size: 14px; text-transform: uppercase; color: #444; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; }
                p, li { font-size: 13px; }
                ul { padding-left: 20px; }
              </style>
            </head>
            <body>
              <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; font-size: 13px;">${content}</pre>
              <script>window.onload = function() { window.print(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }
  }

  if (format === 'DOCX') {
    const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + title + '</title></head><body><pre style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">';
    const footer = '</pre></body></html>';
    const html = header + content + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  }

  // TXT Format
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.txt`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
