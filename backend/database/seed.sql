-- Tarefas iniciais para demonstração.
-- Execute DEPOIS do schema.sql, somente uma vez. O servidor NÃO executa este arquivo sozinho.
-- Se executar de novo, as tarefas serão duplicadas (os IDs são gerados automaticamente).

USE flowdesk;

INSERT INTO tasks (title, description, assignee, priority, status) VALUES
  ('Criar protótipo', 'Criar o protótipo inicial do projeto', 'Marina', 'Alta', 'A fazer'),
  ('Revisar interface', 'Revisar a interface do quadro de tarefas', 'Ana', 'Baixa', 'A fazer'),
  ('Criar tela de login', 'Criar o formulário de login da aplicação', 'Lucas', 'Média', 'A fazer'),
  ('Implementar interface', 'Implementar os componentes do quadro Kanban', 'Ana', 'Média', 'Em andamento'),
  ('Documentar a API', 'Descrever os endpoints REST no README', 'Marina', 'Alta', 'Em andamento'),
  ('Revisar validações', 'Conferir as mensagens de erro dos formulários', 'Pedro', 'Alta', 'Em revisão'),
  ('Ajustar responsividade', 'Adaptar o quadro para telas pequenas', 'Lucas', 'Baixa', 'Em revisão'),
  ('Definir identidade visual', 'Escolher as cores e a tipografia do projeto', 'Pedro', 'Baixa', 'Concluído'),
  ('Configurar o repositório', 'Criar o repositório e o projeto base com Vite', 'Marina', 'Média', 'Concluído');
