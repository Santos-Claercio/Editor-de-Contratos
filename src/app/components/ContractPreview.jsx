import { useState, useRef, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Printer, Edit, ArrowLeft } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const contractTemplates = {
  locacao: (data) => `
<h1 style="text-align: center;"><strong>CONTRATO DE LOCAÇÃO DE IMÓVEL</strong></h1>
<p><br></p>
<p>Por este instrumento particular de contrato de locação, de um lado:</p>
<p><br></p>
<p><strong>LOCADOR:</strong></p>
<p>Nome: ${data.nomeCompleto}</p>
<p>CPF: ${data.cpf}</p>
<p>RG: ${data.identidade}</p>
<p>Endereço: ${data.logradouro}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}, ${data.bairro}, ${data.cidade}/${data.estado}, CEP: ${data.cep}</p>
<p><br></p>
<p><strong>OBJETO DO CONTRATO:</strong></p>
<p>O LOCADOR dá em locação ao LOCATÁRIO o imóvel situado em:</p>
<p>${data.imovelEndereco || 'Endereço do imóvel não informado'}</p>
<p><br></p>
<p><strong>PRAZO E VALOR:</strong></p>
<p>O presente contrato terá vigência de ${data.prazo || 'XX'} meses, iniciando-se em ${data.dataContrato || '__/__/____'}, pelo valor mensal de R$ ${data.valor ? parseFloat(data.valor).toFixed(2) : '0,00'}.</p>
<p><br></p>
<p><strong>CLÁUSULA PRIMEIRA - DO ALUGUEL:</strong></p>
<p>O LOCATÁRIO pagará ao LOCADOR, a título de aluguel, a importância mensal de R$ ${data.valor ? parseFloat(data.valor).toFixed(2) : '0,00'}, até o dia 10 de cada mês.</p>
<p><br></p>
<p><strong>CLÁUSULA SEGUNDA - DA DESTINAÇÃO DO IMÓVEL:</strong></p>
<p>O imóvel destina-se exclusivamente para fins residenciais, não podendo ser utilizado para outra finalidade sem prévia autorização por escrito do LOCADOR.</p>
<p><br></p>
<p><strong>CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO LOCATÁRIO:</strong></p>
<p>São obrigações do LOCATÁRIO:</p>
<p>a) Pagar pontualmente o aluguel;</p>
<p>b) Manter o imóvel em bom estado de conservação;</p>
<p>c) Restituir o imóvel ao término do contrato nas mesmas condições em que o recebeu.</p>
<p><br></p>
<p>E por estarem justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
<p><br></p>
<p>${data.cidade || '___________'}, ${data.dataContrato || '____ de __________ de ____'}.</p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p style="text-align: center;">LOCADOR                                    LOCATÁRIO</p>
<p><br></p>
<p><strong>Testemunhas:</strong></p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p>Nome:                                          Nome:</p>
<p>CPF:                                           CPF:</p>
  `,

  'prestacao-servicos': (data) => `
<h1 style="text-align: center;"><strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong></h1>
<p><br></p>
<p>Por este instrumento particular de contrato de prestação de serviços:</p>
<p><br></p>
<p><strong>CONTRATANTE:</strong></p>
<p>Nome: ${data.nomeCompleto}</p>
<p>CPF: ${data.cpf}</p>
<p>RG: ${data.identidade}</p>
<p>Endereço: ${data.logradouro}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}, ${data.bairro}, ${data.cidade}/${data.estado}, CEP: ${data.cep}</p>
<p><br></p>
<p><strong>OBJETO DO CONTRATO:</strong></p>
<p>${data.descricaoServico || 'Descrição dos serviços a serem prestados'}</p>
<p><br></p>
<p><strong>CLÁUSULA PRIMEIRA - DO SERVIÇO:</strong></p>
<p>O CONTRATADO prestará ao CONTRATANTE os serviços descritos no objeto deste contrato, com dedicação e profissionalismo.</p>
<p><br></p>
<p><strong>CLÁUSULA SEGUNDA - DO VALOR:</strong></p>
<p>Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${data.valor ? parseFloat(data.valor).toFixed(2) : '0,00'}.</p>
<p><br></p>
<p><strong>CLÁUSULA TERCEIRA - DA FORMA DE PAGAMENTO:</strong></p>
<p>O pagamento será realizado conforme acordado entre as partes.</p>
<p><br></p>
<p><strong>CLÁUSULA QUARTA - DAS OBRIGAÇÕES:</strong></p>
<p>São obrigações do CONTRATADO:</p>
<p>a) Executar os serviços com qualidade e dentro dos prazos estabelecidos;</p>
<p>b) Responder por eventuais danos causados durante a execução dos serviços;</p>
<p>c) Manter sigilo sobre informações confidenciais.</p>
<p><br></p>
<p><strong>CLÁUSULA QUINTA - DA RESCISÃO:</strong></p>
<p>O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de 30 dias.</p>
<p><br></p>
<p>E por estarem justos e contratados, firmam o presente instrumento.</p>
<p><br></p>
<p>${data.cidade || '___________'}, ${data.dataContrato || '____ de __________ de ____'}.</p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p style="text-align: center;">CONTRATANTE                              CONTRATADO</p>
  `,

  'compra-venda': (data) => `
<h1 style="text-align: center;"><strong>CONTRATO DE COMPRA E VENDA</strong></h1>
<p><br></p>
<p>Por este instrumento particular de compra e venda:</p>
<p><br></p>
<p><strong>VENDEDOR:</strong></p>
<p>Nome: ${data.nomeCompleto}</p>
<p>CPF: ${data.cpf}</p>
<p>RG: ${data.identidade}</p>
<p>Endereço: ${data.logradouro}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}, ${data.bairro}, ${data.cidade}/${data.estado}, CEP: ${data.cep}</p>
<p><br></p>
<p><strong>OBJETO DA VENDA:</strong></p>
<p>${data.descricaoServico || 'Descrição do bem objeto da venda'}</p>
<p><br></p>
<p><strong>CLÁUSULA PRIMEIRA - DO OBJETO:</strong></p>
<p>O VENDEDOR vende ao COMPRADOR o bem descrito acima, livre e desembaraçado de quaisquer ônus.</p>
<p><br></p>
<p><strong>CLÁUSULA SEGUNDA - DO PREÇO:</strong></p>
<p>O COMPRADOR pagará ao VENDEDOR, pela compra do bem, o valor total de R$ ${data.valor ? parseFloat(data.valor).toFixed(2) : '0,00'}.</p>
<p><br></p>
<p><strong>CLÁUSULA TERCEIRA - DA FORMA DE PAGAMENTO:</strong></p>
<p>O pagamento será realizado conforme acordado entre as partes.</p>
<p><br></p>
<p><strong>CLÁUSULA QUARTA - DA TRADIÇÃO:</strong></p>
<p>O bem será entregue ao COMPRADOR na data de assinatura deste contrato, em perfeito estado de conservação.</p>
<p><br></p>
<p><strong>CLÁUSULA QUINTA - DAS GARANTIAS:</strong></p>
<p>O VENDEDOR garante que o bem é de sua propriedade legítima e que não possui qualquer vício oculto.</p>
<p><br></p>
<p>E por estarem justos e contratados, firmam o presente instrumento.</p>
<p><br></p>
<p>${data.cidade || '___________'}, ${data.dataContrato || '____ de __________ de ____'}.</p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p style="text-align: center;">VENDEDOR                                 COMPRADOR</p>
  `,

  trabalho: (data) => `
<h1 style="text-align: center;"><strong>CONTRATO DE TRABALHO</strong></h1>
<p><br></p>
<p>Por este instrumento particular de contrato de trabalho:</p>
<p><br></p>
<p><strong>EMPREGADOR:</strong></p>
<p>Nome: ${data.nomeCompleto}</p>
<p>CPF: ${data.cpf}</p>
<p>RG: ${data.identidade}</p>
<p>Endereço: ${data.logradouro}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}, ${data.bairro}, ${data.cidade}/${data.estado}, CEP: ${data.cep}</p>
<p><br></p>
<p><strong>CARGO:</strong> ${data.cargo || 'Cargo não especificado'}</p>
<p><br></p>
<p><strong>CLÁUSULA PRIMEIRA - DO OBJETO:</strong></p>
<p>O EMPREGADOR admite o EMPREGADO para exercer a função de ${data.cargo || 'cargo não especificado'}.</p>
<p><br></p>
<p><strong>CLÁUSULA SEGUNDA - DA REMUNERAÇÃO:</strong></p>
<p>O EMPREGADO receberá a título de salário mensal a importância de R$ ${data.valor ? parseFloat(data.valor).toFixed(2) : '0,00'}.</p>
<p><br></p>
<p><strong>CLÁUSULA TERCEIRA - DA JORNADA DE TRABALHO:</strong></p>
<p>A jornada de trabalho será de 44 (quarenta e quatro) horas semanais, distribuídas de segunda a sexta-feira, conforme necessidade do EMPREGADOR.</p>
<p><br></p>
<p><strong>CLÁUSULA QUARTA - DO INÍCIO DAS ATIVIDADES:</strong></p>
<p>O EMPREGADO iniciará suas atividades em ${data.dataContrato || '__/__/____'}.</p>
<p><br></p>
<p><strong>CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO EMPREGADO:</strong></p>
<p>São obrigações do EMPREGADO:</p>
<p>a) Cumprir as determinações do EMPREGADOR;</p>
<p>b) Observar os horários estabelecidos;</p>
<p>c) Zelar pelos equipamentos e materiais de trabalho;</p>
<p>d) Manter conduta adequada no ambiente de trabalho.</p>
<p><br></p>
<p><strong>CLÁUSULA SEXTA - DO PERÍODO DE EXPERIÊNCIA:</strong></p>
<p>O presente contrato terá um período de experiência de 90 (noventa) dias.</p>
<p><br></p>
<p>E por estarem justos e contratados, firmam o presente instrumento.</p>
<p><br></p>
<p>${data.cidade || '___________'}, ${data.dataContrato || '____ de __________ de ____'}.</p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p style="text-align: center;">EMPREGADOR                               EMPREGADO</p>
  `,
};

export function ContractPreview({ contractType, contractData, onEdit, onBack }) {
  // Verificar se é um contrato personalizado
  const getInitialContent = () => {
    if (contractType.template) {
      // Template personalizado - processar as variáveis
      let processedTemplate = contractType.template;
      
      // Substituir todas as variáveis ${data.xxx}
      Object.keys(contractData).forEach(key => {
        const regex = new RegExp(`\\$\\{data\\.${key}\\}`, 'g');
        processedTemplate = processedTemplate.replace(regex, contractData[key] || '');
      });
      
      return processedTemplate;
    }
    
    // Template padrão
    return contractTemplates[contractType.id]
      ? contractTemplates[contractType.id](contractData)
      : '<p>Modelo de contrato não disponível.</p>';
  };
  
  const initialContent = getInitialContent();
  
  const [editorContent, setEditorContent] = useState(initialContent);
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align'
  ];

  const handlePrint = () => {
    // Criar uma nova janela para impressão com o conteúdo do editor
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Contrato</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${editorContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const htmlToPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const generateWordDocument = async () => {
    // Converter HTML para texto plano e processar
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    
    const paragraphs = [];
    
    // Processar cada elemento
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          return new TextRun({ text });
        }
        return null;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const text = node.textContent.trim();
        
        if (!text) return null;
        
        // Configurações de estilo baseadas na tag
        const runConfig = { text };
        
        if (tagName === 'strong' || tagName === 'b' || node.style.fontWeight === 'bold') {
          runConfig.bold = true;
        }
        if (tagName === 'em' || tagName === 'i') {
          runConfig.italics = true;
        }
        if (tagName === 'u') {
          runConfig.underline = {};
        }
        
        // Títulos
        if (tagName === 'h1') {
          runConfig.bold = true;
          runConfig.size = 28;
        } else if (tagName === 'h2') {
          runConfig.bold = true;
          runConfig.size = 24;
        } else if (tagName === 'h3') {
          runConfig.bold = true;
          runConfig.size = 22;
        } else {
          runConfig.size = 22;
        }
        
        return new TextRun(runConfig);
      }
      
      return null;
    };
    
    // Processar todos os parágrafos
    const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    elements.forEach((element) => {
      const text = element.textContent.trim();
      
      if (!text || text === '') {
        paragraphs.push(new Paragraph({ text: '' }));
        return;
      }
      
      const tagName = element.tagName.toLowerCase();
      const alignment = element.style.textAlign === 'center' ? AlignmentType.CENTER : 
                       element.style.textAlign === 'right' ? AlignmentType.RIGHT :
                       element.style.textAlign === 'justify' ? AlignmentType.JUSTIFIED :
                       AlignmentType.LEFT;
      
      const children = [];
      
      // Processar elementos filhos
      const processChildren = (node) => {
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent;
            if (text) {
              children.push(new TextRun({ 
                text,
                size: tagName === 'h1' ? 28 : tagName === 'h2' ? 24 : 22
              }));
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const childTag = child.tagName.toLowerCase();
            const childText = child.textContent;
            
            if (childText) {
              const config = { 
                text: childText,
                size: tagName === 'h1' ? 28 : tagName === 'h2' ? 24 : 22
              };
              
              if (childTag === 'strong' || childTag === 'b') config.bold = true;
              if (childTag === 'em' || childTag === 'i') config.italics = true;
              if (childTag === 'u') config.underline = {};
              
              children.push(new TextRun(config));
            }
          }
        });
      };
      
      processChildren(element);
      
      if (children.length === 0) {
        children.push(new TextRun({ 
          text,
          bold: tagName.startsWith('h') || element.querySelector('strong, b') !== null,
          size: tagName === 'h1' ? 28 : tagName === 'h2' ? 24 : 22
        }));
      }
      
      paragraphs.push(
        new Paragraph({
          children,
          alignment,
          spacing: { 
            before: tagName.startsWith('h') ? 300 : 100, 
            after: tagName.startsWith('h') ? 200 : 100 
          },
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato-${contractType.id}-${Date.now()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    generateWordDocument();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar Dados
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Word
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:hidden">
          <CardTitle>{contractType.name}</CardTitle>
          <p className="text-sm text-gray-600">
            Edite o texto do contrato diretamente abaixo. Use a barra de ferramentas para formatação.
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-white">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              formats={formats}
              className="min-h-[500px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}