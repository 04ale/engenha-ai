import { DashboardLayout } from "@/components/layout/DashboardLayout"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HelpCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Perguntas Frequentes
                </h2>
                <p className="text-muted-foreground">
                    Tire suas dúvidas sobre o CREA, RUP e Engenharia
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <CardTitle>FAQ – Engenheiros & CREA</CardTitle>
                        </div>
                        <CardDescription>
                            Informações essenciais para profissionais da área
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="category-geral" className="border rounded-lg px-4 border-border/50">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <span className="font-semibold text-lg text-primary flex items-center gap-2">Geral sobre CREA</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1" className="border-b-0">
                                            <AccordionTrigger>1. O que é o CREA?</AccordionTrigger>
                                            <AccordionContent>
                                                <p>O <strong>CREA</strong> é o <em>Conselho Regional de Engenharia e Agronomia</em>. É o órgão responsável por <strong>fiscalizar, regulamentar e orientar</strong> o exercício das atividades profissionais da engenharia e áreas correlatas no Brasil.</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="category-registro" className="border rounded-lg px-4 border-border/50">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <span className="font-semibold text-lg text-primary flex items-center gap-2">Registro Profissional</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>2. Por que engenheiros precisam se registrar no CREA?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-2">O registro no CREA é obrigatório para profissionais que:</p>
                                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                                    <li>Exercem atividades de engenharia, agronomia e correlatas</li>
                                                    <li>Assinam projetos, laudos e pareceres técnicos</li>
                                                    <li>Prestam serviços técnicos especializados</li>
                                                </ul>
                                                <p>Sem o registro, o profissional <strong>não pode atuar legalmente</strong> nas atividades regulamentadas.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-3" className="border-b-0">
                                            <AccordionTrigger>3. Quais tipos de registro existem?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-2">Os principais registros para engenheiros são:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li><strong>Registro Profissional</strong> – habilita o exercício da profissão.</li>
                                                    <li><strong>Registro de Responsabilidade Técnica (ART)</strong> – vincula o profissional às atividades técnicas que ele executa ou supervisiona.</li>
                                                    <li><strong>Registro de Pessoa Jurídica</strong> – para empresas que atuam em engenharia.</li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="category-rup" className="border rounded-lg px-4 border-border/50">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <span className="font-semibold text-lg text-primary flex items-center gap-2">RUP – Plataforma integrada</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-4">
                                            <AccordionTrigger>4. O que é a RUP – Registro Único na Plataforma do CONFEA?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-3">
                                                    A <strong>RUP</strong> (<em>Registro Único da Plataforma do CONFEA/CREA</em>) é um cadastro <strong>unificado</strong> que simplifica a gestão de informações profissionais e empresariais associadas aos sistemas dos CREAs e ao Conselho Federal de Engenharia e Agronomia (<em>CONFEA</em>).
                                                </p>
                                                <p className="mb-3">📌 Isso significa que sua habilitação profissional e seus vínculos técnicos ficam integrados em uma única base de dados, facilitando:</p>
                                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                                    <li>Emissão de ART</li>
                                                    <li>Atualização cadastral</li>
                                                    <li>Visualização de informações de registro ativo</li>
                                                </ul>

                                                <div className="bg-muted/50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Fonte: CREA-SP (Registro Único – Plataforma CONFEA)</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => window.open("https://www.creasp.org.br/servico/registro-unico-plataforma-confea/", "_blank")}>
                                                        <span className="flex items-center gap-2">
                                                            Acessar Link Oficial <ExternalLink className="h-3 w-3" />
                                                        </span>
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-5" className="border-b-0">
                                            <AccordionTrigger>5. Como fazer o registro no CREA pela RUP?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-2">O processo geral é:</p>
                                                <ol className="list-decimal pl-5 mb-3 space-y-1">
                                                    <li>Acessar a Plataforma RUP do CREA/CONFEA</li>
                                                    <li>Preencher seus dados pessoais e profissionais</li>
                                                    <li>Anexar documentos (ex.: diploma, currículo Lattes, RG/CPF)</li>
                                                    <li>Pagar a anuidade e eventuais taxas de ART</li>
                                                    <li>Aguardar a análise e deferimento do registro</li>
                                                </ol>
                                                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-md text-sm border border-blue-200 dark:border-blue-900">
                                                    Muitas seções nos CREAs regionais já permitem envio <strong>online</strong> de documentos e acompanhamento do processo em tempo real.
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="category-art" className="border rounded-lg px-4 border-border/50">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <span className="font-semibold text-lg text-primary flex items-center gap-2">ART e Responsabilidades Técnicas</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-6" className="border-b-0">
                                            <AccordionTrigger>6. O que é a ART e por que ela é importante?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-2">A <strong>ART (Anotação de Responsabilidade Técnica)</strong>:</p>
                                                <ul className="list-disc pl-5 mb-3 space-y-1">
                                                    <li>É um documento que <strong>responsabiliza tecnicamente</strong> o profissional por uma atividade, obra ou serviço.</li>
                                                    <li>Deve ser emitida sempre que o engenheiro assume responsabilidade técnica por um trabalho.</li>
                                                    <li>É usada legalmente para acompanhar atividades de engenharia no Brasil.</li>
                                                </ul>
                                                <p>Sem ART, trabalhos executados podem <strong>não ter validade legal</strong> e o profissional pode responder por infração ao código de ética.</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="category-pagamentos" className="border rounded-lg px-4 border-border/50">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <span className="font-semibold text-lg text-primary flex items-center gap-2">Pagamentos e Anuidades</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-7" className="border-b-0">
                                            <AccordionTrigger>7. Preciso pagar anuidade?</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="mb-2">Sim.</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Todos os profissionais registrados pagam <strong>anuidade ao CREA</strong>.</li>
                                                    <li>A anuidade é geralmente anual, proporcional se o registro ocorrer no meio do ano.</li>
                                                    <li>Empresas também pagam taxas específicas.</li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
