import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import React from 'react';

export const printPDF = (element: HTMLElement, fileName: string) => {
  // html2canvas(element)
  //   .then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'JPEG', 0, 0, 0);
  //     pdf.save(`${fileName}.pdf`);
  //   })
  // ;
}
