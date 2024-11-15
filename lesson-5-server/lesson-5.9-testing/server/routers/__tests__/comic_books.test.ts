import app from "../../app";
import request from "supertest";

describe("/comic_books", () => {
  describe("DELETE /comic_books/1", () => {
    it("should respond with a 204", async () => {
      await request(app)
        .delete("/comic_books/1")
        .set("Accept", "application/json")
        .expect(204);
    });
  });

  describe("GET /comic_books", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .get("/comic_books")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("GET /comic_books/1", () => {
    it("should respond with a 404", async () => {
      await request(app)
        .get("/comic_books/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("GET /comic_books/2", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .get("/comic_books/2")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /comic_books", () => {
    it("should respond with a 201", async () => {
      await request(app)
        .post("/comic_books")
        .send({
          title: "Avengers Comic Book Title",
          issue_number: 1,
          publisher_id: 2,
          published_date: new Date("2018-05-02"),
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });
  });

  describe("PUT /comic_books/2", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .put("/comic_books/2")
        .send({
          title: "Dark Knight Gotham Batman Detective",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
