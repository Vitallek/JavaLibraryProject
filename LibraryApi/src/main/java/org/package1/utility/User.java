package org.package1.utility;

public class User {
    private String email;
    private String phone;
    private String name;
    private String password;
    private String token;
    private String role;

    public User(String email, String phone, String name, String password, String token,String role) {
        this.email = email;
        this.phone = phone;
        this.name = name;
        this.password = password;
        this.role = role;
        if(token == null) this.token = "";
        else this.token = token;
    }
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
