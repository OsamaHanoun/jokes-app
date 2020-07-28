DROP TABLE IF EXISTS jokes;
 CREATE TABLE jokes (
    id SERIAL PRIMARY KEY ,
    type varchar(255),
    setup text,
    punchline text
);

INSERT INTO jokes (type, setup, punchline) VALUES ('programming','Why do Java programmers wear glasses?', 'Because they don''t C#'); 