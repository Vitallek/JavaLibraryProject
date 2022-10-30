package org.package1;

import com.google.gson.Gson;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.json.JSONObject;
import org.package1.utility.User;

import static spark.Spark.*;

public class Main {
    private static final Gson gson = new Gson();
    private static final Integer port = 3001;
    private static final String DB_URI = "mongodb://localhost:3002";

    // Enables CORS on requests. This method is an initialization method and should be called once.
    private static void cors(final String origin, final String methods, final String headers) {

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }

    public static void main(String[] args) {
        System.out.println("server runs at port " + port);
        port(port);
        cors("http://127.0.0.1:3000", "*", null);
        MongoClient mongoClient = MongoClients.create(DB_URI);
        post("/register", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            System.out.println("register from " + user.getEmail());
            return MongoDBDriver.register(mongoClient,user);
        });
        post("/login", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            System.out.println("login from " + user.getEmail());
            return MongoDBDriver.login(mongoClient,user.getEmail(), user.getPassword());
        });
        post("/token-login", (req, res) -> {
            String token = req.body();
            User user = gson.fromJson(req.body(), User.class);
            return MongoDBDriver.cookieLogin(mongoClient,user.getEmail(), user.getPassword());
        });
        get("/get-all/:collection", (req, res) -> {
            JSONObject response = MongoDBDriver.getAllFromCollection(mongoClient,req.params(":collection").toLowerCase());
            res.status(response.getInt( "code"));
            return response;
        });
        delete("delete-selected-subjects", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromSubjects(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-authors", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromAuthors(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-books", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromBooks(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-bookscoll", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromBookCollections(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        post("insert-to-coll/:brand",(req,res) -> {
            JSONObject response = MongoDBDriver.insert(mongoClient,req.params(":brand").toLowerCase(), req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-book",(req,res) -> {
            JSONObject response = MongoDBDriver.updateBook(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-author",(req,res) -> {
            JSONObject response = MongoDBDriver.updateAuthor(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-bookcoll",(req,res) -> {
            JSONObject response = MongoDBDriver.updateBookColl(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-subject",(req,res) -> {
            JSONObject response = MongoDBDriver.updateSubject(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        get("/get-coll/:email", (req, res) -> {
            System.out.println("get orders from " + req.params(":email"));
            JSONObject response = MongoDBDriver.getUserBookColls(mongoClient,req.params(":email").toLowerCase());
            res.status(response.getInt( "code"));
            return response;
        });
    }
}