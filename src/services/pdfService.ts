import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Acervo } from "@/types/acervo";
import type { Obra } from "@/types/obra";

export function exportAcervoToPDF(acervo: Acervo, obra?: Obra | null): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header ---
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("Relatório de Acervo Técnico", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`,
    pageWidth - 15,
    10,
    { align: "right" },
  );
  doc.text("Engenha AI", 15, 10);

  let currentY = 35;

  // --- Dados do Acervo ---
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Dados do Acervo", 14, currentY);
  currentY += 8;

  // Tabela de Detalhes do Acervo
  autoTable(doc, {
    startY: currentY,
    head: [],
    body: [
      ["Descrição", acervo.descricao_obra],
      [
        "Localização",
        `${acervo.cidade} - ${acervo.estado}` +
        (acervo.endereco_obra ? `, ${acervo.endereco_obra}` : ""),
      ],
      [
        "Período",
        `${format(new Date(acervo.data_inicio), "dd/MM/yyyy")} a ${acervo.data_conclusao ? format(new Date(acervo.data_conclusao), "dd/MM/yyyy") : "Em andamento"}`,
      ],
      ["Contratante", acervo.contratante_nome || "-"],
      ["CNPJ Contratante", acervo.contratante_cnpj || "-"],
      ["ART", acervo.numero_art || "-"],
      [
        "Valor Total",
        acervo.valor_total
          ? `R$ ${acervo.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          : "-",
      ],
      ["Observações", acervo.observacoes || "-"],
    ],
    theme: "plain",
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 40 },
    },
    styles: { fontSize: 10, cellPadding: 2 },
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // --- Dados da Obra (Se houver) ---
  if (obra) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.text("Dados da Obra Vinculada", 14, currentY);
    currentY += 8;

    autoTable(doc, {
      startY: currentY,
      head: [],
      body: [
        ["Contratante", obra.contratante_nome || "-"],
        ["CNPJ/CPF", obra.contratante_cnpj || "-"],
        ["Localização", `${obra.cidade} - ${obra.estado}`],
        ["Finalidade", obra.finalidade || "-"],
        [
          "Valor Total",
          obra.valor_total
            ? `R$ ${obra.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : "-",
        ],
      ],
      theme: "plain",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40 },
      },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    currentY = doc.lastAutoTable.finalY + 15;
  }

  // --- Itens do Acervo ---
  if (acervo.itens && acervo.itens.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.text("Itens do Acervo", 14, currentY);
    currentY += 5;

    // Preparar dados da tabela
    const tableBody = acervo.itens.map((item) => [
      item.categoria || "-",
      item.fonte || "-",
      item.codigo || "-",
      item.descricao,
      item.unidade,
      item.quantidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      `R$ ${item.valor_executado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      `R$ ${(item.quantidade * item.valor_executado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      format(new Date(item.data_execucao), "dd/MM/yyyy"),
    ]);

    const totalValor = acervo.itens.reduce(
      (sum, item) => sum + item.quantidade * item.valor_executado,
      0,
    );

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Categoria",
          "Fonte",
          "Cód.",
          "Descrição",
          "Unid.",
          "Qtd.",
          "Unit.",
          "Total",
          "Data",
        ],
      ],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [50, 50, 50], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 }, // Categoria
        1: { cellWidth: 15 }, // Fonte
        2: { cellWidth: 15 }, // Codigo
        3: { cellWidth: "auto" }, // Descricao
        4: { cellWidth: 10 }, // Unid
        5: { cellWidth: 15, halign: "right" }, // Qtd
        6: { cellWidth: 20, halign: "right" }, // Unit
        7: { cellWidth: 20, halign: "right" }, // Total
        8: { cellWidth: 18, halign: "center" }, // Data
      },
      foot: [
        [
          {
            content: "Total Geral:",
            colSpan: 7,
            styles: { halign: "right", fontStyle: "bold" },
          },
          {
            content: `R$ ${totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            styles: { halign: "right", fontStyle: "bold" },
          },
          "",
        ],
      ],
      showFoot: "lastPage",
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Nenhum item cadastrado.", 14, currentY + 10);
  }

  // --- Paginação no rodapé ---
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 15,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" },
    );
  }

  // Save PDF
  doc.save(`Acervo_${acervo.descricao_obra.replace(/\s+/g, "_")}.pdf`);
}
