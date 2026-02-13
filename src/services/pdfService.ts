import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Acervo } from "@/types/acervo";
import type { Obra } from "@/types/obra";

export interface PortfolioWork extends Obra {
  acervos: Acervo[];
  primaryAcervo?: Acervo; // The best candidate for details
  relevanceScore?: number;
}

export interface PortfolioConfig {
  periodoInicio?: Date | null;
  periodoFim?: Date | null;
  areas?: string[];
  comprovacao?: boolean;
  qtdObrasPorArea?: number;
  mostrarValores?: boolean;
  bio?: string;
  especialidades?: string;
  tipoListagemGeral?: "todas" | "selecionadas";
}

export interface PortfolioData {
  engenheiro: {
    nome: string;
    crea: string;
    email: string;
    telefone: string;
    cidade?: string;
    estado?: string;
    logoUrl?: string; // Opcional, para futuro
  };
  obras: PortfolioWork[];
  config: PortfolioConfig;
}

// --- Helper Functions ---

function calculateWorkRelevance(work: PortfolioWork): number {
  let score = 0;

  // Check attached acervos for validation
  const hasCat = work.acervos.some((a) => !!a.arquivo_cat_url);
  const hasArt = work.acervos.some((a) => !!a.numero_art);
  const hasAtestado = work.acervos.some(
    (a) =>
      a.acervo_tipo === "Atestado" ||
      a.arquivo_cat_nome?.toLowerCase().includes("atestado"),
  );

  if (hasCat) score += 3;
  if (hasArt) score += 2;
  if (hasAtestado) score += 1;

  // Description length
  if (work.descricao_obra && work.descricao_obra.length > 50) score += 1;

  // Value
  if (work.valor_total && work.valor_total > 0) score += 1;

  // Recency
  if (work.data_conclusao) {
    const months = differenceInMonths(
      new Date(),
      new Date(work.data_conclusao),
    );
    if (months <= 24) score += 1;
  } else {
    // Ongoing
    score += 1;
  }

  return score;
}

// --- Main PDF Generation Function (Portfolio) ---

export function generatePortfolioPDF(data: PortfolioData): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // --- 1. CAPA ---
  doc.setFillColor(248, 249, 250); // Light gray background
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Logo (se existir - placeholder logic)
  if (data.engenheiro.logoUrl) {
    // Tenta adicionar logo se for uma URL válida ou base64
    try {
      // Doc: addImage(imageData, format, x, y, w, h)
      // Adjust positioning as needed
      // doc.addImage(data.engenheiro.logoUrl, "PNG", pageWidth / 2 - 15, 40, 30, 30);
    } catch (e) {
      console.warn("Could not add logo", e);
    }
  }

  // Título
  doc.setFontSize(28);
  doc.setTextColor(33, 37, 41);
  doc.text("PORTFÓLIO TÉCNICO", pageWidth / 2, pageHeight / 3, {
    align: "center",
  });

  // Nome do Engenheiro
  doc.setFontSize(20);
  doc.setTextColor(52, 58, 64);
  doc.text(
    data.engenheiro.nome.toUpperCase(),
    pageWidth / 2,
    pageHeight / 3 + 15,
    { align: "center" },
  );

  // CREA
  doc.setFontSize(14);
  doc.setTextColor(108, 117, 125);
  doc.text(
    `CREA: ${data.engenheiro.crea}`,
    pageWidth / 2,
    pageHeight / 3 + 25,
    { align: "center" },
  );

  // Rodapé da Capa
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const contactText = [
    data.engenheiro.email,
    data.engenheiro.telefone,
    data.engenheiro.cidade && data.engenheiro.estado
      ? `${data.engenheiro.cidade} - ${data.engenheiro.estado}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  doc.text(contactText, pageWidth / 2, pageHeight - 40, { align: "center" });
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy")}`,
    pageWidth / 2,
    pageHeight - 30,
    { align: "center" },
  );

  // --- 2. APRESENTAÇÃO & RESUMO EXECUTIVO ---
  doc.addPage();
  let currentY = margin;

  // Bio / Apresentação
  if (data.config.bio || data.config.especialidades) {
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102); // Professional Blue
    doc.text("Apresentação Profissional", margin, currentY);
    currentY += 10;

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    if (data.config.bio) {
      const splitBio = doc.splitTextToSize(
        data.config.bio,
        pageWidth - margin * 2,
      );
      doc.text(splitBio, margin, currentY);
      currentY += splitBio.length * 5 + 5;
    }

    if (data.config.especialidades) {
      doc.setFont("helvetica", "bold");
      doc.text("Especialidades:", margin, currentY);
      doc.setFont("helvetica", "normal");
      const splitSpec = doc.splitTextToSize(
        data.config.especialidades,
        pageWidth - margin * 2 - 30,
      );
      doc.text(splitSpec, margin + 30, currentY);
      currentY += splitSpec.length * 5 + 15;
    }
  }

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 15;

  // Resumo Executivo (Stats)
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.setFont("helvetica", "normal"); // Reset font
  doc.text("Resumo Executivo", margin, currentY);
  currentY += 10;

  // Calculate Scores & Apply Logic
  let processedWorks = data.obras.map((w) => ({
    ...w,
    relevanceScore: calculateWorkRelevance(w),
  }));

  // Filtering Logic
  if (data.config.periodoInicio) {
    processedWorks = processedWorks.filter(
      (w) => new Date(w.data_inicio) >= data.config.periodoInicio!,
    );
  }
  if (data.config.periodoFim) {
    processedWorks = processedWorks.filter((w) => {
      const dt = w.data_conclusao ? new Date(w.data_conclusao) : new Date();
      return dt <= data.config.periodoFim!;
    });
  }
  if (data.config.comprovacao) {
    processedWorks = processedWorks.filter((w) =>
      w.acervos.some((a) => !!a.arquivo_cat_url || !!a.numero_art),
    );
  }

  // Categories
  const categories = new Set<string>();
  if (data.config.areas && data.config.areas.length > 0) {
    data.config.areas.forEach((a) => categories.add(a));
  } else {
    // Auto-discover from Works
    processedWorks.forEach((w) => {
      w.categorias?.forEach((c) => categories.add(c));
      // Fallback: check acervo items if obra has no categories
      if (!w.categorias || w.categorias.length === 0) {
        w.acervos.forEach((a) => {
          a.itens?.forEach((i) => {
            if (i.categoria) categories.add(i.categoria);
          });
        });
      }
    });
    if (categories.size === 0) categories.add("Geral");
  }
  const sortedCategories = Array.from(categories).sort();

  // Summary Table
  const summaryData = sortedCategories.map((cat) => {
    // Works in this category
    const catWorks = processedWorks.filter((w) => {
      if (cat === "Geral") return true;
      const hasCatInObra = w.categorias?.includes(cat);
      const hasCatInItens = w.acervos.some((a) =>
        a.itens?.some((i) => i.categoria === cat),
      );
      return hasCatInObra || hasCatInItens;
    });

    const count = catWorks.length;
    let value = 0;
    if (data.config.mostrarValores) {
      value = catWorks.reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
    }

    return [
      cat,
      count.toString(),
      data.config.mostrarValores
        ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "-",
    ];
  });

  // Add "Total" row
  const uniqueWorksTotalValue = processedWorks.reduce(
    (acc, curr) => acc + (curr.valor_total || 0),
    0,
  );

  summaryData.push([
    "TOTAL GERAL",
    processedWorks.length.toString(), // Unique count
    data.config.mostrarValores
      ? `R$ ${uniqueWorksTotalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "-",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Área de Atuação", "Qtd. Obras", "Valor Total (Estimado)"]],
    body: summaryData,
    theme: "striped",
    headStyles: { fillColor: [0, 51, 102] },
    columnStyles: {
      0: { fontStyle: "bold" },
      1: { halign: "center" },
      2: { halign: "right" },
    },
  });

  currentY = doc.lastAutoTable.finalY + 20;

  // --- 3. EXPERIÊNCIA POR ÁREA (SPLIT LOGIC - TOP/BOTTOM) ---

  // Helper function to render a block of works
  const renderCategoryBlock = (
    catTitle: string,
    works: PortfolioWork[],
    startY: number,
    pageNumber: number,
  ) => {
    // Ensure page
    if (doc.internal.getCurrentPageInfo().pageNumber !== pageNumber) {
      doc.setPage(pageNumber);
    }

    let y = startY;

    // Area Title
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text(catTitle.toUpperCase(), margin, y);
    doc.setDrawColor(0, 51, 102);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 15;

    works.forEach((work) => {
      // Work Title
      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text(work.descricao_obra, margin, y);
      y += 6;

      // Details line
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);

      const periodo = `${format(new Date(work.data_inicio), "MMM/yyyy", { locale: ptBR })} a ${
        work.data_conclusao
          ? format(new Date(work.data_conclusao), "MMM/yyyy", {
              locale: ptBR,
            })
          : "Em andamento"
      }`;
      const local = `${work.cidade}/${work.estado}`;
      const cliente = work.contratante_nome || "Cliente N/A";

      doc.text(`${cliente} | ${local} | ${periodo}`, margin, y);
      y += 5;

      // Description
      const descText =
        work.observacoes || work.primaryAcervo?.observacoes || "";
      if (descText) {
        const desc = doc.splitTextToSize(
          descText.slice(0, 300) + (descText.length > 300 ? "..." : ""),
          pageWidth - margin * 2,
        );
        doc.setTextColor(100, 100, 100);
        doc.text(desc, margin, y);
        y += desc.length * 4 + 2;
      }

      // Evidence Badges & Value
      const badges = [];
      const validationAcervos = work.acervos;
      if (validationAcervos.some((a) => !!a.arquivo_cat_url))
        badges.push("[CAT Anexada]");
      const art = validationAcervos.find((a) => !!a.numero_art)?.numero_art;
      if (art) badges.push(`[ART: ${art}]`);

      if (data.config.mostrarValores && work.valor_total) {
        badges.push(
          `Valor: R$ ${work.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        );
      }

      if (badges.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(0, 100, 0); // Dark Green for validity/proof
        doc.text(badges.join("   "), margin, y + 2);
        y += 8;
      } else {
        y += 2;
      }

      // Separator
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    });
  };

  // Categorize
  const lightCats: { cat: string; works: PortfolioWork[] }[] = [];
  const heavyCats: { cat: string; works: PortfolioWork[] }[] = [];

  sortedCategories.forEach((cat) => {
    let catWorks = processedWorks.filter((w) => {
      if (cat === "Geral") return true;
      const hasCatInObra = w.categorias?.includes(cat);
      const hasCatInItens = w.acervos.some((a) =>
        a.itens?.some((i) => i.categoria === cat),
      );
      return hasCatInObra || hasCatInItens;
    });

    // Sort by Relevancy Score DESC, then Date DESC
    catWorks.sort((a, b) => {
      if ((b.relevanceScore || 0) !== (a.relevanceScore || 0))
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      const dateA = new Date(a.data_conclusao || a.data_inicio).getTime();
      const dateB = new Date(b.data_conclusao || b.data_inicio).getTime();
      return dateB - dateA;
    });

    // Limit Works per Category
    if (data.config.qtdObrasPorArea) {
      catWorks = catWorks.slice(0, data.config.qtdObrasPorArea);
    }

    if (catWorks.length === 0) return;

    if (catWorks.length <= 3) {
      lightCats.push({ cat, works: catWorks });
    } else {
      heavyCats.push({ cat, works: catWorks });
    }
  });

  // Render Heavy (One per Page, Full Flow)
  heavyCats.forEach(({ cat, works }) => {
    doc.addPage();
    let y = margin;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text(cat.toUpperCase(), margin, y);
    doc.setDrawColor(0, 51, 102);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 15;

    works.forEach((work) => {
      // Page break check
      if (y > pageHeight - 50) {
        doc.addPage();
        y = margin;
      }

      // Standard render logic (duplicated from block for simplicity in flow)
      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text(work.descricao_obra, margin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const periodo = `${format(new Date(work.data_inicio), "MMM/yyyy", { locale: ptBR })} a ${
        work.data_conclusao
          ? format(new Date(work.data_conclusao), "MMM/yyyy", { locale: ptBR })
          : "Em andamento"
      }`;
      const local = `${work.cidade}/${work.estado}`;
      const cliente = work.contratante_nome || "Cliente N/A";
      doc.text(`${cliente} | ${local} | ${periodo}`, margin, y);
      y += 5;

      const descText =
        work.observacoes || work.primaryAcervo?.observacoes || "";
      if (descText) {
        const desc = doc.splitTextToSize(
          descText.slice(0, 300) + (descText.length > 300 ? "..." : ""),
          pageWidth - margin * 2,
        );
        doc.setTextColor(100, 100, 100);
        doc.text(desc, margin, y);
        y += desc.length * 4 + 2;
      }

      // Evidence Badges & Value
      const badges = [];
      const validationAcervos = work.acervos;
      if (validationAcervos.some((a) => !!a.arquivo_cat_url))
        badges.push("[CAT Anexada]");
      const art = validationAcervos.find((a) => !!a.numero_art)?.numero_art;
      if (art) badges.push(`[ART: ${art}]`);
      if (data.config.mostrarValores && work.valor_total) {
        badges.push(
          `Valor: R$ ${work.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        );
      }
      if (badges.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(0, 100, 0);
        doc.text(badges.join("   "), margin, y + 2);
        y += 8;
      } else {
        y += 2;
      }

      doc.setDrawColor(240, 240, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    });
  });

  // Render Light (Paired Top/Bottom)
  for (let i = 0; i < lightCats.length; i += 2) {
    doc.addPage();
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;

    // Top Half
    const top = lightCats[i];
    renderCategoryBlock(top.cat, top.works, margin, pageNum);

    // Bottom Half
    if (i + 1 < lightCats.length) {
      const bottom = lightCats[i + 1];
      // Start slightly below middle + margin
      const midY = pageHeight / 2 + margin / 2;
      renderCategoryBlock(bottom.cat, bottom.works, midY, pageNum);
    }
  }

  // --- 4. LISTA COMPLETA ---
  doc.addPage();
  currentY = margin;
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text("Listagem Completa de Obras", margin, currentY);
  currentY += 10;

  // Filter for final list based on preference
  let finalWorksList = processedWorks;

  if (
    data.config.tipoListagemGeral === "selecionadas" &&
    data.config.areas &&
    data.config.areas.length > 0
  ) {
    finalWorksList = processedWorks.filter((w) => {
      const hasCatInObra = w.categorias?.some((c) =>
        data.config.areas?.includes(c),
      );
      const hasCatInItens = w.acervos.some((a) =>
        a.itens?.some(
          (i) => i.categoria && data.config.areas?.includes(i.categoria),
        ),
      );
      return hasCatInObra || hasCatInItens;
    });
  }

  const tableRows = finalWorksList.map((w) => [
    w.descricao_obra.slice(0, 40),
    `${w.cidade}/${w.estado}`,
    format(new Date(w.data_inicio), "MM/yyyy"),
    w.acervos.find((a) => !!a.numero_art)?.numero_art || "-",
    data.config.mostrarValores && w.valor_total
      ? `R$ ${w.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "-",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Obra", "Local", "Início", "ART", "Valor"]],
    body: tableRows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 100, 100] },
  });

  // --- FOOTER & PAGINATION ---
  const pageCountPortfolio = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCountPortfolio; i++) {
    doc.setPage(i);
    // if (i === 1) continue; // Skip cover if desired
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Eng. ${data.engenheiro.nome} - CREA: ${data.engenheiro.crea} | Página ${i} de ${pageCountPortfolio}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" },
    );
  }

  // Save
  doc.save(`Portfolio_${data.engenheiro.nome.replace(/\s+/g, "_")}.pdf`);
}

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
