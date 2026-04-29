import { useState, useEffect } from 'react';
import { ContractSelector } from './components/ContractSelector';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { AddContractDialog } from './components/AddContractDialog';
import { CategoryDialog } from './components/CategoryDialog';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DashboardContent } from './components/DashboardContent';
import { AlertModal } from './components/AlertModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { FileText, Menu, Settings, Trash2, Clock, Search, Filter, TrendingUp, Plus, Home, Users, Edit } from 'lucide-react';

interface Contract {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  customFields?: Array<{
    name: string;
    label: string;
    type: string;
  }>;
  template?: string;
  views?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgClass: string;
  iconClass: string;
}

interface User {
  email: string;
  name: string;
}

function App() {
  // Estados de autenticação e navegação
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Estado do modal de alerta
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  // Estado do modal de confirmação
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: null
  });

  // Estado da lixeira
  const [trashContracts, setTrashContracts] = useState([]);

  // Estado da tela de edição
  const [editingContract, setEditingContract] = useState(null);

  // Função de filtragem
  const filterContracts = (contracts) => {
    return contracts.filter(contract => {
      const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || contract.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Função para mostrar alerta elegante
  const showAlert = (title, message, type = 'warning') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Função para mostrar modal de confirmação
  const showConfirm = (title, message, itemName, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      itemName,
      onConfirm
    });
  };

  // Função para mover contrato para lixeira
  const moveToTrash = (contract) => {
    const contractWithTimestamp = {
      ...contract,
      deletedAt: new Date().toISOString(),
      originalId: contract.id
    };
    
    setTrashContracts(prev => [...prev, contractWithTimestamp]);
    setCustomContracts(prev => prev.filter(c => c.id !== contract.id));
  };

  // Função para restaurar contrato da lixeira
  const restoreFromTrash = (contract) => {
    const restoredContract = {
      ...contract,
      id: contract.originalId || contract.id,
      deletedAt: undefined,
      originalId: undefined
    };
    
    setCustomContracts(prev => [...prev, restoredContract]);
    setTrashContracts(prev => prev.filter(c => c.id !== contract.id));
  };

  // Função para excluir permanentemente
  const permanentDelete = (contract) => {
    setTrashContracts(prev => prev.filter(c => c.id !== contract.id));
  };

  // Função para editar contrato
  const handleOpenEditContract = (contract) => {
    // Carregar conteúdo do contrato se existir
    const contractWithContent = {
      ...contract,
      template: contract.template || contract.content || ''
    };
    setEditingContract(contractWithContent);
    setActiveView('edit-contract');
  };

  // Obter categorias para o filtro
  const getAllCategories = () => {
    const categories = ['all'];
    const categorySet = new Set<string>();
    
    defaultContracts.forEach(contract => {
      categorySet.add(contract.category);
    });
    
    customCategories.forEach(cat => {
      categorySet.add(cat.id);
    });
    
    return categories.concat(Array.from(categorySet));
  };

  // Estados do sistema de contratos
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [customContracts, setCustomContracts] = useState<Contract[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  // Contratos padrão
  const defaultContracts = [
    {
      id: 'locacao',
      name: 'Contrato de Locação',
      description: 'Contrato para locação de imóveis residenciais',
      icon: 'Home',
      category: 'locacao',
      views: 15,
      customFields: undefined,
      content: `CONTRATO DE LOCAÇÃO RESIDENCIAL

Pelo presente instrumento particular de contrato de locação, de um lado a LOCADORA, doravante devidamente qualificada como [NOME COMPLETO DA LOCADORA], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede à [ENDEREÇO COMPLETO DA LOCADORA], doravante simplesmente "LOCADORA", e de outro lado, o LOCATÁRIO, doravante devidamente qualificado como [NOME COMPLETO DO LOCATÁRIO], pessoa física, portador(a) do RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado à [ENDEREÇO COMPLETO DO LOCATÁRIO], doravante simplesmente "LOCATÁRIO", têm entre si, justo e acordado, o seguinte contrato de locação residencial, conforme as cláusulas e condições abaixo estipuladas:

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. A LOCADORA dá em locação ao LOCATÁRIO o imóvel situado à [ENDEREÇO DO IMÓVEL], com as características e condições descritas no anexo I deste contrato, doravante simplesmente "IMÓVEL".

1.2. O presente contrato tem por objeto a locação do IMÓVEL para fins residenciais, sendo vedada sua utilização para fins comerciais ou qualquer outra finalidade não residencial.

CLÁUSULA SEGUNDA - DO PRAZO E DO ALUGUEL
2.1. O prazo de locação é de [PRAZO] meses, iniciando-se em [DATA INÍCIO] e terminando em [DATA TÉRMINO].
2.2. O aluguel mensal é de R$ [VALOR ALUGUEL], pagável até o dia [DIA PAGAMENTO] de cada mês, através de [FORMA PAGAMENTO].
2.3. O primeiro aluguel deverá ser pago adiantadamente no ato da assinatura deste contrato.

CLÁUSULA TERCEIRA - DO DEPÓSITO E CAUÇÃO
3.1. O LOCATÁRIO deverá pagar à LOCADORA, no ato da assinatura, o valor de R$ [VALOR DEPÓSITO] a título de caução, que será devolvido ao final do contrato, devidamente atualizado, desde que o IMÓVEL seja devolvido em perfeitas condições de uso e conservação.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO LOCATÁRIO
4.1. O LOCATÁRIO se obriga a:
a) Pagar pontualmente o aluguel e demais encargos;
b) Utilizar o IMÓVEL exclusivamente para fins residenciais;
c) Manter o IMÓVEL em bom estado de conservação;
d) Não sublocar o IMÓVEL sem autorização expressa da LOCADORA;
e) Permitir vistorias do IMÓVEL mediante aviso prévio de 24 horas;
f) Devolver o IMÓVEL ao final do contrato nas mesmas condições em que o recebeu.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA LOCADORA
5.1. A LOCADORA se obriga a:
a) Entregar o IMÓVEL em perfeitas condições de uso e habitabilidade;
b) Realizar os reparos necessários durante a vigência do contrato;
c) Fornecer recibo dos pagamentos realizados;
d) Respeitar a privacidade do LOCATÁRIO.

CLÁUSULA SEXTA - DAS DESPESAS
6.1. O LOCATÁRIO arcará com as seguintes despesas:
a) Água, luz, gás e telefone;
b) IPTU do imóvel;
c) Taxa de condomínio, se houver;
6.2. As despesas de condomínio e IPTU são de responsabilidade do LOCATÁRIO.

CLÁUSULA SÉTIMA - DA RESCISÃO
7.1. O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.
7.2. Na rescisão por iniciativa do LOCATÁRIO sem justa causa, este perderá o valor do depósito.
7.3. Na rescisão por iniciativa da LOCADORA sem justa causa, deverá devolver o depósito em dobro.

CLÁUSULA OITAVA - DISPOSIÇÕES GERAIS
8.1. As partes elegem o Foro da Comarca de [COMARCA] para dirimir quaisquer controvérsias decorrentes deste contrato.
8.2. Este contrato será registrado em Cartório de Títulos e Documentos.

E por estarem assim justas e contratadas, as partes assinam o presente contrato em duas vias de igual teor, na presença das testemunhas abaixo.

[LOCAL], [DATA DE ASSINATURA].

_________________________
LOCADORA: [NOME COMPLETO DA LOCADORA]

LOCATÁRIO: [NOME COMPLETO DO LOCATÁRIO]

Testemunhas:
1. ____________________________________
2. ____________________________________`
    },
    {
      id: 'trabalhista',
      name: 'Contrato Trabalhista',
      description: 'Contrato de trabalho padrão CLT',
      icon: 'Users',
      category: 'trabalhistas',
      views: 23,
      customFields: undefined,
      content: `CONTRATO DE TRABALHO

Pelo presente instrumento particular de contrato de trabalho, de um lado a EMPRESA, doravante devidamente qualificada como [NOME COMPLETO DA EMPRESA], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede à [ENDEREÇO COMPLETO DA EMPRESA], doravante simplesmente "EMPRESA", e de outro lado, o EMPREGADO, doravante devidamente qualificado como [NOME COMPLETO DO EMPREGADO], pessoa física, portador(a) do RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado à [ENDEREÇO COMPLETO DO EMPREGADO], doravante simplesmente "EMPREGADO", têm entre si, justo e acordado, o seguinte contrato de trabalho, conforme as cláusulas e condições abaixo estipuladas:

CLÁUSULA PRIMEIRA - DA QUALIFICAÇÃO
1.1. O EMPREGADO é qualificado para exercer a função de [FUNÇÃO], com salário inicial de R$ [SALÁRIO].
1.2. O EMPREGADO exercerá suas atividades com dedicação, zelo e profissionalismo.

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA EMPRESA
2.1. A EMPRESA se obriga a:
a) Pagar os salários nos prazos estipulados;
b) Fornecer as ferramentas e equipamentos necessários para o exercício da função;
c) Cumprir as normas de segurança e medicina do trabalho;
d) Fornecer vale-transporte quando necessário;
e) Manter o ambiente de trabalho seguro e saudável.

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO EMPREGADO
3.1. O EMPREGADO se obriga a:
a) Cumprir com pontualidade e assiduidade seus horários de trabalho;
b) Executar suas tarefas com profissionalismo e dedicação;
c) Zelar pelo material e equipamentos da empresa;
d) Manter sigilo sobre informações confidenciais da empresa;
e) Respeitar as normas internas e regulamentos da empresa.

CLÁUSULA QUARTA - DA JORNADA DE TRABALHO
4.1. A jornada de trabalho será de [HORAS] horas semanais, de segunda a sexta, das [HORÁRIO INÍCIO] às [HORÁRIO TÉRMINO].
4.2. As horas extras serão pagas com adicional de [ADICIONAL]% sobre o valor da hora normal.

CLÁUSULA QUINTA - DAS FÉRIAS E LICENÇAS
5.1. O EMPREGADO terá direito a [DIAS FÉRIAS] dias de férias anuais, remuneradas.
5.2. As licenças serão concedidas conforme legislação vigente.

CLÁUSULA SEXTA - DO VESTUÁRIO
6.1. A EMPRESA fornecerá uniformes e equipamentos de proteção individual necessários para o exercício da função.
6.2. O EMPREGADO se obriga a utilizar e conservar os equipamentos fornecidos.

CLÁUSULA SÉTIMA - DA RESCISÃO
7.1. O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de [DIAS AVISO] dias.
7.2. Na rescisão sem justa causa, as partes deverão observar as disposições da CLT.

CLÁUSULA OITAVA - DISPOSIÇÕES GERAIS
8.1. As partes elegem o Foro da Comarca de [COMARCA] para dirimir quaisquer controvérsias decorrentes deste contrato.
8.2. Este contrato será registrado perante as autoridades competentes.

E por estarem assim justas e contratadas, as partes assinam o presente contrato em duas vias de igual teor, na presença das testemunhas abaixo.

[LOCAL], [DATA DE ASSINATURA].

_________________________
EMPRESA: [NOME COMPLETO DA EMPRESA]

EMPREGADO: [NOME COMPLETO DO EMPREGADO]

Testemunhas:
1. ____________________________________
2. ____________________________________`
    },
    {
      id: 'eleicoes',
      name: 'Contrato para Eleições',
      description: 'Contrato para prestação de serviços eleitorais',
      icon: 'FileText',
      category: 'eleicoes',
      views: 8,
      customFields: undefined,
      content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ELEITORAIS

Pelo presente instrumento particular de contrato de prestação de serviços, de um lado a CONTRATANTE, doravante devidamente qualificado como [NOME COMPLETO DO CONTRATANTE], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede à [ENDEREÇO COMPLETO DO CONTRATANTE], doravante simplesmente "CONTRATANTE", e de outro lado, o CONTRATADO, doravante devidamente qualificado como [NOME COMPLETO DO CONTRATADO], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede à [ENDEREÇO COMPLETO DO CONTRATADO], doravante simplesmente "CONTRATADO", têm entre si, justo e acordado, o seguinte contrato de prestação de serviços eleitorais, conforme as cláusulas e condições abaixo estipuladas:

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. O CONTRATANTE contrata os serviços do CONTRATADO para [TIPO DE SERVIÇO ELEITORAL] relacionados às eleições [TIPO DE ELEIÇÃO].

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DO CONTRATANTE
2.1. O CONTRATANTE se obriga a:
a) Fornecer todas as informações necessárias para a execução dos serviços;
b) Pagar os honorários estipulados nos prazos acordados;
c) Fornecer suporte técnico e material necessário;
d) Respeitar a legislação eleitoral vigente.

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATADO
3.1. O CONTRATADO se obriga a:
a) Prestar os serviços com profissionalismo, dedicação e zelo;
b) Cumprir os prazos estipulados;
c) Manter a confidencialidade das informações do CONTRATANTE;
d) Observar todas as normas eleitorais aplicáveis;
e) Fornecer relatórios detalhados dos serviços prestados.

CLÁUSULA QUARTA - DOS HONORÁRIOS
4.1. Os honorários pelos serviços prestados serão de R$ [VALOR HONORÁRIOS], pagáveis da seguinte forma:
a) 50% no ato da assinatura deste contrato;
b) 50% na conclusão dos serviços, conforme especificado na cláusula quinta.

CLÁUSULA QUINTA - DO PRAZO
5.1. O prazo de execução dos serviços é de [PRAZO] dias a contar da data de assinatura.
5.2. Os serviços poderão ser prorrogados mediante acordo mútuo entre as partes.

CLÁUSULA SEXTA - CONFIDENCIALIDADE
6.1. Todas as informações trocadas entre as partes são confidenciais e não poderão ser divulgadas a terceiros sem autorização expressa.

CLÁUSULA SÉTIMA - DISPOSIÇÕES GERAIS
7.1. Este contrato poderá ser rescindido por qualquer das partes mediante notificação prévia de 30 dias.
7.2. As partes elegem o Foro da Comarca de [COMARCA] para dirimir quaisquer controvérsias.

E por estarem assim justas e contratadas, as partes assinam o presente contrato em duas vias de igual teor, na presença das testemunhas abaixo.

[LOCAL], [DATA DE ASSINATURA].

_________________________
CONTRATANTE: [NOME COMPLETO DO CONTRATANTE]

CONTRATADO: [NOME COMPLETO DO CONTRATADO]

Testemunhas:
1. ____________________________________
2. ____________________________________`
    }
  ];

  // Mapeamento de ícones do Lucide React
const iconMap = {
  FileText,
  Users,
  Home,
  Settings,
  Clock,
  Plus,
  TrendingUp,
  Search,
  Filter,
  Menu,
  Trash2
};

// Todas as categorias (padrão + personalizadas)
const allCategories = [
  {
    id: 'trabalhistas',
    name: 'Contratos Trabalhistas',
    description: 'Contratos relacionados ao trabalho',
    icon: FileText,
    color: 'blue',
    bgClass: 'bg-blue-100',
    iconClass: 'text-blue-600'
  },
  {
    id: 'locacao',
    name: 'Contratos de Locação',
    description: 'Contratos para aluguel de imóveis',
    icon: Home,
    color: 'green',
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600'
  },
  {
    id: 'eleicoes',
    name: 'Contratos para Eleições',
    description: 'Contratos eleitorais e políticos',
    icon: FileText,
    color: 'purple',
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600'
  },
  {
    id: 'outros',
    name: 'Outros Contratos',
    description: 'Outros tipos de contratos',
    icon: FileText,
    color: 'gray',
    bgClass: 'bg-gray-100',
    iconClass: 'text-gray-600'
  },
  ...customCategories
];

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customContracts');
    if (saved) {
      try {
        setCustomContracts(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar contratos personalizados:', e);
      }
    }

    const savedCategories = localStorage.getItem('customCategories');
    if (savedCategories) {
      try {
        setCustomCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error('Erro ao carregar categorias personalizadas:', e);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (customContracts.length > 0) {
      localStorage.setItem('customContracts', JSON.stringify(customContracts));
    }
  }, [customContracts]);

  useEffect(() => {
    if (customCategories.length > 0) {
      localStorage.setItem('customCategories', JSON.stringify(customCategories));
    }
  }, [customCategories]);

  // Funções de navegação
  const handleNavigate = (view: string, data?: any) => {
    setActiveView(view);
    
    if (data) {
      setSelectedContract(data);
      setIsFormOpen(true);
    }
    
    // Fechar sidebar no mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Funções de autenticação
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  // Funções do sistema de contratos
  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    setContractData(data);
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedContract(null);
    setContractData(null);
  };

  const handleBack = () => {
    setSelectedContract(null);
    setContractData(null);
  };

  const handleAddContract = (newContract: Contract) => {
    const contractWithId = {
      ...newContract,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setCustomContracts(prev => [...prev, contractWithId]);
  };

  const handleAddCategory = (newCategory: Category) => {
    setCustomCategories(prev => [...prev, newCategory]);
  };

  const handleEditCategory = (updatedCategory: Category & { originalId: string }) => {
    setCustomCategories(prev => {
      const updated = prev.map(cat => 
        cat.id === updatedCategory.originalId 
          ? { ...updatedCategory, id: updatedCategory.id }
          : cat
      );
      
      // Atualizar contratos que usavam o ID antigo da categoria
      setCustomContracts(contracts => 
        contracts.map(contract => 
          contract.category === updatedCategory.originalId 
            ? { ...contract, category: updatedCategory.id }
            : contract
        )
      );
      
      return updated;
    });
    setEditingCategory(null);
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
    
    setCustomContracts(prev => 
      prev.map(contract => 
        contract.category === categoryId 
          ? { ...contract, category: 'outros' }
          : contract
      )
    );
  };

  const handleDeleteContract = (contractId: string) => {
    setCustomContracts(prev => prev.filter(contract => contract.id !== contractId));
  };

  const handleOpenCategoryDialog = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  // Tela de Splash
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Tela de Login
  if (!isLoggedIn) {
    console.log('Renderizando LoginScreen');
    return <LoginScreen onLogin={handleLogin} />;
  }

  console.log('Usuário logado, renderizando aplicação principal');
  console.log('Active view:', activeView);
  console.log('Custom contracts:', customContracts);
  console.log('Custom categories:', customCategories);

  // Aplicação Principal
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onViewChange={handleNavigate}
        contracts={[...defaultContracts, ...customContracts]}
        categories={allCategories}
      />

      {/* Conteúdo Principal */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen 
          ? isSidebarCollapsed 
            ? 'lg:ml-16' 
            : 'lg:ml-64'
          : 'lg:ml-0'
      }`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 print:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Botão Menu Mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 bg-emerald-800 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    title="Expandir ou retrair o menu lateral"
                  >
                    <FileText className="w-5 h-5 text-emerald-100" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Editor de Contratos</h1>
                    <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="container mx-auto px-4 py-8 print:py-0">
          {/* Dashboard */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Visão geral do seu sistema de contratos</p>
              
              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl shadow-xl border border-emerald-300/20 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FileText className="w-8 h-8 text-emerald-100" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-emerald-50">{defaultContracts.length + customContracts.length}</p>
                      <p className="text-emerald-200 text-sm font-medium">Total de Contratos</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-6 rounded-2xl shadow-xl border border-teal-300/20 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl font-bold text-teal-100">{allCategories.length}</span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-teal-50">{allCategories.length}</p>
                      <p className="text-teal-200 text-sm font-medium">Categorias</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-xl border border-green-300/20 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="w-8 h-8 text-green-100" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-50">
                        {[...defaultContracts, ...customContracts].reduce((sum, contract) => sum + (contract.views || 0), 0)}
                      </p>
                      <p className="text-green-200 text-sm font-medium">Visualizações</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-xl border border-emerald-300/20 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Clock className="w-8 h-8 text-emerald-100" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-emerald-50">Hoje</p>
                      <p className="text-emerald-200 text-sm font-medium">Última atualização</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contratos Mais Editados */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Contratos Mais Editados
                  </h2>
                  <div className="space-y-3">
                    {[...defaultContracts, ...customContracts]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 3)
                      .map((contract, index) => (
                        <div key={contract.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{contract.name}</p>
                            <p className="text-sm text-gray-600">{contract.views || 0} visualizações</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novos Contratos
                  </h2>
                  <div className="space-y-3">
                    {[...defaultContracts, ...customContracts]
                      .slice(-3)
                      .reverse()
                      .map((contract) => (
                        <div key={contract.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{contract.name}</p>
                            <p className="text-sm text-gray-600">
                              {contract.customFields ? 'Personalizado' : 'Padrão'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Categorias
                  </h2>
                  <div className="space-y-3">
                    {allCategories.slice(0, 5).map((category) => (
                      <div key={category.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${category.bgClass} rounded-lg flex items-center justify-center`}>
                          {(() => {
                            const IconComponent = iconMap[category.icon] || FileText;
                            return <IconComponent className={`w-4 h-4 ${category.iconClass}`} />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{category.name}</p>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex-col bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg border-0 transition-all duration-300"
                    onClick={() => setActiveView('contracts')}
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Gerenciar Contratos</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex-col border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 transition-all duration-300"
                    onClick={() => setActiveView('categories')}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Gerenciar Categorias</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex-col border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 transition-all duration-300"
                    onClick={() => setActiveView('recent')}
                  >
                    <Clock className="w-6 h-6 mb-2" />
                    <span>Ver Recentes</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Contratos */}
          {activeView === 'contracts' && !selectedContract && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Contratos</h2>
                  <p className="text-gray-600">Selecione um modelo de contrato para começar</p>
                </div>
                <Button onClick={() => setIsAddContractOpen(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Modelo
                </Button>
              </div>
              
              {/* Barra de Busca e Filtro */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar contratos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="w-full md:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      {getAllCategories().slice(1).map((categoryId) => {
                        const category = allCategories.find(cat => cat.id === categoryId);
                        return (
                          <SelectItem key={categoryId} value={categoryId}>
                            {category?.name || categoryId}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de Contratos Filtrados */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterContracts([...defaultContracts, ...customContracts]).map(contract => {
                  return (
                    <div key={contract.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow relative group">
                      {/* Botões de Ação */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditContract(contract);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            showConfirm(
                              'Confirmar Exclusão',
                              'Deseja realmente excluir esse contrato?',
                              contract.name,
                              () => moveToTrash(contract)
                            );
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{contract.name}</h3>
                          <p className="text-sm text-gray-600">{contract.description}</p>
                          <p className="text-xs text-blue-600 mt-2">
                            {contract.customFields ? 'Personalizado' : 'Padrão'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleContractSelect(contract)}
                      >
                        Usar Contrato
                      </Button>
                    </div>
                  );
                })}
              </div>

              {filterContracts([...defaultContracts, ...customContracts]).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum contrato encontrado com os filtros aplicados.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Categorias */}
          {activeView === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
                  <p className="text-gray-600">Gerencie suas categorias de contratos</p>
                </div>
                <Button onClick={handleOpenCategoryDialog}>
                  Nova Categoria
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCategories.map((category) => {
                  // Verificar se há contratos nesta categoria
                  const contractsInCategory = [...defaultContracts, ...customContracts].filter(
                    contract => contract.category === category.id
                  );
                  const hasContracts = contractsInCategory.length > 0;
                  const isCustomCategory = customCategories.some(cat => cat.id === category.id);
                  
                  return (
                    <div key={category.id} className="bg-white p-6 rounded-lg border border-gray-200 relative group">
                      {/* Botões de Ação */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditCategory(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (hasContracts) {
                              showAlert(
                                'Não é possível excluir categoria',
                                `Esta categoria não pode ser excluída pois existem ${contractsInCategory.length} contrato(s) relacionado(s) a ela. Para excluir esta categoria, primeiro remova ou mova todos os contratos relacionados.`,
                                'warning'
                              );
                              return;
                            }
                            
                            showConfirm(
                              'Confirmar Exclusão de Categoria',
                              'Deseja realmente excluir essa categoria?',
                              category.name,
                              () => {
                                handleDeleteCategory(category.id);
                              }
                            );
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 ${category.bgClass} rounded-lg`}>
                          {(() => {
                            const IconComponent = iconMap[category.icon] || FileText;
                            return <IconComponent className={`w-5 h-5 ${category.iconClass}`} />;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      
                      {/* Informações Adicionais */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Contratos:</span>
                          <span className="font-medium text-gray-900">{contractsInCategory.length}</span>
                        </div>
                        
                        {hasContracts && (
                          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            {contractsInCategory.length} contrato(s) nesta categoria
                          </div>
                        )}
                        
                        {!isCustomCategory && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            Categoria padrão - pode ser excluída se não tiver contratos
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contratos Recentes */}
          {activeView === 'recent' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Contratos Recentes</h2>
                <p className="text-gray-600">Contratos acessados recentemente</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...defaultContracts, ...customContracts]
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .map((contract) => (
                    <div key={contract.id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contract.name}</h3>
                          <p className="text-sm text-gray-600">{contract.description}</p>
                          <p className="text-xs text-blue-600">{contract.views || 0} visualizações</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleContractSelect(contract)}
                      >
                        Usar Contrato
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Lixeira */}
          {activeView === 'trash' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Lixeira</h2>
                <p className="text-gray-600">Contratos excluídos recentemente</p>
              </div>
              
              {trashContracts.length === 0 ? (
                <div className="text-center py-12">
                  <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Lixeira vazia</h3>
                  <p className="text-gray-600">Nenhum contrato foi excluído recentemente.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trashContracts.map(contract => (
                    <div key={contract.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow relative group">
                      {/* Indicador de excluído */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Excluído
                        </span>
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreFromTrash(contract)}
                          title="Restaurar contrato"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => showConfirm(
                            'Excluir Permanentemente',
                            'Deseja realmente excluir este contrato permanentemente? Esta ação não pode ser desfeita.',
                            contract.name,
                            () => permanentDelete(contract)
                          )}
                          title="Excluir permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4 mt-6">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{contract.name}</h3>
                          <p className="text-sm text-gray-600">{contract.description}</p>
                          <p className="text-xs text-red-600 mt-2">
                            Excluído em: {new Date(contract.deletedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => restoreFromTrash(contract)}
                        >
                          Restaurar
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => showConfirm(
                            'Excluir Permanentemente',
                            'Deseja realmente excluir este contrato permanentemente? Esta ação não pode ser desfeita.',
                            contract.name,
                            () => permanentDelete(contract)
                          )}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Edição de Contrato */}
          {activeView === 'edit-contract' && editingContract && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Editar Contrato</h2>
                  <p className="text-gray-600">Edite as informações do modelo de contrato</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingContract(null);
                    setActiveView('contracts');
                  }}
                >
                  Voltar para Contratos
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Contrato
                      </label>
                      <Input
                        value={editingContract.name}
                        onChange={(e) => {
                          const updatedContract = { ...editingContract, name: e.target.value };
                          setEditingContract(updatedContract);
                          // Atualizar no array de contratos
                          if (customContracts.some(c => c.id === editingContract.id)) {
                            setCustomContracts(prev => 
                              prev.map(c => c.id === editingContract.id ? updatedContract : c)
                            );
                          }
                        }}
                        placeholder="Digite o nome do contrato"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        rows={4}
                        value={editingContract.description}
                        onChange={(e) => {
                          const updatedContract = { ...editingContract, description: e.target.value };
                          setEditingContract(updatedContract);
                          // Atualizar no array de contratos
                          if (customContracts.some(c => c.id === editingContract.id)) {
                            setCustomContracts(prev => 
                              prev.map(c => c.id === editingContract.id ? updatedContract : c)
                            );
                          }
                        }}
                        placeholder="Digite a descrição do contrato"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <Select 
                        value={editingContract.category} 
                        onValueChange={(value) => {
                          const updatedContract = { ...editingContract, category: value };
                          setEditingContract(updatedContract);
                          // Atualizar no array de contratos
                          if (customContracts.some(c => c.id === editingContract.id)) {
                            setCustomContracts(prev => 
                              prev.map(c => c.id === editingContract.id ? updatedContract : c)
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.slice(1).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ícone
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {Object.entries(iconMap).map(([key, Icon]) => (
                          <button
                            key={key}
                            type="button"
                            title={`Selecionar ícone ${key}`}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              editingContract.icon === key
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                            onClick={() => {
                              const updatedContract = { ...editingContract, icon: key };
                              setEditingContract(updatedContract);
                              // Atualizar no array de contratos
                              if (customContracts.some(c => c.id === editingContract.id)) {
                                setCustomContracts(prev => 
                                  prev.map(c => c.id === editingContract.id ? updatedContract : c)
                                );
                              }
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Campos Personalizados */}
                  {editingContract.customFields && editingContract.customFields.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campos Personalizados</h3>
                      {editingContract.customFields.map((field, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updatedContract = {
                                  ...editingContract,
                                  customFields: editingContract.customFields.filter((_, i) => i !== index)
                                };
                                setEditingContract(updatedContract);
                                // Atualizar no array de contratos
                                if (customContracts.some(c => c.id === editingContract.id)) {
                                  setCustomContracts(prev => 
                                    prev.map(c => c.id === editingContract.id ? updatedContract : c)
                                  );
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={field.value || ''}
                            onChange={(e) => {
                              const updatedFields = [...editingContract.customFields];
                              updatedFields[index] = { ...field, value: e.target.value };
                              const updatedContract = { ...editingContract, customFields: updatedFields };
                              setEditingContract(updatedContract);
                              // Atualizar no array de contratos
                              if (customContracts.some(c => c.id === editingContract.id)) {
                                setCustomContracts(prev => 
                                  prev.map(c => c.id === editingContract.id ? updatedContract : c)
                                );
                              }
                            }}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Template */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template do Contrato
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      rows={6}
                      value={editingContract.template || ''}
                      onChange={(e) => {
                        const updatedContract = { ...editingContract, template: e.target.value };
                        setEditingContract(updatedContract);
                        // Atualizar no array de contratos
                        if (customContracts.some(c => c.id === editingContract.id)) {
                          setCustomContracts(prev => 
                            prev.map(c => c.id === editingContract.id ? updatedContract : c)
                          );
                        }
                      }}
                      placeholder="Digite o template do contrato (use variáveis como {{nome_cliente}}, {{data}}, etc.)"
                    />
                  </div>
                  
                  {/* Ações do Template */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Importar template de exemplo
                        const exampleTemplate = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Entre as partes:
{{nome_empresa}} ({{nome_empresa}}), pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{cnpj_empresa}}, com sede à Rua {{endereco_empresa}}, nº {{numero_empresa}}, Bairro {{bairro_empresa}}, Cidade {{cidade_empresa}}, Estado {{estado_empresa}}, CEP {{cep_empresa}}, doravante de {{nome_empresa}}.

E de outro lado:
{{nome_cliente}} ({{nome_cliente}}), pessoa física, portador(a) do RG nº {{rg_cliente}}, inscrito(a) no CPF sob o nº {{cpf_cliente}}, residente e domiciliado à Rua {{endereco_cliente}}, nº {{numero_cliente}}, Bairro {{bairro_cliente}}, Cidade {{cidade_cliente}}, Estado {{estado_cliente}}, CEP {{cep_cliente}}.

As partes celebram o presente contrato de prestação de serviços nas condições e cláusulas seguintes:

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. O presente contrato tem como objeto a prestação de serviços por {{nome_empresa}} ao {{nome_cliente}}, conforme especificado nas cláusulas e condições subsequentes.

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DE {{nome_empresa}}
2.1. {{nome_empresa}} se obriga a:
a) Prestar os serviços com profissionalismo, dedicação e zelo;
b) Cumprir os prazos estipulados;
c) Manter a confidencialidade das informações do {{nome_cliente}};
d) Fornecer suporte técnico quando necessário.

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO {{nome_cliente}}
3.1. O {{nome_cliente}} se obriga a:
a) Fornecer todas as informações necessárias para a prestação dos serviços;
b) Pagar os honorários estipulados nos prazos acordados;
c) Respeitar os horários de atendimento estabelecidos;
d) Manter a confidencialidade das informações de {{nome_empresa}}.

CLÁUSULA QUARTA - DO PAGAMENTO
4.1. Os honorários pelos serviços prestados serão de R$ {{valor_honorarios}}, pagáveis da seguinte forma:
a) 50% no ato da assinatura deste contrato;
b) 50% na conclusão dos serviços, conforme especificado na cláusula quinta.

CLÁUSULA QUINTA - DO PRAZO
5.1. O prazo de vigência deste contrato é de {{prazo_vigencia}} dias a contar da data de assinatura.
5.2. O contrato poderá ser renovado mediante acordo mútuo entre as partes.

CLÁUSULA SEXTA - CONFIDENCIALIDADE
6.1. Todas as informações trocadas entre as partes são confidenciais e não poderão ser divulgadas a terceiros sem autorização expressa.

CLÁUSULA SÉTIMA - DISPOSIÇÕES GERAIS
7.1. Este contrato poderá ser rescindido por qualquer das partes mediante notificação prévia de 30 dias.
7.2. As partes elegem o Foro da Comarca de {{comarca}} para dirimir quaisquer controvérsias.

E por estarem assim justas e contratadas, assinam o presente contrato em duas vias de igual teor, na presença das testemunhas abaixo.

{{local_data}}, {{data_assinatura}}.

_________________________
{{nome_empresa}}                     {{nome_cliente}}

Testemunhas:
1. ____________________________________
2. ____________________________________`;

                        setEditingContract(prev => ({ ...prev, template: exampleTemplate }));
                        // Atualizar no array de contratos
                        if (customContracts.some(c => c.id === editingContract.id)) {
                          setCustomContracts(prev => 
                            prev.map(c => c.id === editingContract.id ? { ...c, template: exampleTemplate } : c)
                          );
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Importar Exemplo
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Gerar documento Word
                        const template = editingContract.template || '';
                        if (!template.trim()) {
                          alert('Por favor, digite um template antes de gerar o documento.');
                          return;
                        }
                        
                        // Criar conteúdo do documento
                        const content = template
                          .replace(/\{\{(\w+)\)\}/g, (match, key) => {
                            // Aqui você pode adicionar lógica para substituir variáveis
                            return `{{${key}}}`;
                          });
                        
                        // Criar blob e download
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${editingContract.name.replace(/\s+/g, '_')}_template.txt`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gerar Word
                    </Button>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingContract(null);
                        setActiveView('contracts');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        // Salvar as alterações
                        if (customContracts.some(c => c.id === editingContract.id)) {
                          setCustomContracts(prev => 
                            prev.map(c => c.id === editingContract.id ? editingContract : c)
                          );
                        }
                        setEditingContract(null);
                        setActiveView('contracts');
                      }}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulário de Contrato */}
          {selectedContract && !contractData && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Preencha os dados para gerar o contrato...
              </p>
            </div>
          )}

          {/* Preview do Contrato */}
          {selectedContract && contractData && (
            <ContractPreview
              contractType={selectedContract}
              contractData={contractData}
              onBack={handleBack}
            />
          )}
        </main>

        {/* Dialogs */}
        <ContractForm
          isOpen={isFormOpen}
          onClose={handleCancel}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
          contractType={selectedContract}
        />

        <AddContractDialog
          isOpen={isAddContractOpen}
          onClose={() => setIsAddContractOpen(false)}
          onAdd={handleAddContract}
          categories={allCategories}
        />

        <CategoryDialog
          isOpen={isCategoryDialogOpen}
          onClose={() => setIsCategoryDialogOpen(false)}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          editingCategory={editingCategory}
          contracts={customContracts}
          showAlert={showAlert}
        />

        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={() => {
            if (confirmModal.onConfirm) {
              confirmModal.onConfirm();
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          itemName={confirmModal.itemName}
          type="danger"
          confirmText="Sim"
          cancelText="Não"
        />
      </div>
    </div>
  );
}

export default App;