import * as XLSX from "xlsx";
import type { CreateItemInput } from "@/types/item";

export interface ExcelItemRow {
  descricao: string;
  categoria?: string;
  unidade: string;
  quantidade: string | number;
  valor_executado: string | number;
  data_execucao: string;
}

/**
 * Exporta um modelo de planilha Excel para cadastro de itens
 */
export function exportItemTemplate(): void {
  const template: ExcelItemRow[] = [
    {
      categoria: "Infraestrutura",
      descricao: "Exemplo: Serviço de terraplenagem",

      unidade: "m³",
      quantidade: 100,
      valor_executado: 25.5,
      data_execucao: "2024-01-15",
    },
    {
      categoria: "Superestrutura",
      descricao: "Exemplo: Concreto estrutural",
      unidade: "m³",
      quantidade: 50,
      valor_executado: 350.0,
      data_execucao: "2024-01-20",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template, {
    header: [
      "categoria",
      "descricao",
      "unidade",
      "quantidade",
      "valor_executado",
      "data_execucao",
    ],
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Itens");

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 20 }, // categoria
    { wch: 40 }, // descricao
    { wch: 12 }, // unidade
    { wch: 15 }, // quantidade
    { wch: 15 }, // valor_executado
    { wch: 18 }, // data_execucao
  ];
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, "modelo_itens_acervo.xlsx");
}

/**
 * Importa itens de uma planilha Excel
 */
export function importItemsFromFile(file: File): Promise<CreateItemInput[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Erro ao ler arquivo"));
          return;
        }

        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converter para JSON - usar primeira linha como cabeçalho
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: "", // Valor padrão para células vazias
        });

        // Normalizar nomes das colunas (case-insensitive e com espaços)
        const normalizeKey = (key: string) => {
          return key
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
        };

        // Mapear colunas esperadas
        const columnMap: Record<string, keyof ExcelItemRow> = {
          descricao: "descricao",
          descrição: "descricao",
          categoria: "categoria",
          cat: "categoria",
          unidade: "unidade",
          quantidade: "quantidade",
          qtd: "quantidade",
          valor_executado: "valor_executado",
          valor: "valor_executado",
          valor_unit: "valor_executado",
          valor_unitario: "valor_executado",
          data_execucao: "data_execucao",
          data: "data_execucao",
          data_exec: "data_execucao",
        };

        // Criar mapeamento de colunas do arquivo
        const firstRow = jsonData[0];
        if (!firstRow) {
          throw new Error("Planilha vazia");
        }

        const fileColumnMap: Record<string, keyof ExcelItemRow> = {};
        Object.keys(firstRow).forEach((key) => {
          const normalized = normalizeKey(key);
          const mappedColumn = columnMap[normalized];
          if (mappedColumn) {
            fileColumnMap[key] = mappedColumn;
          }
        });

        // Validar se encontrou as colunas obrigatórias
        const requiredColumns = ["descricao", "unidade"];
        const foundColumns = Object.values(fileColumnMap);
        const missingColumns = requiredColumns.filter(
          (col) => !foundColumns.includes(col as keyof ExcelItemRow),
        );

        if (missingColumns.length > 0) {
          throw new Error(
            `Colunas obrigatórias não encontradas: ${missingColumns.join(", ")}`,
          );
        }

        // Converter dados usando o mapeamento
        const normalizedData: ExcelItemRow[] = jsonData.map((row) => {
          const normalized: any = {};
          Object.keys(fileColumnMap).forEach((fileKey) => {
            const mappedKey = fileColumnMap[fileKey];
            normalized[mappedKey] = row[fileKey];
          });
          return normalized as ExcelItemRow;
        });

        // Validar e converter dados
        const items: CreateItemInput[] = normalizedData
          .filter((row) => {
            // Filtrar linhas vazias ou de exemplo
            return (
              row.descricao &&
              typeof row.descricao === "string" &&
              row.descricao.trim() !== ""
            );
          })
          .map((row) => {
            // Converter quantidade
            const quantidade =
              typeof row.quantidade === "string"
                ? parseFloat(row.quantidade.replace(",", "."))
                : Number(row.quantidade);

            // Converter valor
            const valor_executado =
              typeof row.valor_executado === "string"
                ? parseFloat(
                    row.valor_executado
                      .toString()
                      .replace(/[^\d,.-]/g, "")
                      .replace(",", "."),
                  )
                : Number(row.valor_executado);

            // Validar data
            let data_execucao = row.data_execucao;
            if (typeof data_execucao === "number") {
              // Se for número do Excel (dias desde 1900)
              const excelEpoch = new Date(1900, 0, 1);
              excelEpoch.setDate(excelEpoch.getDate() + data_execucao - 2);
              data_execucao = excelEpoch.toISOString().split("T")[0];
            } else if (typeof data_execucao === "string") {
              // Tentar converter formato brasileiro
              const dateMatch = data_execucao.match(
                /(\d{2})\/(\d{2})\/(\d{4})/,
              );
              if (dateMatch) {
                const [, day, month, year] = dateMatch;
                data_execucao = `${year}-${month}-${day}`;
              } else {
                // Tentar ISO
                const date = new Date(data_execucao);
                if (!isNaN(date.getTime())) {
                  data_execucao = date.toISOString().split("T")[0];
                }
              }
            }

            // Validações
            if (!row.descricao || !row.unidade) {
              throw new Error(
                `Linha inválida: descrição e unidade são obrigatórias`,
              );
            }

            if (isNaN(quantidade) || quantidade <= 0) {
              throw new Error(`Quantidade inválida na linha: ${row.descricao}`);
            }

            if (isNaN(valor_executado) || valor_executado < 0) {
              throw new Error(`Valor inválido na linha: ${row.descricao}`);
            }

            if (!data_execucao || !/^\d{4}-\d{2}-\d{2}$/.test(data_execucao)) {
              throw new Error(`Data inválida na linha: ${row.descricao}`);
            }

            return {
              descricao: row.descricao.trim(),
              categoria: row.categoria
                ? String(row.categoria).trim()
                : undefined,
              unidade: row.unidade.trim(),
              quantidade,
              valor_executado,
              data_execucao,
            };
          });

        if (items.length === 0) {
          reject(new Error("Nenhum item válido encontrado na planilha"));
          return;
        }

        resolve(items);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Exporta itens existentes para Excel
 */
export function exportItemsToExcel(items: CreateItemInput[]): void {
  const worksheet = XLSX.utils.json_to_sheet(items);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Itens");

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 40 }, // descricao
    { wch: 20 }, // categoria
    { wch: 12 }, // unidade
    { wch: 15 }, // quantidade
    { wch: 15 }, // valor_executado
    { wch: 18 }, // data_execucao
  ];
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(
    workbook,
    `itens_acervo_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}
