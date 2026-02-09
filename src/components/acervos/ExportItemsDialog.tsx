import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet } from "lucide-react";

interface ExportItemsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onExport: (selectedColumns: string[]) => void;
}

const AVAILABLE_COLUMNS = [
    { id: "categoria", label: "Categoria" },
    { id: "fonte", label: "Fonte" },
    { id: "codigo", label: "Código" },
    { id: "descricao", label: "Descrição" },
    { id: "unidade", label: "Unidade" },
    { id: "quantidade", label: "Quantidade" },
    { id: "valor_executado", label: "Valor Unitário" },
    { id: "data_execucao", label: "Data Execução" },
];

export function ExportItemsDialog({
    open,
    onOpenChange,
    onExport,
}: ExportItemsDialogProps) {
    const [selectedColumns, setSelectedColumns] = useState<string[]>(
        AVAILABLE_COLUMNS.map((col) => col.id)
    );

    const toggleColumn = (columnId: string) => {
        setSelectedColumns((prev) =>
            prev.includes(columnId)
                ? prev.filter((id) => id !== columnId)
                : [...prev, columnId]
        );
    };

    const handleSelectAll = () => {
        if (selectedColumns.length === AVAILABLE_COLUMNS.length) {
            setSelectedColumns(["descricao"]); // Keep description as minimum
        } else {
            setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.id));
        }
    };

    const handleExport = () => {
        onExport(selectedColumns);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] mx-auto">
                <DialogHeader>
                    <DialogTitle>Exportar Itens para Excel</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium">Selecione as colunas:</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSelectAll}
                            className="text-xs h-8"
                        >
                            {selectedColumns.length === AVAILABLE_COLUMNS.length
                                ? "Desmarcar todos"
                                : "Marcar todos"}
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {AVAILABLE_COLUMNS.map((column) => (
                            <div key={column.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={column.id}
                                    checked={selectedColumns.includes(column.id)}
                                    onChange={() => toggleColumn(column.id)}
                                    disabled={column.id === "descricao"} // Force description
                                />
                                <Label
                                    htmlFor={column.id}
                                    className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {column.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        * A descrição é obrigatória.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
