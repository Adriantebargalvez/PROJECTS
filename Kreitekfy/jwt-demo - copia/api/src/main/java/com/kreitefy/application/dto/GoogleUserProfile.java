package com.kreitefy.application.dto;

public class GoogleUserProfile {
    private final String subject;
    private final String email;
    private final String firstName;
    private final String lastName;

    public GoogleUserProfile(String subject, String email, String firstName, String lastName) {
        this.subject = subject;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getSubject() {
        return subject;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
