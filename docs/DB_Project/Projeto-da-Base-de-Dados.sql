-- Projeto da Base de Dados (PostgreSQL)

-- Tipo enumerado para a classe do ativo
CREATE TYPE asset_type AS ENUM ('STOCK', 'FII', 'FIXED_INCOME');

-- Tabela de usuários
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

-- Tabela de carteiras
CREATE TABLE portfolios (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_portfolios_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_portfolios_user_id ON portfolios (user_id);

-- Tabela de ativos
CREATE TABLE assets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker       VARCHAR(10) NOT NULL,
    type         asset_type NOT NULL,
    quantity     DECIMAL(18, 6) NOT NULL,
    avg_price    DECIMAL(18, 4) NOT NULL,
    portfolio_id UUID NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_assets_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
);

CREATE INDEX idx_assets_portfolio_id ON assets (portfolio_id);
