package org.package1;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mongodb.MongoException;
import com.mongodb.client.*;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.InsertOneResult;
import com.mongodb.lang.Nullable;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.package1.utility.User;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gte;

public class MongoDBDriver {
    private static final Gson gson = new Gson();
    public static final String DB_NAME = "JavaLibrary";
    public static final String USERS = "Users";
    public static final String AUTHORS = "authors";
    public static final String SUBJECTS = "subjects";
    public static final String BOOKS = "books";
    public static final String BOOKCOLLS = "bookcollections";
    public static JSONObject register(MongoClient mongoClient, User user) {
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(USERS);
            Document doc = collection.find(eq("email", user.getEmail())).first();
            if (doc != null) {
                JSONObject dataJson = new JSONObject();
                dataJson.put("desc","user already exists");
                dataJson.put("code",409);
                return dataJson;
            }
            try {
                InsertOneResult result = collection.insertOne(new Document()
                        .append("_id", new ObjectId())
                        .append("email", user.getEmail())
                        .append("name", user.getName())
                        .append("password", user.getPassword())
                        .append("role", user.getRole()));
                JSONObject dataJson = new JSONObject();
                dataJson.put("data",new JSONObject(user));
                dataJson.put("code",200);
                return dataJson;
            } catch (MongoException me) {
                JSONObject dataJson = new JSONObject();
                dataJson.put("desc","database error");
                dataJson.put("code",500);
                return dataJson;
            }
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject login(MongoClient mongoClient, String email, String password) {
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(USERS);
            Document doc = collection.find(eq("email", email)).first();
            if(doc == null) {
                JSONObject dataJson = new JSONObject();
                dataJson.put("desc","no user found");
                dataJson.put("code",409);
                return dataJson;
            }
            if(!Objects.equals(doc.getString("password"), password)) {
                JSONObject dataJson = new JSONObject();
                dataJson.put("desc","password incorrect");
                dataJson.put("code",401);
                return dataJson;
            }
            JSONObject dataJson = new JSONObject();
            JSONObject user = new JSONObject();
            user.put("email",doc.getString("email"));
            user.put("name",doc.getString("name"));
            user.put("password",doc.getString("password"));
            user.put("role",doc.getString("role"));
            dataJson.put("data",user);
            dataJson.put("code",200);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject cookieLogin(MongoClient mongoClient, String data) {
        try {
            JSONObject dataJSON = new JSONObject(data);
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(USERS);
            Document doc = collection.find(eq("email", dataJSON.getString("email"))).first();
            if (doc != null) {
                if(Objects.equals(doc.getString("password"), dataJSON.getString("password"))){
                    JSONObject dataJson = new JSONObject();
                    dataJson.put("desc","successful");
                    dataJson.put("email",doc.getString("email"));
                    dataJson.put("name",doc.getString("name"));
                    dataJson.put("role",doc.getString("role"));
                    return dataJson;
                }
                JSONObject dataJson = new JSONObject();
                dataJson.put("desc","password incorrect");
                dataJson.put("code",500);
                return dataJson;
            }
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc","no user found");
            dataJson.put("code",409);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject getAllFromCollection(MongoClient mongoClient, String coll, @Nullable Integer take, @Nullable Integer skip){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(coll);
            FindIterable<Document> findIterable = collection.find().skip(skip).limit(take);
            Iterator<Document> iterator = findIterable.iterator();
            ArrayList<Document> items = new ArrayList<>();
            while (iterator.hasNext()) {
                items.add(iterator.next());
            }
            JSONObject dataJson = new JSONObject();
            dataJson.put("data", items);
            dataJson.put("code", 200);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject getTopRatedData(MongoClient mongoClient){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> booksColl = database.getCollection(BOOKS);
            MongoCollection<Document> authorsColl = database.getCollection(AUTHORS);
            MongoCollection<Document> subjectsColl = database.getCollection(SUBJECTS);

            FindIterable<Document> findIterableBooks = booksColl.find(gte("rate",4)).sort(Sorts.ascending("rate"));
            FindIterable<Document> findIterableAuthors = authorsColl.find(gte("rate",4)).sort(Sorts.ascending("rate"));
            FindIterable<Document> findIterableSubjects = subjectsColl.find(gte("rate",4.5)).sort(Sorts.ascending("rate"));

            Iterator<Document> iteratorBooks = findIterableBooks.iterator();
            Iterator<Document> iteratorAuthors = findIterableAuthors.iterator();
            Iterator<Document> iteratorSubjects = findIterableSubjects.iterator();

            ArrayList<Document> books = new ArrayList<>();
            while (iteratorBooks.hasNext()) {
                books.add(iteratorBooks.next());
            }
            ArrayList<Document> authors = new ArrayList<>();
            while (iteratorAuthors.hasNext()) {
                authors.add(iteratorAuthors.next());
            }
            ArrayList<Document> subjects = new ArrayList<>();
            while (iteratorSubjects.hasNext()) {
                subjects.add(iteratorSubjects.next());
            }
            JSONObject dataJson = new JSONObject();
            dataJson.put("books", books);
            dataJson.put("authors", authors);
            dataJson.put("subjects", subjects);
            dataJson.put("code", 200);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject getSearchKeys(MongoClient mongoClient){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> booksColl = database.getCollection(BOOKS);
            MongoCollection<Document> authorsColl = database.getCollection(AUTHORS);
            MongoCollection<Document> subjectsColl = database.getCollection(SUBJECTS);

            FindIterable<Document> findIterableBooks = booksColl.find().projection(Projections.include("title"));
            FindIterable<Document> findIterableAuthors = authorsColl.find().projection(Projections.include("author_name"));
            FindIterable<Document> findIterableSubjects = subjectsColl.find().projection(Projections.include("subject"));

            Iterator<Document> iteratorBooks = findIterableBooks.iterator();
            Iterator<Document> iteratorAuthors = findIterableAuthors.iterator();
            Iterator<Document> iteratorSubjects = findIterableSubjects.iterator();

            ArrayList<Document> books = new ArrayList<>();
            while (iteratorBooks.hasNext()) {
                books.add(iteratorBooks.next());
            }
            ArrayList<Document> authors = new ArrayList<>();
            while (iteratorAuthors.hasNext()) {
                authors.add(iteratorAuthors.next());
            }
            ArrayList<Document> subjects = new ArrayList<>();
            while (iteratorSubjects.hasNext()) {
                subjects.add(iteratorSubjects.next());
            }
            JSONObject dataJson = new JSONObject();
            dataJson.put("books", books);
            dataJson.put("authors", authors);
            dataJson.put("subjects", subjects);
            dataJson.put("code", 200);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject deleteSelectedFromSubjects(MongoClient mongoClient, String selected){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(SUBJECTS);
            ArrayList<Document> selectedDocs =  gson.fromJson(selected, new TypeToken<List<Document>>() {}.getType());
            selectedDocs.forEach(doc -> {
                Bson query = eq("subject", doc.get("subject"));
                collection.deleteOne(query);
            });
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject deleteSelectedFromAuthors(MongoClient mongoClient, String selected){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(AUTHORS);
            ArrayList<Document> selectedDocs =  gson.fromJson(selected, new TypeToken<List<Document>>() {}.getType());
            selectedDocs.forEach(doc -> {
                Bson query = eq("author_key", doc.get("author_key"));
                collection.deleteOne(query);
            });
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject deleteSelectedFromBooks(MongoClient mongoClient, String selected){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(BOOKS);
            ArrayList<Document> selectedDocs =  gson.fromJson(selected, new TypeToken<List<Document>>() {}.getType());
            selectedDocs.forEach(doc -> {
                Bson query = eq("key", doc.get("key"));
                collection.deleteOne(query);
            });
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }

    //@TODO доделать структуру коллекции
    public static JSONObject deleteSelectedFromBookCollections(MongoClient mongoClient, String selected){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(BOOKCOLLS);
            ArrayList<Document> selectedDocs =  gson.fromJson(selected, new TypeToken<List<Document>>() {}.getType());
            selectedDocs.forEach(doc -> {
                Bson query = eq("_id", doc.get("_id"));
                collection.deleteOne(query);
            });
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject insert(MongoClient mongoClient, String coll, String data){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(coll);
            collection.insertMany(gson.fromJson(data, new TypeToken<List<Document>>() {}.getType()));
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject updateBook(MongoClient mongoClient, String data){
        try {
            JSONObject dataJson = new JSONObject(data);
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(BOOKS);
            if(dataJson.get("value") instanceof String){
                System.out.println(collection.updateOne(
                        eq("key", dataJson.getString("key")),
                        Updates.set(dataJson.getString("field"),dataJson.getString("value"))
                ));
            }
            if(dataJson.get("value") instanceof Integer){
                System.out.println(collection.updateOne(
                        eq("key", dataJson.getString("key")),
                        Updates.set(dataJson.getString("field"),dataJson.getInt("value"))
                ));
            }
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject updateAuthor(MongoClient mongoClient, String data){
        try {
            JSONObject dataJson = new JSONObject(data);
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(AUTHORS);
            System.out.println(collection.updateOne(
                    eq("author_key", dataJson.getString("author_key")),
                    Updates.set(dataJson.getString("field"),dataJson.getString("value"))
            ));
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject updateSubject(MongoClient mongoClient, String data){
        try {
            JSONObject dataJson = new JSONObject(data);
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(SUBJECTS);
            System.out.println(collection.updateOne(
                    eq("subject", dataJson.getString("subject")),
                    Updates.set(dataJson.getString("field"),dataJson.getString("value"))
            ));
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    //@TODO доделать структуру коллекции
    public static JSONObject updateBookColl(MongoClient mongoClient, String data){
        try {
            JSONObject dataJson = new JSONObject(data);
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(BOOKCOLLS);
            if(dataJson.get("value") instanceof String){
                System.out.println(collection.updateOne(
                        eq("_id", dataJson.getString("_id")),
                        Updates.set(dataJson.getString("field"),dataJson.getString("value"))
                ));
            }
            if(dataJson.get("value") instanceof Integer){
                System.out.println(collection.updateOne(
                        eq("key", dataJson.getString("key")),
                        Updates.set(dataJson.getString("field"),dataJson.getInt("value"))
                ));
            }
            return new JSONObject().put("code", 200);
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
    public static JSONObject getUserBookColls(MongoClient mongoClient, String email){
        try {
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);
            MongoCollection<Document> collection = database.getCollection(BOOKCOLLS);
            FindIterable<Document> findIterable = collection.find(eq("user_email", email));
            Iterator<Document> iterator = findIterable.iterator();
            ArrayList<Document> orders = new ArrayList<>();
            while (iterator.hasNext()) {
                orders.add(iterator.next());
            }
            JSONObject dataJson = new JSONObject();
            dataJson.put("data", orders);
            dataJson.put("code", 200);
            return dataJson;
        } catch (Exception e) {
            System.out.println(e);
            JSONObject dataJson = new JSONObject();
            dataJson.put("desc",e.toString());
            dataJson.put("code",500);
            return dataJson;
        }
    }
}
