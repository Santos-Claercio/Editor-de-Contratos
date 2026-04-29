import { useState } from 'react';
import { 
  Home, 
  FileText, 
  Settings, 
  Clock, 
  Menu, 
  X,
  Users,
  TrendingUp,
  Plus,
  LogOut
} from 'lucide-react';

export function CDMSidebar({ isOpen, onToggle, isCollapsed, onToggleCollapse, activeView, onViewChange, contracts = [], categories = [] }) {
  const navItems = [
    { 
      title: 'Dashboard', 
      url: '/dashboard', 
      icon: Home 
    },
    { 
      title: 'Contratos', 
      url: '/contracts', 
      icon: FileText 
    },
    { 
      title: 'Categorias', 
      url: '/categories', 
      icon: Settings 
    },
    { 
      title: 'Recentes', 
      url: '/recent', 
      icon: Clock 
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200/80 shadow-xl transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="text-xl font-bold text-white tracking-tight">Contratos</h1>
            </div>
          </div>
          
          {/* Botão de expandir/retrair (apenas desktop) */}
          <button
            className="hidden lg:flex p-2 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg transition-colors duration-200"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
          
          {/* Botão de fechar (apenas mobile) */}
          <button
            className="lg:hidden p-2 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg transition-colors duration-200"
            onClick={onToggle}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <div className={`text-gray-500 uppercase text-xs tracking-wider font-semibold px-3 py-2 ${
              isCollapsed ? 'text-center' : ''
            }`}>
              {!isCollapsed && 'Menu'}
            </div>
            
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.url;
                
                return (
                  <button
                    key={item.title}
                    onClick={() => onViewChange(item.url)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    }`} />
                    {!isCollapsed && (
                      <span className="transition-all duration-200">
                        {item.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Área de Conteúdo Adicional (apenas quando não está colapsado) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50 space-y-4">
            {/* Estatísticas */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{contracts.length}</div>
                  <div className="text-xs text-gray-600">Contratos</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-xs text-gray-600">Categorias</div>
                </div>
              </div>
            </div>

            {/* Contratos Recentes */}
            {contracts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recentes</h3>
                <div className="space-y-2">
                  {contracts.slice(-3).reverse().map((contract, index) => (
                    <div key={contract.id} className="text-xs text-gray-600 p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{contract.name}</div>
                          <div className="text-gray-600">{contract.views || 0} views</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
