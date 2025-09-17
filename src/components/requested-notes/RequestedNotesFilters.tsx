import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FiltrosNotasSolicitadas, NotaFiscalStatus } from '@/types';

interface RequestedNotesFiltersProps {
  filtros: FiltrosNotasSolicitadas;
  onFiltrosChange: (filtros: FiltrosNotasSolicitadas) => void;
  onLimparFiltros: () => void;
  totalNotas: number;
  notasFiltradas: number;
}

const statusOptions: { value: NotaFiscalStatus; label: string; color: string }[] = [
  { value: 'pendente', label: 'Pendente', color: 'bg-yellow-500' },
  { value: 'anexado', label: 'Anexado', color: 'bg-blue-500' },
  { value: 'processado', label: 'Processado', color: 'bg-green-500' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-500' },
];

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa', color: 'bg-gray-500' },
  { value: 'media', label: 'Média', color: 'bg-yellow-500' },
  { value: 'alta', label: 'Alta', color: 'bg-red-500' },
];

export function RequestedNotesFilters({
  filtros,
  onFiltrosChange,
  onLimparFiltros,
  totalNotas,
  notasFiltradas,
}: RequestedNotesFiltersProps) {
  const [dataInicial, setDataInicial] = useState<Date | undefined>(
    filtros.dataInicial ? new Date(filtros.dataInicial) : undefined
  );
  const [dataFinal, setDataFinal] = useState<Date | undefined>(
    filtros.dataFinal ? new Date(filtros.dataFinal) : undefined
  );

  const handleBuscaChange = (busca: string) => {
    onFiltrosChange({ ...filtros, busca: busca || undefined });
  };

  const handleStatusToggle = (status: NotaFiscalStatus) => {
    const statusAtuais = filtros.status || [];
    const novoStatus = statusAtuais.includes(status)
      ? statusAtuais.filter(s => s !== status)
      : [...statusAtuais, status];
    
    onFiltrosChange({ 
      ...filtros, 
      status: novoStatus.length > 0 ? novoStatus : undefined 
    });
  };

  const handlePrioridadeToggle = (prioridade: 'baixa' | 'media' | 'alta') => {
    const prioridadesAtuais = filtros.prioridade || [];
    const novaPrioridade = prioridadesAtuais.includes(prioridade)
      ? prioridadesAtuais.filter(p => p !== prioridade)
      : [...prioridadesAtuais, prioridade];
    
    onFiltrosChange({ 
      ...filtros, 
      prioridade: novaPrioridade.length > 0 ? novaPrioridade : undefined 
    });
  };

  const handleDataInicialChange = (date: Date | undefined) => {
    setDataInicial(date);
    onFiltrosChange({ 
      ...filtros, 
      dataInicial: date ? date.toISOString().split('T')[0] : undefined 
    });
  };

  const handleDataFinalChange = (date: Date | undefined) => {
    setDataFinal(date);
    onFiltrosChange({ 
      ...filtros, 
      dataFinal: date ? date.toISOString().split('T')[0] : undefined 
    });
  };

  const temFiltrosAtivos = Object.keys(filtros).some(key => 
    filtros[key as keyof FiltrosNotasSolicitadas] !== undefined
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {notasFiltradas} de {totalNotas} notas
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de busca */}
        <div className="space-y-2">
          <Label htmlFor="busca">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="busca"
              placeholder="Buscar por número da nota, cliente ou observações..."
              value={filtros.busca || ''}
              onChange={(e) => handleBuscaChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtros de data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicial && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicial}
                  onSelect={handleDataInicialChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFinal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFinal}
                  onSelect={handleDataFinalChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filtros de Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isSelected = filtros.status?.includes(option.value) || false;
              return (
                <Badge
                  key={option.value}
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected && option.color
                  )}
                  onClick={() => handleStatusToggle(option.value)}
                >
                  {option.label}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Filtros de Prioridade */}
        <div className="space-y-2">
          <Label>Prioridade</Label>
          <div className="flex flex-wrap gap-2">
            {prioridadeOptions.map((option) => {
              const isSelected = filtros.prioridade?.includes(option.value as any) || false;
              return (
                <Badge
                  key={option.value}
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected && option.color
                  )}
                  onClick={() => handlePrioridadeToggle(option.value as any)}
                >
                  {option.label}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Filtro por anexos */}
        <div className="space-y-2">
          <Label>Anexos</Label>
          <Select
            value={filtros.temAnexos === undefined ? "" : filtros.temAnexos.toString()}
            onValueChange={(value) => {
              if (value === "") {
                onFiltrosChange({ ...filtros, temAnexos: undefined });
              } else {
                onFiltrosChange({ ...filtros, temAnexos: value === "true" });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as notas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as notas</SelectItem>
              <SelectItem value="true">Com anexos</SelectItem>
              <SelectItem value="false">Sem anexos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão limpar filtros */}
        {temFiltrosAtivos && (
          <Button
            variant="outline"
            onClick={onLimparFiltros}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar todos os filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
}