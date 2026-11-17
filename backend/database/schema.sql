-- Cria o banco e a tabela de tarefas do FlowDesk.
-- Execute no MySQL Workbench (ou no terminal do MySQL 8). É seguro rodar mais de uma vez.

CREATE DATABASE IF NOT EXISTS flowdesk
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flowdesk;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  assignee    VARCHAR(100),
  priority    ENUM('Alta', 'Média', 'Baixa') NOT NULL,
  status      ENUM('A fazer', 'Em andamento', 'Em revisão', 'Concluído') NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
