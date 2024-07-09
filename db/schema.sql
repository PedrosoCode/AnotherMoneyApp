CREATE TABLE pingpong (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value TEXT NOT NULL
)

-- Criação da tabela tb_primeiro_acesso
CREATE TABLE IF NOT EXISTS tb_primeiro_acesso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  primeiro_acesso BOOLEAN NOT NULL
);

-- Inserção inicial na tabela tb_primeiro_acesso
INSERT INTO tb_primeiro_acesso (primeiro_acesso) VALUES (1);

-- Criação da tabela tb_usuario
CREATE TABLE IF NOT EXISTS tb_usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_cad_maquina (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_serie TEXT NOT NULL,
  modelo TEXT NOT NULL,
  cor TEXT,
  obs TEXT,
  cliente TEXT,
  contato TEXT,
  imagem BLOB
);