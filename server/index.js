const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const PDFTable = require('pdfkit-table'); // Add this at the top
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/underwriting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const reportSchema = new mongoose.Schema({
  address: String,
  type: String,
  yearBuilt: Number,
  sqFt: Number,
  units: Number,
  value: Number,
  grossRent: Number,
  vacancy: Number,
  expenses: Number,
  noi: Number,
  capRate: Number,
  dscr: Number,
  crimeScore: Number,
  walkScore: Number,
  medianIncome: Number,
  populationDensity: Number,
  schoolRating: Number,
  date: { type: Date, default: Date.now },
  summary: String,
  files: [{
    filename: String,
    originalname: String,
    path: String,
  }],
});
const Report = mongoose.model('Report', reportSchema);

app.use(cors());
app.use(bodyParser.json());

const mockPropertyInfo = {
  yearBuilt: 1995,
  sqFt: 2500,
  type: 'Multifamily',
  units: 4,
  value: 750000,
  image: '',
  grossRent: 60000,
  vacancy: 5,
  expenses: 20000,
  noi: 37000,
  capRate: 4.9,
  dscr: 1.4,
  crimeScore: 7,
  walkScore: 82,
  medianIncome: 85000,
  populationDensity: 12000,
  schoolRating: 8,
};

app.post('/api/property/info', (req, res) => {
  const { address } = req.body;
  res.json({
    address,
    ...mockPropertyInfo,
  });
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.post('/api/property/underwrite', upload.array('files'), async (req, res) => {
  const { address, assumptions } = req.body;
  const summary = mockPropertyInfo.dscr > 1.25 ? 'Low risk' : mockPropertyInfo.dscr > 1.1 ? 'Medium risk' : 'High risk';
  const fileInfos = req.files ? req.files.map(f => ({ filename: f.filename, originalname: f.originalname, path: f.path })) : [];
  const reportData = {
    address,
    ...mockPropertyInfo,
    summary,
    files: fileInfos,
  };
  // Save to MongoDB
  try {
    await Report.create(reportData);
  } catch (err) {
    console.error('Error saving report:', err);
  }
  res.json({
    ...reportData,
    assumptions: assumptions || {},
    returnEstimate: 0.08,
  });
});

app.post('/api/property/report', (req, res) => {
  const { address } = req.body;
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="underwriting-report.pdf"');
  doc.pipe(res);

  // Title
  doc
    .fontSize(24)
    .fillColor('#1e3a8a')
    .text('PropIntel AI – Underwriting Report', { align: 'center', underline: true });
  doc.moveDown(1);

  // Helper to draw a table
  function drawTable(doc, title, data, startY) {
    const startX = doc.page.margins.left;
    const colWidths = [170, 230];
    const rowHeight = 24;
    // Section title
    doc.fontSize(16).fillColor('#1e3a8a').text(title, startX, startY);
    let y = doc.y + 8;
    // Header row
    doc.rect(startX, y, colWidths[0] + colWidths[1], rowHeight).fill('#1e3a8a');
    doc
      .fillColor('white')
      .fontSize(12)
      .text(data[0][0], startX + 8, y + 6, { width: colWidths[0] - 16, align: 'left' })
      .text(data[0][1], startX + colWidths[0] + 8, y + 6, { width: colWidths[1] - 16, align: 'left' });
    // Data rows
    for (let i = 1; i < data.length; i++) {
      const rowY = y + i * rowHeight;
      doc
        .rect(startX, rowY, colWidths[0], rowHeight)
        .stroke()
        .rect(startX + colWidths[0], rowY, colWidths[1], rowHeight)
        .stroke();
      doc
        .fillColor('black')
        .text(data[i][0], startX + 8, rowY + 6, { width: colWidths[0] - 16, align: 'left' })
        .text(data[i][1], startX + colWidths[0] + 8, rowY + 6, { width: colWidths[1] - 16, align: 'left' });
    }
    doc.moveDown(2);
    return y + data.length * rowHeight;
  }

  // Property Details Table
  const propertyDetails = [
    ['Field', 'Value'],
    ['Address', address],
    ['Type', mockPropertyInfo.type],
    ['Year Built', mockPropertyInfo.yearBuilt],
    ['Sq. Ft.', mockPropertyInfo.sqFt],
    ['Units', mockPropertyInfo.units],
    ['Estimated Value', `$${mockPropertyInfo.value.toLocaleString()}`],
  ];
  let y = drawTable(doc, 'Property Details', propertyDetails, doc.y);

  // Financial Estimates Table
  const financials = [
    ['Field', 'Value'],
    ['Gross Rent', `$${mockPropertyInfo.grossRent.toLocaleString()}`],
    ['Vacancy', `${mockPropertyInfo.vacancy}%`],
    ['Operating Expenses', `$${mockPropertyInfo.expenses.toLocaleString()}`],
    ['NOI', `$${mockPropertyInfo.noi.toLocaleString()}`],
    ['Cap Rate', `${mockPropertyInfo.capRate}%`],
    ['DSCR', mockPropertyInfo.dscr],
  ];
  y = drawTable(doc, 'Financial Estimates', financials, y + 10);

  // Demographics & Risk Table
  const risk = [
    ['Field', 'Value'],
    ['Crime Score', `${mockPropertyInfo.crimeScore}/10`],
    ['Walk Score', `${mockPropertyInfo.walkScore}/100`],
    ['Median Income', `$${mockPropertyInfo.medianIncome.toLocaleString()}`],
    ['Population Density', `${mockPropertyInfo.populationDensity} /sq mi`],
    ['School Rating', `${mockPropertyInfo.schoolRating}/10`],
  ];
  drawTable(doc, 'Demographics & Risk', risk, y + 10);

  // Footer
  doc
    .fontSize(10)
    .fillColor('#1e3a8a')
    .text('PropIntel AI – Intelligent Real Estate Underwriting Platform', doc.page.margins.left, doc.page.height - 40, {
      align: 'center',
    });
  doc
    .fontSize(9)
    .fillColor('gray')
    .text(`Generated: ${new Date().toLocaleDateString()}`, doc.page.margins.left, doc.page.height - 28, {
      align: 'center',
    });

  doc.end();
});

app.get('/api/history', async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 }).limit(10);
    res.json(
      reports.map((r) => ({
        address: r.address,
        date: r.date.toISOString().slice(0, 10),
        summary: r.summary,
      }))
    );
  } catch (err) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 