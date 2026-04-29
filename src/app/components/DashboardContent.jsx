import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, Plus, TrendingUp, Clock, Users, FolderPlus, Settings } from 'lucide-react';

export function DashboardContent({ 
  contracts = [], 
  categories = [], 
  customContracts = [], 
  onNavigate,
  totalViews = 0 
}) {
  console.log('DashboardContent renderizado com:', { contracts, categories, customContracts, totalViews });
  
  // Calcular estatísticas
  const totalContracts = contracts.length + customContracts.length;
  const recentContracts = [...contracts, ...customContracts]
    .slice(-5)
    .reverse()
    .slice(0, 3);

  const mostEditedContracts = [...contracts, ...customContracts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  console.log('Estatísticas calculadas:', { totalContracts, recentContracts, mostEditedContracts });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu sistema de contratos</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onNavigate('contracts')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
          <Button variant="outline" onClick={() => onNavigate('categories')}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground">
              {customContracts.length} personalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Para organizar seus contratos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Total de visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hoje</div>
            <p className="text-xs text-muted-foreground">
              Última atualização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contratos Mais Editados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Contratos Mais Editados
            </CardTitle>
            <CardDescription>
              Contratos com mais visualizações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostEditedContracts.length > 0 ? (
              <div className="space-y-4">
                {mostEditedContracts.map((contract, index) => (
                  <div key={contract.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{contract.name}</p>
                      <p className="text-sm text-gray-600">{contract.views || 0} visualizações</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('contracts', contract)}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum contrato editado ainda</p>
                <Button 
                  className="mt-4"
                  onClick={() => onNavigate('contracts')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Contrato
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Novos Contratos Adicionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Novos Contratos
            </CardTitle>
            <CardDescription>
              Contratos adicionados recentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentContracts.length > 0 ? (
              <div className="space-y-4">
                {recentContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{contract.name}</p>
                      <p className="text-sm text-gray-600">
                        {contract.customFields ? 'Personalizado' : 'Padrão'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('contracts', contract)}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum contrato criado ainda</p>
                <Button 
                  className="mt-4"
                  onClick={() => onNavigate('contracts')}
                >
                  Criar Primeiro Contrato
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categorias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Categorias
            </CardTitle>
            <CardDescription>
              Organize seus contratos por categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.slice(0, 5).map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${category.bgClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <category.icon className={`w-4 h-4 ${category.iconClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate('categories')}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma categoria criada ainda</p>
                <Button 
                  className="mt-4"
                  onClick={() => onNavigate('categories')}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Criar Categoria
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acessos rápidos para as funcionalidades mais usadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex-col"
              onClick={() => onNavigate('contracts')}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span>Gerenciar Contratos</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex-col"
              onClick={() => onNavigate('categories')}
            >
              <Settings className="w-6 h-6 mb-2" />
              <span>Gerenciar Categorias</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex-col"
              onClick={() => onNavigate('recent')}
            >
              <Clock className="w-6 h-6 mb-2" />
              <span>Ver Recentes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
