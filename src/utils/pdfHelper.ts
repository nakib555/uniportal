export const openPdfInNativeViewer = (doc: any, title: string = 'PDF Document') => {
  const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  try {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html style="margin: 0; padding: 0; height: 100%; overflow: hidden;">
          <head><title>${title}</title></head>
          <body style="margin: 0; padding: 0; height: 100%; overflow: hidden;">
            <embed src="${url}" type="application/pdf" width="100%" height="100%" style="border: none;" />
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      window.open(url, '_blank');
    }
  } catch (err) {
    window.open(url, '_blank');
  }
};
