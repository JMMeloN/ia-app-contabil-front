import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle, 
  Clock, 
  FileCheck, 
  XCircle, 
  AlertTriangle,
  History
} from "lucide-react";
import { NotaFiscalStatus, NotaFiscalSolicitada } from '@/types';

interface StatusManagerProps {
  nota: NotaFiscalSolicitada;
  onUpdateStatus: (notaId: string, status: NotaFiscalStatus, observacao?: string) => void;
  isLoading?: boolean;
}

const statusOptions: {
  value: NotaFiscalStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: 'pendente',
    label: 'Pendente',
    description: 'Aguardando ação do processador',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'anexado',
    label: 'Anexado',
    description: 'Documentos anexados, aguardando processamento',
    icon: <FileCheck className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'processado',
    label: 'Processado',
    description: 'Solicitação concluída com sucesso',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'cancelado',
    label: 'Cancelado',
    description: 'Solicitação cancelada ou rejeitada',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-red-100 text-red-800',
  },
];

export function StatusManager({ nota, onUpdateStatus, isLoading }: StatusManagerProps) {
  const [novoStatus, setNovoStatus] = useState<NotaFiscalStatus>(nota.status);
  const [observacao, setObservacao] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const statusAtual = statusOptions.find(s => s.value === nota.status);
  const statusNovo = statusOptions.find(s => s.value === novoStatus);

  const handleStatusChange = () => {
    onUpdateStatus(nota.id, novoStatus, observacao);
    setObservacao('');
    setShowConfirmDialog(false);
  };

  const canChangeStatus = novoStatus !== nota.status;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Gestão de Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status atual */}
        <div className="space-y-2">
          <Label>Status Atual</Label>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {statusAtual?.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge className={statusAtual?.color}>
                  {statusAtual?.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {statusAtual?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Alterar status */}
        <div className="space-y-4">
          <Label>Alterar Status</Label>
          <Select
            value={novoStatus}
            onValueChange={(value) => setNovoStatus(value as NotaFiscalStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {canChangeStatus && (
            <div className="space-y-2">
              <Label htmlFor="observacao">Observação da Alteração</Label>
              <Textarea
                id="observacao"
                placeholder="Descreva o motivo da alteração de status (opcional)..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Preview da mudança */}
        {canChangeStatus && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Prévia da Alteração
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">De:</span>
                <Badge className={statusAtual?.color}>
                  {statusAtual?.label}
                </Badge>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Para:</span>
                <Badge className={statusNovo?.color}>
                  {statusNovo?.label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Botão de ação */}
        {canChangeStatus && (
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogTrigger asChild>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? 'Atualizando...' : 'Confirmar Alteração de Status'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Alteração de Status</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3">
                    <p>
                      Você está prestes a alterar o status desta nota fiscal de{' '}
                      <strong>{statusAtual?.label}</strong> para{' '}
                      <strong>{statusNovo?.label}</strong>.
                    </p>
                    
                    {observacao && (
                      <div className="p-3 bg-muted rounded">
                        <p className="text-sm font-medium mb-1">Observação:</p>
                        <p className="text-sm">{observacao}</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      Esta ação será registrada no histórico da nota e uma notificação 
                      será enviada ao cliente solicitante.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleStatusChange}>
                  Confirmar Alteração
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Timeline de status (placeholder para futuro) */}
        <div className="space-y-2">
          <Label>Histórico de Status</Label>
          <div className="text-sm text-muted-foreground">
            Histórico de alterações de status será exibido aqui...
          </div>
        </div>
      </CardContent>
    </Card>
  );
}