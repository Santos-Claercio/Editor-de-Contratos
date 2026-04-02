import { useState, useEffect } from 'react';
import { ContractSelector } from './components/ContractSelector';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { AddContractDialog } from './components/AddContractDialog';
import { FileText } from 'lucide-react';

function App() {
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [customContracts, setCustomContracts] = useState([]);

  // Carregar contratos personalizados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customContracts');
    if (saved) {
      try {
        setCustomContracts(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar contratos personalizados:', e);
      }
    }
  }, []);

  // Salvar contratos personalizados no localStorage
  useEffect(() => {
    if (customContracts.length > 0) {
      localStorage.setItem('customContracts', JSON.stringify(customContracts));
    }
  }, [customContracts]);

  const handleContractSelect = (contract) => {
    setSelectedContract(contract);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    setContractData(data);
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedContract(null);
    setContractData(null);
  };

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const handleBack = () => {
    setSelectedContract(null);
    setContractData(null);
  };

  const handleAddContract = (newContract) => {
    setCustomContracts(prev => [...prev, newContract]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 print:hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editor de Contratos
              </h1>
              <p className="text-sm text-gray-600">
                Crie e personalize contratos de forma rápida e fácil
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 print:py-0">
        {!selectedContract && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Selecione o tipo de contrato
              </h2>
              <p className="text-gray-600">
                Escolha o modelo de contrato que deseja criar
              </p>
            </div>
            <ContractSelector 
              onSelect={handleContractSelect}
              customContracts={customContracts}
              onAddNew={() => setIsAddContractOpen(true)}
            />
          </div>
        )}

        {selectedContract && !contractData && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Preencha os dados para gerar o contrato...
            </p>
          </div>
        )}

        {selectedContract && contractData && (
          <ContractPreview
            contractType={selectedContract}
            contractData={contractData}
            onEdit={handleEdit}
            onBack={handleBack}
          />
        )}

        <ContractForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
          contractType={selectedContract}
        />

        <AddContractDialog
          isOpen={isAddContractOpen}
          onClose={() => setIsAddContractOpen(false)}
          onAdd={handleAddContract}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 print:hidden">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Editor de Contratos - Personalize seus documentos de forma prática e profissional
          </p>
          <p className="mt-2 text-xs text-gray-500">
            ⚠️ Os modelos são genéricos. Consulte um advogado para validar seus contratos.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;