package org.package1;

import com.google.gson.Gson;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import org.package1.utility.User;

import java.io.IOException;

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
    public static int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }
    public static void main(String[] args) {
        System.out.println("server runs at port " + port);
        port(port);
        cors("http://127.0.0.1:3000", "*", null);
        MongoClient mongoClient = MongoClients.create(DB_URI);
        post("/register", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            System.out.println("register from " + user.getEmail());
            JWTDriver.createToken(user);
            JSONObject response = MongoDBDriver.register(mongoClient,user);
            res.status(response.getInt( "code"));
            return response;
        });
        post("/login", (req, res) -> {
            User user = gson.fromJson(req.body(), User.class);
            System.out.println("login from " + user.getEmail());
            JSONObject response = MongoDBDriver.login(mongoClient,user.getEmail(), user.getPassword());
            res.status(response.getInt( "code"));
            return response;
        });
        post("/cookie-login", (req, res) -> {
            String token = req.body();
            String payload = JWTDriver.decodeToken(token);
            User user = gson.fromJson(payload, User.class);
            JSONObject response = MongoDBDriver.cookieLogin(mongoClient,user.getEmail(), user.getPassword());
            res.status(response.getInt( "code"));
            return response;
        });
        get("/get-all/:collection", (req, res) -> {
            System.out.println(req.params(":collection"));
            JSONObject response = MongoDBDriver.getAllFromCollection(
                    mongoClient,
                    req.params(":collection").toLowerCase(),
                    req.queryParams("take"),
                    req.queryParams("skip")
            );
            res.status(response.getInt( "code"));
            return response;
        });
        get("/get-with-query/:collection/:query/:field", (req, res) -> {
            System.out.println(req.params(":query").toLowerCase());
            JSONObject response = MongoDBDriver.getAllFromCollectionQueried(
                    mongoClient,
                    req.params(":collection").toLowerCase(),
                    req.params(":query"),
                    req.params(":field")
            );
            res.status(response.getInt( "code"));
            return response;
        });
        get("/get-search-keys", (req, res) -> {
            JSONObject response = MongoDBDriver.getSearchKeys(mongoClient);
            res.status(response.getInt( "code"));
            return response;
        });
        get("/get-top-rated-data", (req, res) -> {
            JSONObject response = MongoDBDriver.getTopRatedData(mongoClient);
            res.status(response.getInt( "code"));
            return response;
        });
        get("/get-favorites/:user", (req, res) -> {
            JSONObject response = MongoDBDriver.getFavorites(mongoClient, req.params(":user"));
            res.status(response.getInt( "code"));
            return response;
        });
        put("/place-comment/:bookkey",(req,res) -> {
            JSONObject response = MongoDBDriver.placeComment(mongoClient,req.params(":bookkey"), req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-comment/:bookkey/:id",(req,res) -> {
            JSONObject response = MongoDBDriver.updateComment(mongoClient,req.params(":bookkey"), req.params(":id"),req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("/delete-comment/:bookkey/:id",(req,res) -> {
            JSONObject response = MongoDBDriver.deleteComment(mongoClient,req.params(":bookkey"), req.params(":id"));
            res.status(response.getInt("code"));
            return response;
        });
        put("/add-to-favorite",(req,res) -> {
            JSONObject response = MongoDBDriver.addToFavotite(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("/remove-from-favorite",(req,res) -> {
            System.out.println(req.body());
            JSONObject response = MongoDBDriver.removeFromFavorites(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-book",(req,res) -> {
            JSONObject response = MongoDBDriver.updateBook(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-books", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromBooks(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });



        get("get-images/:query", (req, res) -> {
            System.out.println(req.params(":query"));

            final OkHttpClient client = new OkHttpClient();

            Request request = new Request.Builder()
//                    .url("https://api.unsplash.com/search/photos?query=" + req.params(":query") + " car&per_page=30&page="+ getRandomNumber(1,1))
                    .url("https://api.unsplash.com/search/photos?query=" + req.params(":query") + " car&per_page=30&page=1")
                    .header("accept", "application/json")
                    .header("Authorization", "Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8")
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
                res.status(200);
                return new JSONObject().put("data", response.body().string());
            } catch (IOException e) {
                e.printStackTrace();
                return new JSONObject().put("error", e.toString());
            }
        });
        post("insert-to-coll/:brand",(req,res) -> {
            JSONObject response = MongoDBDriver.insert(mongoClient,req.params(":brand").toLowerCase(), req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-authors", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromAuthors(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        delete("delete-selected-subjects", (req, res) -> {
            JSONObject response = MongoDBDriver.deleteSelectedFromSubjects(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-author",(req,res) -> {
            JSONObject response = MongoDBDriver.updateAuthor(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
        put("/update-subject",(req,res) -> {
            JSONObject response = MongoDBDriver.updateSubject(mongoClient,req.body());
            res.status(response.getInt("code"));
            return response;
        });
    }
}