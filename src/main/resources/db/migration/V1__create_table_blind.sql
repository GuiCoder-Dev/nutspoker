CREATE TABLE blinds(
    id int auto_increment primary key,
    level int not null,
    small_blind int not null,
    big_blind int not null,
    ante int not null DEFAULT 0,
    duration int not null
);