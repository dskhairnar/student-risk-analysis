export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { csvRow } = req.body;
    const fs = await import('fs');
    const path = await import('path');
    
    const dataPath = path.join(process.cwd(), 'src', 'data.csv');
    await fs.promises.appendFile(dataPath, '\n' + csvRow);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error appending student data:', error);
    res.status(500).json({ error: 'Failed to save student data' });
  }
}