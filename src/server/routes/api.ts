import express from 'express';
import { generatePDF } from '../services/pdfService';
import { validateCurriculumData } from '../middleware/validation';

const router = express.Router();

// Endpoint para gerar currículo em PDF
router.post('/generate-curriculum', validateCurriculumData, async (req, res) => {
  try {
    const curriculumData = req.body;
    
    console.log('📄 Gerando currículo para:', curriculumData.nome || 'Usuário');
    
    const pdfBuffer = await generatePDF(curriculumData);
    
    const fileName = curriculumData.nome 
      ? `Curriculo_${curriculumData.nome.replace(/\s+/g, '_')}.pdf`
      : 'Curriculo.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    res.status(500).json({
      error: 'Erro ao gerar currículo',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para validar dados do currículo
router.post('/validate-curriculum', validateCurriculumData, (req, res) => {
  res.json({
    success: true,
    message: 'Dados válidos',
    data: req.body
  });
});

// Endpoint de status da API
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-curriculum': 'Gerar currículo em PDF',
      'POST /api/validate-curriculum': 'Validar dados do currículo',
      'GET /api/status': 'Status da API'
    }
  });
});

export default router;