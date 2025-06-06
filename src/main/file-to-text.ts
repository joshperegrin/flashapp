import mammoth from 'mammoth';
import JSZip from 'jszip';
import pdfParse from 'pdf-parse';
import path from 'path';
import fs from 'fs';

export async function getTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.docx':
      return await extractDocxText(filePath);
    case '.pdf':
      return await extractPdfText(filePath);
    case '.pptx':
      return await extractPptxText(filePath);
    case '.txt':
      return await extractTxtText(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}


async function extractDocxText(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractPdfText(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractPptxText(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buffer);

  let fullText = '';

  const slideFiles = Object.keys(zip.files).filter(name =>
    name.match(/^ppt\/slides\/slide\d+\.xml$/)
  );

  for (const fileName of slideFiles) {
    const content = await zip.files[fileName].async('text');
    const textMatches = [...content.matchAll(/<a:t>(.*?)<\/a:t>/g)];
    const slideText = textMatches.map(match => match[1]).join(' ');
    fullText += slideText + '\n';
  }

  return fullText;
}

async function extractTxtText(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

