import { useState } from 'react';
import { Button } from './ui/button';
import { X, Menu, Home, FileText, Settings, Clock, Plus, Trash2 } from 'lucide-react';

export function Sidebar({ isOpen, onToggle, isCollapsed, onToggleCollapse, activeView, onViewChange, contracts = [], categories = [] }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'categories', label: 'Categorias', icon: Settings },
    { id: 'recent', label: 'Recentes', icon: Clock },
    { id: 'trash', label: 'Lixeira', icon: Trash2 },
  ];

  const recentContracts = contracts.slice(-5).reverse();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        lg:relative lg:inset-y-0 lg:left-0 lg:z-auto fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-800 to-emerald-900">
          <div className="flex items-center gap-3">
            <button
              className="p-2 bg-emerald-700/50 rounded-lg flex-shrink-0 hover:bg-emerald-600/50 transition-all duration-200 backdrop-blur-sm border border-emerald-600/30"
              onClick={onToggleCollapse}
            >
              <FileText className="w-5 h-5 text-emerald-100" />
            </button>
            <div className={`transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="text-lg font-semibold text-emerald-50 whitespace-nowrap">Contratos</h1>
            </div>
          </div>
          
          {/* Botão de fechar (apenas mobile) */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden bg-emerald-700/50 hover:bg-emerald-600/50 text-emerald-100 border-emerald-600/30"
            onClick={onToggle}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Menu de Navegação */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start transition-all duration-200 ${
                    isCollapsed ? 'px-2' : 'px-3'
                  } ${
                    isActive 
                      ? 'bg-emerald-100 text-emerald-800 shadow-md border-emerald-200' 
                      : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-800'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-emerald-700' : 'text-gray-500 group-hover:text-emerald-600'
                  }`} />
                  <span className={`transition-all duration-200 ${
                    isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-3'
                  }`}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
