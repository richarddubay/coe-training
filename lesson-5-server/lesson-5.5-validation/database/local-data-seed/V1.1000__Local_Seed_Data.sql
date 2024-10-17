INSERT INTO
  public.publishers (name, created_at)
VALUES
  ('DC', CURRENT_TIMESTAMP),
  ('Marvel', CURRENT_TIMESTAMP);

INSERT INTO
  public.comic_books (title, issue_number, publisher_id, published_date, created_at)
VALUES
  ('Avengers', 1, 2, '2018-05-02', CURRENT_TIMESTAMP),
  ('Batman', 1, 1, '2016-06-15', CURRENT_TIMESTAMP),
  ('DC vs. Vampires', 1, 1, '2021-10-26', CURRENT_TIMESTAMP),
  ('Fall of the House of X', 1, 2, '2024-01-03', CURRENT_TIMESTAMP),
  ('Wonder Woman', 1, 1, '2023-09-19', CURRENT_TIMESTAMP);
