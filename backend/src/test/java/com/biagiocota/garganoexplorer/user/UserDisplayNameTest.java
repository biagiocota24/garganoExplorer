package com.biagiocota.garganoexplorer.user;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserDisplayNameTest {

    private User userWith(String firstName, String lastName) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return user;
    }

    @Test
    void withLastName_returnsFirstNameAndInitialWithDot() {
        assertThat(userWith("Mario", "Rossi").getDisplayName()).isEqualTo("Mario R.");
    }

    @Test
    void withEmptyLastName_returnsOnlyFirstName() {
        assertThat(userWith("Mario", "").getDisplayName()).isEqualTo("Mario");
    }

    @Test
    void withNullLastName_returnsOnlyFirstName() {
        assertThat(userWith("Mario", null).getDisplayName()).isEqualTo("Mario");
    }
}
