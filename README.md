# Backup em Dia

**Backup e recuperação de dados em pequenas empresas**
*Proteja hoje os dados do seu negócio para não perder tudo amanhã!*

Site informativo e interativo que ensina pequenos empresários a proteger as informações digitais do negócio: o que é backup, quais dados copiar, onde guardar as cópias, como aplicar a regra 3-2-1, como montar uma rotina de backup e como testar a restauração dos arquivos.

---

## Sobre o projeto

Este projeto foi desenvolvido como atividade da **disciplina de extensão da faculdade**. Na extensão universitária, o conhecimento produzido no curso é levado para fora da sala de aula, em benefício da comunidade.

A proposta é ajudar pequenos negócios da comunidade a entender por que o backup é importante e como fazê-lo, em linguagem simples, sem exigir conhecimento técnico em TI.

### Objetivos

- Conscientizar sobre a importância da segurança das informações digitais.
- Explicar como avaliar onde e como os dados da empresa estão armazenados.
- Ensinar a criar uma rotina eficiente de backups e de testes de restauração.

### Público-alvo

Pequenos empresários, comerciantes, microempreendedores individuais (MEIs) e pessoas responsáveis pela administração de pequenos negócios.

---

## Conteúdo do site

| Seção | O que apresenta |
|---|---|
| Início | Pergunta "Seus dados estão realmente protegidos?" e ilustração de computador, nuvem e HD externo |
| O que é backup? | Conceito, importância, como ajuda na recuperação e exemplos do dia a dia |
| Quais dados proteger? | Clientes, financeiro, vendas, estoque, documentos e sistemas |
| Onde armazenar? | Comparação entre nuvem, HD/SSD externo e servidor/NAS, com vantagens e limitações |
| Regra 3-2-1 | Ilustração interativa: 3 cópias, 2 tipos de armazenamento, 1 cópia fora da empresa |
| Rotina de backup | Linha do tempo interativa: diária, semanal, mensal e a cada 3 meses |
| Teste de restauração | Demonstração em 5 etapas da recuperação de um arquivo |
| Riscos | Ransomware, falhas de disco, exclusão acidental, roubo, incêndio e interrupção das atividades |
| Checklist | Lista para marcar as ações já realizadas, com barra de progresso |
| Conclusão e referências | Mensagem final e as fontes consultadas |

## Funcionalidades

- Menu de navegação fixo no topo, com menu recolhível no celular
- Rolagem suave entre as seções e destaque da seção atual no menu
- Animações leves ao rolar a página (desativadas para quem prefere menos movimento)
- Cards com efeito ao passar o mouse
- Regra 3-2-1, linha do tempo e demonstração de restauração interativas
- Checklist com barra de progresso, salvo apenas no navegador do visitante (`localStorage`)
- Botão para voltar ao topo
- Layout responsivo para computador, tablet e celular
- Cuidados de acessibilidade: contraste adequado, navegação por teclado, link "pular para o conteúdo" e textos alternativos

## Tecnologias

- **HTML5**: estrutura e conteúdo
- **CSS3**: estilo, layout responsivo e animações
- **JavaScript** (puro, sem bibliotecas): interatividade

O site é estático. Não usa backend nem banco de dados e não coleta nenhuma informação do visitante.

## Estrutura de pastas

```
backup-em-dia/
├── index.html      # estrutura e conteúdo do site
├── css/
│   └── style.css   # estilos e responsividade
├── js/
│   └── script.js   # menu, regra 3-2-1, rotina, demonstração e checklist
└── README.md
```

## Como abrir

Baixe ou clone o repositório e abra o arquivo `index.html` no navegador. Não é preciso instalar nada.

```bash
git clone https://github.com/ocoronato/backup-em-dia.git
```

## Referências

O conteúdo foi baseado em orientações de órgãos oficiais de segurança digital. O site não inventa estatísticas nem dados técnicos.

1. CERT.br / NIC.br. **Fascículo Backup**. Cartilha de Segurança para Internet, 2023. <https://cartilha.cert.br/fasciculos/#backup>
2. CERT.br / NIC.br. **Ransomware**. Cartilha de Segurança para Internet. <https://cartilha.cert.br/ransomware/>
3. CISA (Agência de Segurança Cibernética e de Infraestrutura dos EUA). **Back Up Business Data**. <https://www.cisa.gov/back-business-data>
4. CISA. **#StopRansomware Guide**. <https://www.cisa.gov/stopransomware/ransomware-guide>
5. NIST / NCCoE. **Protecting Your Data from Ransomware and Other Data Loss Events**. <https://www.nccoe.nist.gov/sites/default/files/library/supplemental-files/msp-protecting-data-one-pager.pdf>
6. NCSC (Centro Nacional de Cibersegurança do Reino Unido). **Small organisations guide: Backing up your data**. <https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/1-backing-up-your-data>
7. FTC (Comissão Federal de Comércio dos EUA). **Cybersecurity Basics**. <https://www.ftc.gov/system/files/attachments/cybersecurity-basics/cybersecurity_sb_cyber-basics.pdf>
8. Microsoft Suporte. **Restaurar arquivos do OneDrive**. <https://support.microsoft.com/pt-BR/onedrive/restore-your-onedrive-files>

## Aviso

Este é um material educativo, com orientações gerais. Para sistemas complexos ou dados sensíveis, procure um profissional de TI de confiança.

## Autor

Felipe Coronato ([@ocoronato](https://github.com/ocoronato)). Projeto acadêmico da disciplina de extensão.
