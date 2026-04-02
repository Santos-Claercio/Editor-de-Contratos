import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ContractForm({ isOpen, onClose, onSubmit, onCancel, contractType }) {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    identidade: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    dataContrato: '',
    valor: '',
    // Campos específicos por tipo de contrato
    cargo: '',
    descricaoServico: '',
    prazo: '',
    imovelEndereco: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderSpecificFields = () => {
    // Renderizar campos personalizados
    if (contractType?.customFields && contractType.customFields.length > 0) {
      return contractType.customFields.map((field, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={handleChange}
            placeholder={field.label}
          />
        </div>
      ));
    }

    // Campos padrão para contratos existentes
    switch (contractType?.id) {
      case 'locacao':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="imovelEndereco">Endereço do Imóvel</Label>
              <Input
                id="imovelEndereco"
                name="imovelEndereco"
                value={formData.imovelEndereco}
                onChange={handleChange}
                placeholder="Endereço completo do imóvel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Aluguel (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo">Prazo (meses)</Label>
              <Input
                id="prazo"
                name="prazo"
                type="number"
                value={formData.prazo}
                onChange={handleChange}
                placeholder="12"
              />
            </div>
          </>
        );
      case 'prestacao-servicos':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="descricaoServico">Descrição do Serviço</Label>
              <Input
                id="descricaoServico"
                name="descricaoServico"
                value={formData.descricaoServico}
                onChange={handleChange}
                placeholder="Descreva o serviço a ser prestado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Serviço (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </>
        );
      case 'trabalho':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Cargo a ser exercido"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Salário (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </>
        );
      case 'compra-venda':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="descricaoServico">Descrição do Bem</Label>
              <Input
                id="descricaoServico"
                name="descricaoServico"
                value={formData.descricaoServico}
                onChange={handleChange}
                placeholder="Descreva o bem a ser transacionado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor da Transação (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dados para {contractType?.name}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo com as informações necessárias para gerar o contrato.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Dados Pessoais</h4>
            
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
                placeholder="Nome completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identidade">Identidade (RG)</Label>
                <Input
                  id="identidade"
                  name="identidade"
                  value={formData.identidade}
                  onChange={handleChange}
                  required
                  placeholder="00.000.000-0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Endereço</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                  placeholder="00000-000"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                  placeholder="Rua, Avenida, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  placeholder="123"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Apt, Bloco, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Bairro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Cidade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Dados do Contrato</h4>
            
            <div className="space-y-2">
              <Label htmlFor="dataContrato">Data do Contrato</Label>
              <Input
                id="dataContrato"
                name="dataContrato"
                type="date"
                value={formData.dataContrato}
                onChange={handleChange}
                required
              />
            </div>

            {renderSpecificFields()}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Gerar Contrato
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}