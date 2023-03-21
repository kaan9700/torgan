const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");
const { XMLBuilder } = require("fast-xml-parser");
const format = require("xml-formatter");
const request = require("request");
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "attr_",
};

let database = null; //Platzhalter für die Datenbank.
exports.setDB = function (db) {
  //Möglichkeit die Datenbank von Ausserhalb des Moduls zu erreichen (nur schreiben).
  database = db;
};

exports.getDB = function () {
  //Möglichkeit die Datenbank von Ausserhalb des Moduls zu erreichen (nur lesen).
  return database;
};

let dt = new Date();
let mm = dt.getMonth() + 1;
let dd = dt.getDate();
let yyyy = dt.getFullYear();
let datum = dd + "." + mm + "." + yyyy;

exports.index = function (req, res) {
  let sql_collection =
    "SELECT Name, Datum, Id FROM Sammlungen ORDER BY Name ASC";
  let sql_collection2 = "SELECT Name, Datum, Id FROM Sammlungen WHERE Name=?";
  let sql_question = "SELECT Titel, Beschreibung, Antwort, Id FROM Fragen ORDER BY Titel ASC";
  let sql_tags =
    "SELECT Tags.Tag, Fragen_Tags.QId FROM Tags, Fragen_Tags WHERE Fragen_Tags.TId = Tags.Id;";
  let sql_tagsC =
    "SELECT Tags.Tag, Sammlungen_Tags.CId FROM Tags, Sammlungen_Tags WHERE Sammlungen_Tags.TId = Tags.Id;";
  let sql_tagsC2 =
    "SELECT Tags.Tag, Sammlungen_Tags.CId FROM Tags, Sammlungen_Tags WHERE Sammlungen_Tags.TId = Tags.Id AND Sammlungen_Tags.CId =?;";
  let amount_collections, all_collections;
  let amount_questions, all_questions;
  let CId;
  if (req.session.showCollection == undefined) {
    req.session.showCollection = false;
  }
  if (req.session.collectionname == undefined) {
    req.session.collectionname = false;
  }
  if (req.session.message == undefined) {
    req.session.message = "";
  }

  let collectionname = req.session.collectionname;
  let showCollection = req.session.showCollection;
  let message = req.session.message;
  delete req.session.showCollection;
  delete req.session.collectionname;
  delete req.session.message;

  if (collectionname) {
    database.all(sql_collection2, collectionname, (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows) {
        amount_collections = rows.length;
        all_collections = rows;
        req.session.CId = rows[0].Id;
      }
      if (showCollection == -1) {
        amount_questions = 0;
        all_questions = [];
        tags = [];
        database.all(sql_tagsC2, req.session.CId, (err, tags2) => {
          if (err) throw err;
          delete req.session.CId;
          res.render("index", {
            amount_collections: amount_collections,
            all_collections: all_collections,
            amount_questions: amount_questions,
            all_questions: all_questions,
            tags: tags,
            tagsC: tags2,
            message: message,
            collectionDetails: true,
          });
        });
      }
      if (showCollection != -1 && showCollection != false) {
        all_questions = [];
        tags = [];
        let sql_single_questions =
          "SELECT Titel, Beschreibung, Antwort, Id FROM Fragen WHERE Id = ?";
        let sql_single_tags =
          "SELECT Tags.Tag, Fragen_Tags.QId FROM Tags, Fragen_Tags WHERE Fragen_Tags.TId = Tags.Id AND Fragen_Tags.QId =?";
        database.serialize(function () {
          for (let i = 0; i < showCollection.length; i++) {
            database.get(
              sql_single_questions,
              showCollection[i].QId,
              (err, row) => {
                if (err) throw err;
                if (all_questions.indexOf(row) === -1) {
                  all_questions.push(row);
                }
                database.all(sql_tags, (err, roww) => {
                  tags = roww;
                  if (i == showCollection.length - 1) {
                    database.all(sql_tagsC2, req.session.CId, (err, tags2) => {
                      if (err) throw err;
                      amount_questions = all_questions.length;
                      delete req.session.CId;
                      return res.render("index", {
                        amount_collections: amount_collections,
                        all_collections: all_collections,
                        amount_questions: amount_questions,
                        all_questions: all_questions,
                        tags: tags,
                        tagsC: tags2,
                        message: message,
                        collectionDetails: true,
                      });
                    });
                  }
                });
              }
            );
          }
        });
      }
    });
  } else {
    //Alle Sammlungen bekommen, um Sie in der View darzustellen
    database.all(sql_collection, (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows) {
        amount_collections = rows.length;
        all_collections = rows;
        database.all(sql_question, (err, rows) => {
          if (err) {
            throw err;
          }
          if (rows) {
            amount_questions = rows.length;
            all_questions = rows;

            database.all(sql_tags, (err, tags) => {
              if (err) throw err;

              database.all(sql_tagsC, (err, tags2) => {
                if (err) throw err;

                res.render("index", {
                  amount_collections: amount_collections,
                  all_collections: all_collections,
                  amount_questions: amount_questions,
                  all_questions: all_questions,
                  tags: tags,
                  tagsC: tags2,
                  message: message,
                  collectionDetails: false,
                });
              });
            });
          }
        });
      }
    });
  }
};

exports.newCollection = function (req, res) {
  let name = req.body.name;
  let sql = "SELECT * FROM Sammlungen WHERE Name=?";
  let sql_in = "INSERT INTO Sammlungen(Name, Datum) values (?,?)";

  //Zuerst wird geprüft, ob die Sammlung bereits besteht, um Dopplungen zu vermeiden
  database.get(sql, name, (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      req.session.message = "Die Sammlung existiert bereits";
      res.redirect("/");
    }
    if (!row) {
      //Falls die Sammlung nicht existiert, soll sie in die Datenbank integriert werden
      database.run(sql_in, name, datum, (err, row) => {
        if (err) {
          throw err;
        } else {
          return res.redirect("/");
        }
      });
    }
  });
};

exports.deleteCollection = function (req, res) {
  let name = req.body.name;
  let sql = "DELETE FROM Sammlungen WHERE Name=?";
  let sql_QId = "SELECT QId From Fragen_Sammlungen WHERE CId = ?";
  let sql_CId = "SELECT Id FROM Sammlungen WHERE Name=?";
  let sql_update = "UPDATE Fragen SET inCollection = 0 WHERE Id = ?";
  let sql_del_cross = "DELETE FROM Fragen_Sammlungen WHERE CId = ?";
  let CId;
  let QIds;
  database.get(sql_CId, name, (err, result1) => {
    if (err) {
      throw err;
    }
    CId = result1.Id;
    database.run(sql, name, (err, row) => {
      if (err) {
        throw err;
      }
    });
    database.all(sql_QId, CId, (err, rows) => {
      if (err) {
        throw err;
      }
      QIds = rows;
      for (let i = 0; i < QIds.length; i++) {
        database.run(sql_update, QIds[i].QId, (err, result2) => {
          if (err) {
            throw err;
          }
        });
      }
      database.run(sql_del_cross, CId, (err, res2) => {
        if (err) throw err;
        if (fs.existsSync("./downloads/" + name + ".xml")) {
          fs.unlinkSync("./downloads/" + name + ".xml");
        }
        res.redirect("/");
      });
    });
  });
};

exports.addToCollection = function (req, res) {
  let collection = req.body.collection;
  let questions = req.body.questions;
  questions = questions.split(",").map(Number);
  let CId;
  let sql_Cid = "SELECT Id FROM Sammlungen WHERE Name = ?";
  let sql_check =
    "SELECT COUNT(*) AS counter FROM Fragen_Sammlungen WHERE CId =? AND QId =?";
  let sql = "INSERT INTO Fragen_Sammlungen (CId, QId) VALUES (?,?)";
  let sql_change = "UPDATE Fragen SET inCollection = 1 WHERE Id = ?";
  let counter = questions.length;

  if (collection == "" || questions == "") {
    req.session.message = "Wählen Sie Frage und Sammlung aus";
    res.redirect("/");
    return;
  }
  for (let i = 0; i < counter; i++) {
    if (i == counter - 1) {
      database.get(sql_Cid, collection, (err, result2) => {
        // CID bekommen
        if (err) {
          throw err;
        }
        CId = result2.Id;
        for (let j = 0; j < counter; j++) {
          database.serialize(function () {
            database.get(sql_check, CId, questions[j], (err, row) => {
              if (err) throw err;
              if (row.counter == 0) {
                database.run(sql, CId, questions[j], (err, result3) => {
                  //Einsetzen in die Verknüpfungstabelle
                  if (err) {
                    throw err;
                  }
                });
                database.run(sql_change, questions[j], (err, result4) => {
                  //Setze "Collection auf Collectionname
                  if (err) {
                    throw err;
                  }
                });
              } else {
              }
            });
          });
        }
      });
    }
  }

  res.redirect("/");
};

exports.import = async function (req, res) {
  let file = req.files.file;
  let uploadpath = "./files/" + file.name;

  extractquestions(uploadpath, file.name, file).then((result) => {
    res.redirect("/");
  });

  //Sicherstellen, dass alle tags in der Datenbank aufgenommen werden bevor die seite neu geladen wird
};

exports.export = function (req, res) {
  let name = req.body.name;
  let sql_CId = "SELECT Id FROM Sammlungen WHERE Name=?";
  let sql_QId = "SELECT QId FROM Fragen_Sammlungen WHERE CId =?";
  let sql_question = "SELECT Frage FROM Fragen WHERE Id =?";
  let CId,
    QIds = [],
    questions = [];

  if (name == "") {
    req.session.message = "Es wurde keine Sammlung ausgewählt";
    res.redirect("/");
    return;
  }

  database.get(sql_CId, name, (err, result1) => {
    if (err) {
      throw err;
    }
    CId = result1.Id;
    database.all(sql_QId, CId, (err, result2) => {
      if (err) {
        throw err;
      }
      QIds = result2;
      if (QIds.length == 0) {
        res.redirect("/");
      }
      for (let i = 0; i < QIds.length; i++) {
        database.serialize(function () {
          database.get(sql_question, QIds[i].QId, (err, result3) => {
            if (err) {
              throw err;
            }
            questions.push(JSON.parse(result3.Frage));
            if (i == QIds.length - 1) {
              exportquestions(questions, name, res);
            }
          });
        });
      }
    });
  });
};

exports.collectiondetails = function (req, res) {
  let name = req.body.name;
  req.session.collectionname = name;
  let CId;
  let QIds = [];
  let titles = [];
  let sql_CId = "SELECT Id FROM Sammlungen WHERE Name = ?";
  let sql_QId = "SELECT QId FROM Fragen_Sammlungen WHERE CId = ?";

  database.get(sql_CId, name, (err, res1) => {
    if (err) {
      throw err;
    }
    CId = res1.Id;
    database.all(sql_QId, CId, (err, res2) => {
      if (err) {
        throw err;
      }
      QIds = res2;
      if (QIds.length == 0) {
        req.session.showCollection = -1;
      } else {
        req.session.showCollection = QIds;
      }

      res.redirect("/");
    });
  });
};

exports.allquestions = function (req, res) {
  delete req.session.showCollection;
  delete req.session.collectionname;
  res.redirect("/");
};


exports.addTagQ = function (req, res) {
  let QId = req.body.name;
  let tag = req.body.tag;
  tag = tag.toLowerCase();
  let sql_check_for_Tag = "SELECT Id FROM Tags WHERE Tag =?";
  let sql_Tag = "INSERT INTO Tags (Tag) VALUES (?)";
  let sql_check_tag_to_question = "SELECT TId FROM Fragen_Tags WHERE QId = ?";
  let sql_tag_to_question = "INSERT INTO Fragen_Tags (TId, QId) VALUES (?,?)";

  let TId;
  if (tag == "") {
    req.session.message = "Bitte geben Sie einen Tagnamen ein";
    res.redirect("/");
    return;
  }
  database.get(sql_check_for_Tag, tag, (err, res2) => {
    if (err) throw err;

    if (res2 == undefined) {
      database.run(sql_Tag, tag, (err, res3) => {
        if (err) throw err;

        database.get(sql_check_for_Tag, tag, (err, TId) => {
          if (err) throw err;

          if (TId) {
            TId = TId.Id;

            database.run(sql_tag_to_question, TId, QId, (err, res3) => {
              if (err) throw err;

              res.redirect("/");
            });
          }
        });
      });
    } else {
      TId = res2.Id;
      database.all(sql_check_tag_to_question, QId, (err, TId2) => {
        if (err) throw err;
        if (TId2) {
          let buf = false;
          for (let i = 0; i < TId2.length; i++) {
            if (TId == TId2[i].TId) {
              buf = true;
            }
          }
          if (buf) {
            req.session.message =
              "Dieser Tag wurde der Frage bereits hinzugefügt";
            res.redirect("/");
          } else {
            database.run(sql_tag_to_question, TId, QId, (err, res3) => {
              if (err) throw err;
              res.redirect("/");
            });
          }
        }
      });
    }
  });
};

exports.deleteTagQ = function (req, res) {
  let QId = req.body.name;
  let tag = req.body.tag;
  let sql_QId =
    "SELECT Tags.Id AS TId FROM Fragen, Tags WHERE Fragen.Id =? AND Tags.Tag =?";
  let sql_delete = "DELETE FROM Fragen_Tags WHERE QId = ? AND TId = ?";
  let TId;
  if (tag == "") {
    req.session.message = "Es wurde kein Tag ausgewählt";
    res.redirect("/");
    return;
  }
  database.get(sql_QId, QId, tag, (err, res1) => {
    if (err) throw err;
    if (res1) {
      TId = res1.TId;
      database.run(sql_delete, QId, TId, (err, res2) => {
        if (err) throw err;

        res.redirect("/");
      });
    }
  });
};

exports.deleteQuestion = function (req, res) {
  let id = req.body.id;
  let name = "";
  let sql_delete_fs = "DELETE FROM Fragen_Sammlungen WHERE QId = ?";
  let sql_delete_tags = "DELETE FROM Tags WHERE Id = ?";
  let sql_delete_q = "DELETE FROM Fragen WHERE Id = ?";
  database.run(sql_delete_fs, id, (err, res2) => {
    if (err) throw err;
    database.run(sql_delete_tags, id, (err, res3) => {
      if (err) throw err;
      database.run(sql_delete_q, id, (err, res4) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
  });
};

exports.addTagC = function (req, res) {
  let name = req.body.name;
  let tag = req.body.tag;
  tag = tag.toLowerCase();
  let sql_ID = "SELECT Id FROM Sammlungen WHERE Name =?";
  let sql_check_for_Tag = "SELECT Id FROM Tags WHERE Tag =?";
  let sql_Tag = "INSERT INTO Tags (Tag) VALUES (?)";
  let sql_check_tag_to_question =
    "SELECT TId FROM Sammlungen_Tags WHERE CId = ?";
  let sql_tag_to_question =
    "INSERT INTO Sammlungen_Tags (TId, CId) VALUES (?,?)";
  let TId;
  let CId;

  if (tag == "") {
    req.session.message = "Bitte geben Sie einen Tagnamen ein";
    res.redirect("/");
    return;
  }
  database.get(sql_ID, name, (err, res1) => {
    if (err) throw err;

    if (res1) {
      CId = res1.Id;
      database.get(sql_check_for_Tag, tag, (err, res2) => {
        if (err) throw err;

        if (res2 == undefined) {
          database.run(sql_Tag, tag, (err, res3) => {
            if (err) throw err;

            database.get(sql_check_for_Tag, tag, (err, TId) => {
              if (err) throw err;

              if (TId) {
                TId = TId.Id;

                database.run(sql_tag_to_question, TId, CId, (err, res3) => {
                  if (err) throw err;

                  res.redirect("/");
                });
              }
            });
          });
        } else {
          TId = res2.Id;
          database.all(sql_check_tag_to_question, CId, (err, TId2) => {
            if (err) throw err;
            if (TId2) {
              let buf = false;
              for (let i = 0; i < TId2.length; i++) {
                if (TId == TId2[i].TId) {
                  buf = true;
                }
              }
              if (buf) {
                req.session.message =
                  "Dieser Tag wurde der Frage bereits hinzugefügt";
                res.redirect("/");
              } else {
                database.run(sql_tag_to_question, TId, CId, (err, res3) => {
                  if (err) throw err;
                  res.redirect("/");
                });
              }
            }
          });
        }
      });
    }
  });
};

exports.deleteTagC = function (req, res) {
  let name = req.body.name;
  let tag = req.body.tag;
  let sql_CId =
    "SELECT Sammlungen.Id AS CId, Tags.Id AS TId FROM Sammlungen, Tags WHERE Sammlungen.Name =? AND Tags.Tag =?";
  let sql_delete = "DELETE FROM Sammlungen_Tags WHERE CId = ? AND TId = ?";
  let CId, TId;
  if (tag == "") {
    req.session.message = "Es wurde kein Tag ausgewählt";
    res.redirect("/");
    return;
  }
  database.get(sql_CId, name, tag, (err, res1) => {
    if (err) throw err;
    if (res1) {
      CId = res1.CId;
      TId = res1.TId;
      database.run(sql_delete, CId, TId, (err, res2) => {
        if (err) throw err;

        res.redirect("/");
      });
    }
  });
};

exports.deleteFromCollection = function (req, res) {
  let collection = req.body.collection;
  let questions = req.body.questions;
  questions = questions.split(",").map(Number);
  let counter = questions.length;
  let sql_getCId = "SELECT Id FROM Sammlungen WHERE Name = ?";
  let sql_changeCol = "UPDATE FRAGEN SET inCollection = 0 WHERE Id = ?";
  let sql_delete = "DELETE FROM Fragen_Sammlungen WHERE QId = ? AND CId = ?";
  let CId;
  if (collection == "" || questions == "") {
    req.session.message = "Wählen Sie Frage und Sammlung aus";
    res.redirect("/");
    return;
  }

  database.get(sql_getCId, collection, (err, res1) => {
    if (err) throw err;
    CId = res1.Id;
    database.serialize(function () {
      for (let i = 0; i < counter; i++) {
        database.run(sql_changeCol, questions[i], (err, res3) => {
          if (err) throw err;
          database.run(sql_delete, questions[i], CId, (err, res4) => {
            if (err) throw err;
          });
        });
      }
    });
    res.redirect("/");
  });
};

exports.addTagQMultiple = function (req, res) {
  let tag = req.body.tag;
  tag = tag.toLowerCase();
  let questions = req.body.name;
  let sql_TId_check = "SELECT Id FROM Tags WHERE Tag =?";
  let sql_TId_run = "INSERT INTO TAGS (Tag) VALUES(?)";
  let sql_run = "INSERT INTO Fragen_Tags (TId, QId) VALUES(?,?)";
  let sql_check_tag_to_question =
    "SELECT COUNT(*) AS counter FROM Fragen_Tags WHERE QId = ? AND TId = ?";
  let TId;
  let QId = questions.split(',').map(Number)
  let counter = QId.length;
  if (tag == "" || questions == "") {
    req.session.message = "Wählen Sie Fragen und einen Tag aus";
    res.redirect("/");
    return;
  }
  database.get(sql_TId_check, tag, (err, res1) => {
    if (err) throw err;
    if (res1 == undefined) {
      database.run(sql_TId_run, tag, (err, res2) => {
        if (err) throw err;
      });
      database.get(sql_TId_check, tag, (err, res3) => {
        if (err) throw err;
        TId = res3.Id;
      });
    } else {
        
      TId = res1.Id;
    }
    for (let i = 0; i < counter; i++) {
      database.serialize(function () {
        database.all(sql_check_tag_to_question, QId[i], TId, (err, counter) => {
          if (err) throw err;
          if (counter.counter == 0) {
            req.session.message =
              "Dieser Tag wurde der Frage bereits hinzugefügt";
          } else {
            database.run(sql_run, TId, QId[i], (err, res5) => {
              if (err) throw err;
            });
          }
        });
      });
    }
    res.redirect("/");
  });
};


exports.deleteTagQMultiple = function (req, res) {
  let questions = req.body.name;
  let tag = req.body.tag;
  tag = tag.toLowerCase();
  let filteredQ = [];
  let TId;

  let sql_TId = "SELECT Id FROM Tags WHERE Tag = ?";
  let sql_delete = "DELETE FROM Fragen_Tags WHERE TId = ? AND QId = ?";

  let QId = questions.split(',').map(Number)
  let counter = QId.length;

  if (tag == "" || questions == "") {
    req.session.message = "Wählen Sie Fragen und einen Tag aus";
    res.redirect("/");
    return;
  }


  database.get(sql_TId, tag, (err, tagID) => {
    if (err) throw err;
    TId = tagID.Id;
    for (let i = 0; i < counter; i++) {
      database.serialize(function () {
          database.run(sql_delete, TId, QId[i], (err, res) => {
            if (err) throw err;
          });

      });
    }
    res.redirect("/");
  });
};

//Funktionen
async function extractquestions(uploadpath, filename, file) {
  let questions = [];
  let sql_proof =
    "SELECT Titel FROM Fragen WHERE Beschreibung =? AND Antwort =?";
  let sql_insert =
    "INSERT INTO Fragen (Titel, Beschreibung, Antwort, Frage, inCollection) VALUES (?,?,?,?,0)";
  let sql_insert_tag =
    "INSERT INTO Tags(Tag) SELECT ? WHERE NOT EXISTS(SELECT 1 FROM Tags WHERE Tag=?)";
  let sql_lock_tag =
    "INSERT INTO Fragen_Tags(QId, TId) VALUES((SELECT Id FROM Fragen WHERE Beschreibung = ? AND Antwort = ?), (SELECT Id FROM Tags WHERE Tag=?))";
  let sql_course_tag =
    "INSERT INTO Tags(Tag) VALUES (?), (?), (?) ON CONFLICT(Tag) DO NOTHING;";
  let sql_course_lock =
    "INSERT INTO Fragen_Tags(QId, TId) VALUES((SELECT Id FROM Fragen WHERE Beschreibung = ? AND Antwort = ?), (SELECT Id FROM Tags WHERE Tag=?)),((SELECT Id FROM Fragen WHERE Beschreibung = ? AND Antwort = ?), (SELECT Id FROM Tags WHERE Tag=?)),((SELECT Id FROM Fragen WHERE Beschreibung = ? AND Antwort = ?), (SELECT Id FROM Tags WHERE Tag=?))";

  let filtered_JSON = [];

  await get_course_data(uploadpath, file).then(async (coursedata) => {

    await scrape_course(coursedata).then((coursetags) => {

      return new Promise((resolve, reject) => {

        file.mv(uploadpath, (err) => {
          //Datei wird in den Files Ordner gebracht, wo er weiter verarbeitet wird.
          if (err) {
            throw err;
          }
          fs.readFile("./files/" + filename, function (err, data) {
            if (err) {
              throw err;
            }

            const xmlDataStr = data;

            const parser = new XMLParser(options);
            const output = parser.parse(xmlDataStr);

            let course_name;
            try {
              for (let i = 0; i < output.quiz.question.length; i++) {
                if (output.quiz.question[i].attr_type == "coderunner") {
                  questions.push(output.quiz.question[i]);
                }
              }
            } catch (e) {
              console.log(e);
              return;
            }

            //Lösche Duplikate von questions
            const filteredQuestions = questions.reduce((acc, current) => {
              const x = acc.find(
                (item) => removeWhitespace(item.questiontext.text) === removeWhitespace(current.questiontext.text)
              );
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            // erstelle String der JSON Datei um Speicherung in Datenbank zu ermöglichen
            for (let j = 0; j < filteredQuestions.length; j++) {
              filtered_JSON[j] = JSON.stringify(filteredQuestions[j]);
            }
            // trage Fragen in Datenbank ein
            for (let i = 0; i < filteredQuestions.length; i++) {
              // Überprüfe ob die Frage bereits in der Datenbank liegt
              database.get(
                sql_proof,
                filteredQuestions[i].questiontext.text,
                filteredQuestions[i].answer,
                (err, row) => {
                  if (err) {
                    throw err;
                  }

                  if (!row) {
                    database.serialize(function () {
                      //Frage in Datenbank einsetzen
                      database.run(
                        sql_insert,
                        filteredQuestions[i].name.text,
                        filteredQuestions[i].questiontext.text,
                        filteredQuestions[i].answer,
                        filtered_JSON[i],
                        (err, result) => {
                          if (err) {
                            throw err;
                          }
                          //Coderunner Tags erstellen falls sie noch nicht in der Datenbank vorhanden sind
                          database.run(
                            sql_insert_tag,
                            filteredQuestions[i].coderunnertype,
                            filteredQuestions[i].coderunnertype,
                            (err) => {
                              if (err) throw err;
                              //Tags an Fragen zuweisen
                              database.run(
                                sql_lock_tag,
                                filteredQuestions[i].questiontext.text,
                                filteredQuestions[i].answer,
                                filteredQuestions[i].coderunnertype,
                                (err) => {
                                  if (err) throw err;
                                  database.run(
                                    sql_course_tag,
                                    coursetags[0],
                                    coursetags[1],
                                    coursetags[2],
                                    (err) => {
                                      if (err) throw err;
                                      database.run(
                                        sql_course_lock,
                                        filteredQuestions[i].questiontext.text,
                                        filteredQuestions[i].answer,
                                        coursetags[0],
                                        filteredQuestions[i].questiontext.text,
                                        filteredQuestions[i].answer,
                                        coursetags[1],
                                        filteredQuestions[i].questiontext.text,
                                        filteredQuestions[i].answer,
                                        coursetags[2],
                                        (err) => {
                                          if (err) throw err;
                                          resolve();
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    });
                  }
                }
              );
            }
          });
        });
      });
    });
  });
  fs.unlink("./files/" + filename, (err) => {
    if (err) {
      throw err;
    }
  });
}

function exportquestions(questions, collectionname, res) {
  if (fs.existsSync("./downloads/" + collectionname + ".xml")) {
    fs.truncate("./downloads/" + collectionname + ".xml", 0, function () {});
  }
  const builder = new XMLBuilder(options);
  let data_output =
    `<?xml version="1.0" encoding="UTF-8"?>
                            <quiz>
                            <!-- question: 0  -->
                              <question type="category">
                                <category>
                                  <text>` +
    collectionname +
    `</text>
                                </category>
                                <info format="moodle_auto_format">
                                  <text></text>
                                </info>
                                <idnumber></idnumber>
                              </question>
                            
                            <!-- question: 0  -->
                              <question type="category">
                                <category>
                                  <text>` +
    collectionname +
    `</text>
                                </category>
                                <info format="html">
                                  <text></text>
                                </info>
                                <idnumber></idnumber>
                              </question>`;

  for (let i = 0; i < questions.length; i++) {
    data_output =
      data_output +
      '<question type="coderunner">' +
      builder.build(questions[i]) +
      "</question>";
  }

  data_output = data_output + "</quiz>";
  let formatted_output = format(data_output);

  fs.writeFile(
    "./downloads/" + collectionname + ".xml",
    formatted_output,
    function (err) {
      if (err) throw err;
      res.set({
        Location: "/",
      });
      res.download("./downloads/" + collectionname + ".xml");
    }
  );
}

async function scrape_course(coursedata) {
  let course = coursedata[0];
  let date = coursedata[1];
  let output = [];
  output.push(date);
  if (course[0] == "b") {
    course[0] = "B";
  }

  let http_link =
    "https://elearning.hs-ruhrwest.de/course/search.php?q=" +
    course +
    "-" +
    date +
    "&areaids=core_course-course";

  const response = await fetch(http_link);
  if (response.status == 200) {
    const $ = cheerio.load(await response.text());

    //coursebox clearfix odd first
    const element = $(".coursebox.clearfix.odd.first");
    let course_title = element.children().first().text();
    course_title = course_title.split("|").slice(1).join("|");
    const separatorPos = course_title.indexOf("-");
    if (separatorPos != -1) {
      course_title = course_title.substring(0, separatorPos);
      const regexp = new RegExp(course, "i"); // i-Modifikator für case-insensitive Suche
      course_title = course_title.replace(regexp, "");
    }
    course_title = course_title.trim();
    output.push(course_title);

    let lect = element.find(".teachers").children().first().text();

    const regex2 = /: (.*)/;
    const found = lect.match(regex2);
    lect = found[1];
    const words = lect.split(" ");
    lect = words[words.length - 1];
    output.push(lect);
    return output;
  }
}

async function get_course_data(uploadpath, file) {
  filename = file.name;

  return new Promise((resolve, reject) => {
    let coursedata = [];
    file.mv(uploadpath, (err) => {
      //Datei wird in den Files Ordner gebracht, wo er weiter verarbeitet wird.
      if (err) {
        throw err;
      }
      fs.readFile("./files/" + filename, function (err, data) {
        if (err) {
          throw err;
        }

        const xmlDataStr = data;

        const parser = new XMLParser(options);
        const output = parser.parse(xmlDataStr);

        let course_name;
        try {
          for (let i = 0; i < output.quiz.question.length; i++) {
            if (output.quiz.question[i].attr_type == "category") {
              course_name = output.quiz.question[i].info.text;
            }
          }

          const regex = /'(.*?)'/;
          const found = course_name.match(regex);
          coursedata = found[1].split("-");
        } catch (e) {
          console.log(e);
          return;
        }

        resolve(coursedata);
      });
    });
  });
}

function removeWhitespace(text) {
    // Replace newline characters with spaces
    let noNewlines = text.replace(/\n/g, " ");
    
    // Replace multiple consecutive spaces with a single space
    let noExtraSpaces = noNewlines.replace(/\s+/g, " ");
    
    // Trim leading and trailing spaces
    return noExtraSpaces.trim();
}