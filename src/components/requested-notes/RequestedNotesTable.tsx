import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  FileText, 
  Paperclip,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NotaFiscalSolicitada, NotaFiscalStatus } from '@/types';

interface RequestedNotesTableProps {
  notas: NotaFiscalSolicitada[];
  onViewDetails: (nota: NotaFiscalSolicitada) => void;
  onUpdateStatus: (notaId: string, status: NotaFiscalStatus) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const getStatusBadge = (status: NotaFiscalStatus) => {
  const statusConfig = {
    pendente: { 
      label: 'Pendente', 
      variant: 'secondary' as const, 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
    },
    anexado: { 
      label: 'Anexado', 
      variant: 'secondary' as const, 
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
    },
    processado: { 
      label: 'Processado', 
      variant: 'secondary' as const, 
      className: 'bg-green-100 text-green-800 hover:bg-green-100' 
    },
    cancelado: { 
      label: 'Cancelado', 
      variant: 'secondary' as const, 
      className: 'bg-red-100 text-red-800 hover:bg-red-100' 
    },
  };

  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const getPrioridadeBadge = (prioridade: 'baixa' | 'media' | 'alta') => {
  const prioridadeConfig = {
    baixa: { 
      label: 'Baixa', 
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' 
    },
    media: { 
      label: 'Média', 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' 
    },
    alta: { 
      label: 'Alta', 
      className: 'bg-red-100 text-red-800 hover:bg-red-100' 
    },
  };

  const config = prioridadeConfig[prioridade];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
};

export function RequestedNotesTable({
  notas,
  onViewDetails,
  onUpdateStatus,
  isLoading,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RequestedNotesTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span>Carregando notas fiscais...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notas Fiscais Solicitadas</span>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{notas.length} notas</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notas.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Nenhuma nota fiscal encontrada</h3>
            <p className="text-muted-foreground">
              Não há notas fiscais que correspondam aos filtros aplicados.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        Cliente
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Número da Nota</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        Data Solicitação
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        Valor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Anexos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.map((nota) => (
                    <TableRow key={nota.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{nota.clienteNome}</div>
                          <div className="text-sm text-muted-foreground">
                            {nota.clienteEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {nota.numeroNota || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(nota.dataSolicitacao)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(nota.valor)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(nota.status)}
                      </TableCell>
                      <TableCell>
                        {getPrioridadeBadge(nota.prioridade)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">0</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => onViewDetails(nota)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                            {(['pendente', 'anexado', 'processado', 'cancelado'] as NotaFiscalStatus[])
                              .filter(status => status !== nota.status)
                              .map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => onUpdateStatus(nota.id, status)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Linhas por página</p>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <span className="sr-only">Página anterior</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <span className="sr-only">Próxima página</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}