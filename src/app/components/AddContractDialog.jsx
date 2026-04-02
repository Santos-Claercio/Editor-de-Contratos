import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function AddContractDialog({ isOpen, onClose, onAdd }) {
  const [contractData, setContractData] = useState({
    name: '',
    description: '',
    icon: 'FileText',
    customFields: [],
    template: '',
  });

  const fileInputRef = useRef(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const availableIcons = [
    { value: 'FileText', label: 'Documento' },
    { value: 'Briefcase', label: 'Maleta' },
    { value: 'Home', label: 'Casa' },
    { value: 'Users', label: 'Pessoas' },
    { value: 'Building', label: 'Prédio' },
    { value: 'Car', label: 'Carro' },
    { value: 'Heart', label: 'Coração' },
    { value: 'ShoppingCart', label: 'Carrinho' },
  ];

  const handleAddField = () => {
    if (newFieldName && newFieldLabel) {
      setContractData(prev => ({
        ...prev,
        customFields: [
          ...prev.customFields,
          {
            name: newFieldName,
            label: newFieldLabel,
            type: newFieldType,
          },
        ],
      }));
      setNewFieldName('');
      setNewFieldLabel('');
      setNewFieldType('text');
    }
  };

  const handleRemoveField = (index) => {
    setContractData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contractData.name && contractData.template) {
      const id = contractData.name.toLowerCase().replace(/\s+/g, '-');
      onAdd({ ...contractData, id });
      setContractData({
        name: '',
        description: '',
        icon: 'FileText',
        customFields: [],
        template: '',
      });
      onClose();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      alert('Por favor, selecione um arquivo Word (.docx)');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Usando a biblioteca mammoth para extrair texto do DOCX
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      setContractData(prev => ({ ...prev, template: result.value }));
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao processar o arquivo. Tente novamente.');
    }

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateTemplateHelper = () => {
    let template = `
<h1 style="text-align: center;"><strong>${contractData.name.toUpperCase()}</strong></h1>
<p><br></p>
<p>Por este instrumento particular de contrato:</p>
<p><br></p>
<p><strong>CONTRATANTE:</strong></p>
<p>Nome: \${data.nomeCompleto}</p>
<p>CPF: \${data.cpf}</p>
<p>RG: \${data.identidade}</p>
<p>Endereço: \${data.logradouro}, \${data.numero}\${data.complemento ? ', ' + data.complemento : ''}, \${data.bairro}, \${data.cidade}/\${data.estado}, CEP: \${data.cep}</p>
<p><br></p>`;

    contractData.customFields.forEach(field => {
      template += `<p><strong>${field.label}:</strong> \${data.${field.name}}</p>\n`;
    });

    template += `
<p><br></p>
<p><strong>CLÁUSULA PRIMEIRA:</strong></p>
<p>[Insira o texto da cláusula aqui]</p>
<p><br></p>
<p>E por estarem justos e contratados, firmam o presente instrumento.</p>
<p><br></p>
<p>\${data.cidade || '___________'}, \${data.dataContrato || '____ de __________ de ____'}.</p>
<p><br></p>
<p>_____________________________          _____________________________</p>
<p style="text-align: center;">CONTRATANTE                              CONTRATADO</p>
`;
    
    setContractData(prev => ({ ...prev, template }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Modelo de Contrato</DialogTitle>
          <DialogDescription>
            Crie um modelo personalizado de contrato com campos e template próprios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Informações do Contrato</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractName">Nome do Contrato *</Label>
                <Input
                  id="contractName"
                  value={contractData.name}
                  onChange={(e) => setContractData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Contrato de Confidencialidade"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractIcon">Ícone</Label>
                <Select 
                  value={contractData.icon} 
                  onValueChange={(value) => setContractData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractDescription">Descrição</Label>
              <Input
                id="contractDescription"
                value={contractData.description}
                onChange={(e) => setContractData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Breve descrição do contrato"
              />
            </div>
          </div>

          {/* Campos Personalizados */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Campos Personalizados</h4>
            <p className="text-xs text-gray-600">
              Além dos campos padrão (nome, CPF, RG, endereço, data), adicione campos específicos para este contrato.
            </p>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Input
                    placeholder="Nome do campo (ex: valor)"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    placeholder="Label (ex: Valor do Contrato)"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Button type="button" onClick={handleAddField} size="sm" className="w-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {contractData.customFields.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-medium">Campos adicionados:</p>
                  {contractData.customFields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex-1">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-xs text-gray-600 ml-2">({field.name} - {field.type})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveField(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Template */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">Template do Contrato *</h4>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={generateTemplateHelper}>
                  Gerar Template Base
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" />
                  Importar Word
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-600">
              Use HTML para formatar. Variáveis: {`\${data.nomeCompleto}, \${data.cpf}, \${data.identidade}, \${data.dataContrato}`}, etc.
              Para campos personalizados use: {`\${data.nomeDoCampo}`}
            </p>
            <Textarea
              value={contractData.template}
              onChange={(e) => setContractData(prev => ({ ...prev, template: e.target.value }))}
              placeholder="Cole ou escreva o template HTML aqui..."
              className="font-mono text-xs min-h-[300px]"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Contrato
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
