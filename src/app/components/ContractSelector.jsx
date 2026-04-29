import { FileText, Briefcase, Home, Users, Building, Car, Heart, ShoppingCart, Plus, ChevronDown, FolderPlus, Settings, Trash2, Search, Filter, Edit } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';

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
    id: 'trabalho',
    name: 'Contrato de Trabalho',
    icon: 'Users',
    description: 'Contrato de trabalho temporário ou permanente',
    category: 'trabalhistas'
  },
  {
    id: 'prestacao-servicos',
    name: 'Contrato de Prestação de Serviços',
    icon: 'Briefcase',
    description: 'Contrato para prestação de serviços profissionais',
    category: 'trabalhistas'
  },
  {
    id: 'locacao',
    name: 'Contrato de Locação',
    icon: 'Home',
    description: 'Contrato para locação de imóveis residenciais ou comerciais',
    category: 'locacao'
  },
  {
    id: 'compra-venda',
    name: 'Contrato de Compra e Venda',
    icon: 'FileText',
    description: 'Contrato para transações de compra e venda',
    category: 'locacao'
  },
  {
    id: 'eleicoes',
    name: 'Contrato para Eleições',
    icon: 'Users',
    description: 'Contrato para serviços em campanhas eleitorais',
    category: 'eleicoes'
  },
];

const categoryConfig = {
  trabalhistas: {
    name: 'Contratos Trabalhistas',
    icon: Users,
    color: 'blue',
    description: 'Contratos relacionados a relações de trabalho',
    bgClass: 'bg-blue-100',
    iconClass: 'text-blue-600'
  },
  locacao: {
    name: 'Contratos de Locação e Imóveis',
    icon: Home,
    color: 'green',
    description: 'Contratos para locação, compra e venda de imóveis',
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600'
  },
  eleicoes: {
    name: 'Contratos para Eleições',
    icon: Users,
    color: 'purple',
    description: 'Contratos para serviços eleitorais e campanhas',
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600'
  },
  outros: {
    name: 'Outros Contratos',
    icon: FileText,
    color: 'gray',
    description: 'Outros tipos de contratos personalizados',
    bgClass: 'bg-gray-100',
    iconClass: 'text-gray-600'
  }
};

export function ContractSelector({ onSelect, customContracts = [], customCategories = [], onAddNew, onAddCategory, onEditCategory, onDeleteCategory, onDeleteContract }) {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = {
      trabalhistas: true,
      locacao: true,
      eleicoes: true,
      outros: true
    };
    
    // Adicionar categorias personalizadas ao estado inicial
    customCategories.forEach(cat => {
      initial[cat.id] = true;
    });
    
    return initial;
  });

  // Estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Função de filtragem
  const filterContracts = (contracts) => {
    return contracts.filter(contract => {
      const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || contract.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Obter categorias para o filtro
  const getAllCategories = () => {
    const categories = ['all'];
    const categorySet = new Set();
    
    // Adicionar categorias dos contratos padrão
    defaultContractTypes.forEach(contract => {
      categorySet.add(contract.category);
    });
    
    // Adicionar categorias personalizadas
    customCategories.forEach(cat => {
      categorySet.add(cat.id);
    });
    
    return categories.concat(Array.from(categorySet));
  };

  // Atualizar expandedCategories quando customCategories mudar
  useEffect(() => {
    setExpandedCategories(prev => {
      const updated = { ...prev };
      customCategories.forEach(cat => {
        if (!(cat.id in updated)) {
          updated[cat.id] = true;
        }
      });
      return updated;
    });
  }, [customCategories]);

  // Adicionar categoria aos contratos personalizados
  const allContracts = [
    ...defaultContractTypes,
    ...customContracts.map(contract => ({
      ...contract,
      category: contract.category || 'outros'
    }))
  ];

  // Agrupar contratos por categoria
  const contractsByCategory = allContracts.reduce((acc, contract) => {
    const category = contract.category || 'outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(contract);
    return acc;
  }, {});

  // Mesclar categorias padrão com personalizadas
  const allCategories = { ...categoryConfig };
  customCategories.forEach(cat => {
    allCategories[cat.id] = cat;
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAddCategory = () => {
    if (onAddCategory) {
      onAddCategory();
    }
  };

  const handleEditCategory = (category) => {
    if (onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (onDeleteCategory) {
      onDeleteCategory(categoryId);
    }
  };

  const handleDeleteContract = (contractId) => {
    if (onDeleteContract) {
      if (confirm('Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.')) {
        onDeleteContract(contractId);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Busca e Filtro */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contratos</h2>
            <p className="text-gray-600">Selecione um modelo de contrato para começar</p>
          </div>
          <Button onClick={onAddNew} variant="outline">
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
                  const category = allCategories[categoryId];
                  return (
                    <SelectItem key={categoryId} value={categoryId}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${category.bgClass}`} />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAddCategory} variant="outline" size="sm">
          <FolderPlus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {Object.entries(allCategories).map(([categoryKey, config]) => {
        const categoryContracts = contractsByCategory[categoryKey] || [];
        const isExpanded = expandedCategories[categoryKey];
        const CategoryIcon = config.icon;
        
        // Aplicar filtro nos contratos da categoria
        const filteredCategoryContracts = filterContracts(categoryContracts);
        
        // Mostrar categorias mesmo que não tenham contratos (exceto algumas padrão)
        const shouldShow = filteredCategoryContracts.length > 0 || 
                          (customCategories.some(cat => cat.id === categoryKey));

        if (!shouldShow) return null;
        
        return (
          <div key={categoryKey} className="space-y-3">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => toggleCategory(categoryKey)}
            >
              {CategoryIcon && (
                <div className={`p-2 ${config.bgClass} rounded-lg`}>
                  <CategoryIcon className={`w-5 h-5 ${config.iconClass}`} />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{config.name}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {filteredCategoryContracts.length}
                </span>
                {customCategories.some(cat => cat.id === categoryKey) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const category = customCategories.find(cat => cat.id === categoryKey);
                      handleEditCategory(category);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto ml-8">
                {filteredCategoryContracts.map((contract) => {
                  const Icon = iconMap[contract.icon] || FileText;
                  return (
                    <Card
                      key={contract.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow relative group"
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
                          <Button
                            variant="destructive"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContract(contract.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredCategoryContracts.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Nenhum contrato encontrado com os filtros aplicados.'
                        : 'Nenhum contrato nesta categoria ainda.'
                      }
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
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
          </div>
        );
      })}
    </div>
  );
}