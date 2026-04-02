import { FileText, Briefcase, Home, Users, Building, Car, Heart, ShoppingCart, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const iconMap = {
  FileText,
  Briefcase,
  Home,
  Users,
  Building,
  Car,
  Heart,
  ShoppingCart,
};

const defaultContractTypes = [
  {
    id: 'locacao',
    name: 'Contrato de Locação',
    icon: 'Home',
    description: 'Contrato para locação de imóveis residenciais ou comerciais',
  },
  {
    id: 'prestacao-servicos',
    name: 'Contrato de Prestação de Serviços',
    icon: 'Briefcase',
    description: 'Contrato para prestação de serviços profissionais',
  },
  {
    id: 'compra-venda',
    name: 'Contrato de Compra e Venda',
    icon: 'FileText',
    description: 'Contrato para transações de compra e venda',
  },
  {
    id: 'trabalho',
    name: 'Contrato de Trabalho',
    icon: 'Users',
    description: 'Contrato de trabalho temporário ou permanente',
  },
];

export function ContractSelector({ onSelect, customContracts = [], onAddNew }) {
  const allContracts = [...defaultContractTypes, ...customContracts];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAddNew} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Modelo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {allContracts.map((contract) => {
          const Icon = iconMap[contract.icon] || FileText;
          return (
            <Card
              key={contract.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelect(contract)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{contract.name}</h3>
                    <p className="text-sm text-gray-600">{contract.description}</p>
                    {contract.customFields && (
                      <p className="text-xs text-blue-600 mt-2">Modelo Personalizado</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}