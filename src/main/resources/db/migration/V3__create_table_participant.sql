CREATE TABLE participants (
    id INT AUTO_INCREMENT NOT NULL primary key,
    player VARCHAR(255) NOT NULL,
    buy_in DECIMAL(10,2) NOT NULL,
    quantity_rebuy INT NOT NULL,
    value_rebuy DECIMAL(10,2) NOT NULL,

    total_rebuy DECIMAL(10,2)
        GENERATED ALWAYS AS (quantity_rebuy * value_rebuy) STORED,

    add_on DECIMAL(10,2) NOT NULL,

    total_player DECIMAL(10,2)
        GENERATED ALWAYS AS (buy_in + total_rebuy + add_on) STORED,

    payment VARCHAR(255) NOT NULL,
    position INT NOT NULL
);