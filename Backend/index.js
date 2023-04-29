import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "Minal",
  password: "Minal@7284559",
  database: "test",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello this is the backend");
});

app.post("/login", (req, res) => {
  const q = "SELECT * FROM AdminLogin WHERE username=? AND password=?";

  db.query(q, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json("Login sucessful");
    } else {
      return res.json("Login failed");
    }
  });
});

//sendMail
app.get("/getemail/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const q =
    "SELECT c.emailId FROM Client c INNER JOIN Orders o ON o.idClient = c.idClient WHERE o.orderId = ?";
  db.query(q, [orderId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0].emailId);
  });
});

app.get("/books", (req, res) => {
  // db.connect(function (err) {
  //   if (err) {
  //     console.error("error connecting: " + err.errno);
  //     return;
  //   }

  //   console.log("connected as id " + db.threadId);
  // });
  const q = "SELECT * FROM Books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/client", (req, res) => {
  const q = "SELECT * FROM Client";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/client/:idClient", (req, res) => {
  const clientId = req.params.idClient;
  const q = "SELECT * FROM CLIENT WHERE idClient =?";

  db.query(q, [clientId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client is there");
  });
});

app.get("/client/:idClient", (req, res) => {
  const clientId = req.params.idClient;
  const q = "SELECT * FROM CLIENT WHERE idClient =?";

  db.query(q, [clientId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client is there");
  });
});

app.get("/book/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM BOOKS WHERE id =?";

  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json("book is there");
  });
});

app.get("/order", (req, res) => {
  const q = "SELECT * FROM Orders";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO Books(`title`,`desc`,`price`,`cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been created sucessfully");
  });
});

app.post("/client", (req, res) => {
  const q =
    "INSERT INTO Client(`name`,`emailId`,`address`,`gender`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.emailId,
    req.body.address,
    req.body.gender,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client has been created sucessfully");
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id =?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted sucessfully");
  });
});

app.delete("/client/:idClient", (req, res) => {
  const clientId = req.params.idClient;
  const q = "DELETE FROM Client WHERE idClient =?";

  db.query(q, [clientId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client has been deleted sucessfully");
  });
});

app.delete("/order/:orderID", (req, res) => {
  const orderID = req.params.orderID;
  const q = "DELETE FROM Orders WHERE orderID =?";

  db.query(q, [orderID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client has been deleted sucessfully");
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title` =? ,`desc`=?,`price`=?,`cover`=?  WHERE id =?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been updated sucessfully");
  });
});

app.put("/client/:idClient", (req, res) => {
  const clientId = req.params.idClient;
  const q =
    "UPDATE Client SET `name` =? ,`emailId`=?,`address`=?,`gender`=?  WHERE idClient =?";

  const values = [
    req.body.name,
    req.body.emailId,
    req.body.address,
    req.body.gender,
  ];

  db.query(q, [...values, clientId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Client has been updated sucessfully");
  });
});
app.post("/order", async (req, res) => {
  const { idClient, id, issueDate } = req.body;

  // Check if the client record exists
  await db.query(
    "SELECT idClient FROM Client WHERE idClient = ?",
    [idClient],
    (err, result) => {
      if (err || !result) {
        console.log("no client");
        return res.status(400).json({ error: "Client does not exist" });
      }
    }
  );

  // Check if the book record exists
  await db.query("SELECT id FROM Books WHERE id = ?", [id], (err, result) => {
    if (err || !result) {
      return res.status(400).json({ error: "Book does not exist" });
    }
  });

  // Add the order record
  const q = "INSERT INTO Orders(`idClient`,`id`,`issueDate`) VALUES (?)";
  const values = [idClient, id, issueDate];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Order has been created successfully");
  });
});

app.listen(8800, () => {
  console.log("Connected to backend!");
});
