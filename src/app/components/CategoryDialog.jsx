import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Briefcase, Home, Users, Building, Car, Heart, ShoppingCart, Trash2 } from 'lucide-react';

const iconOptions = [
  { value: 'FileText', label: 'Documento', icon: FileText },
  { value: 'Briefcase', label: 'Pasta', icon: Briefcase },
  { value: 'Home', label: 'Casa', icon: Home },
  { value: 'Users', label: 'Pessoas', icon: Users },
  { value: 'Building', label: 'Prédio', icon: Building },
  { value: 'Car', label: 'Carro', icon: Car },
  { value: 'Heart', label: 'Coração', icon: Heart },
  { value: 'ShoppingCart', label: 'Carrinho', icon: ShoppingCart },
];

const colorOptions = [
  { value: 'blue', label: 'Azul', bgClass: 'bg-blue-100', iconClass: 'text-blue-600' },
  { value: 'green', label: 'Verde', bgClass: 'bg-green-100', iconClass: 'text-green-600' },
  { value: 'purple', label: 'Roxo', bgClass: 'bg-purple-100', iconClass: 'text-purple-600' },
  { value: 'red', label: 'Vermelho', bgClass: 'bg-red-100', iconClass: 'text-red-600' },
  { value: 'yellow', label: 'Amarelo', bgClass: 'bg-yellow-100', iconClass: 'text-yellow-600' },
  { value: 'gray', label: 'Cinza', bgClass: 'bg-gray-100', iconClass: 'text-gray-600' },
];

export function CategoryDialog({ 
  isOpen, 
  onClose, 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory,
  editingCategory,
  contracts = [],
  showAlert
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'FileText',
    color: 'blue'
  });

  // Resetar formulário quando o dialog abrir ou fechar
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          description: editingCategory.description,
          icon: iconOptions.find(opt => opt.value === editingCategory.icon?.value || editingCategory.icon)?.value || 'FileText',
          color: editingCategory.color || 'blue'
        });
      } else {
        setFormData({
          name: '',
          description: '',
          icon: 'FileText',
          color: 'blue'
        });
      }
    }
  }, [isOpen, editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Gerar ID a partir do nome
    const id = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Encontrar o ícone e cor selecionados
    const selectedIcon = iconOptions.find(opt => opt.value === formData.icon);
    const selectedColor = colorOptions.find(opt => opt.value === formData.color);

    const categoryData = {
      id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: selectedIcon.icon,
      color: formData.color,
      bgClass: selectedColor.bgClass,
      iconClass: selectedColor.iconClass
    };

    if (editingCategory) {
      onEditCategory({ ...categoryData, originalId: editingCategory.id });
    } else {
      onAddCategory(categoryData);
    }
    
    // Resetar formulário
    setFormData({
      name: '',
      description: '',
      icon: 'FileText',
      color: 'blue'
    });
    
    onClose();
  };

  const handleDelete = () => {
    if (editingCategory && onDeleteCategory) {
      const contractsInCategory = contracts.filter(contract => contract.category === editingCategory.id);
      if (contractsInCategory.length > 0) {
        if (showAlert) {
          showAlert(
            'Não é possível excluir categoria',
            `Esta categoria não pode ser excluída pois existem ${contractsInCategory.length} contrato(s) relacionado(s) a ela. Para excluir esta categoria, primeiro remova ou mova todos os contratos relacionados.`,
            'warning'
          );
        }
        return;
      }
      
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        onDeleteCategory(editingCategory.id);
        onClose();
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria de Contratos'}</DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? 'Edite as informações da categoria existente.'
              : 'Crie uma nova categoria para organizar seus contratos.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Nome da Categoria</Label>
            <Input
              id="categoryName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Contratos Escolares"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Descrição</Label>
            <Input
              id="categoryDescription"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva o tipo de contratos desta categoria"
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <Select value={formData.icon} onValueChange={(value) => handleChange('icon', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ícone" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <Select value={formData.color} onValueChange={(value) => handleChange('color', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.bgClass}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {editingCategory && onDeleteCategory && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Salvar' : 'Criar Categoria'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
