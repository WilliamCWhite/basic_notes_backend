CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Untitled',
    body TEXT,
    time_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES
                users(user_id)
);