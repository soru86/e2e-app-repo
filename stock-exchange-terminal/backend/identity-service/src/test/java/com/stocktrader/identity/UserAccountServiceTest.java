package com.stocktrader.identity;

import com.stocktrader.identity.service.UserAccountService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserAccountServiceTest {

    @Autowired
    private UserAccountService userAccountService;

    @Test
    void registerAndAuthenticateUser() {
        var profile = userAccountService.register("newuser@example.com", "New User", "password123");
        Assertions.assertNotNull(profile);
        Assertions.assertEquals("newuser@example.com", profile.email());

        var authProfile = userAccountService.authenticate("newuser@example.com", "password123");
        Assertions.assertEquals(profile.userId(), authProfile.userId());
    }

    @Test
    void duplicateEmailThrowsException() {
        userAccountService.register("dup@example.com", "Dup", "password123");
        Assertions.assertThrows(IllegalStateException.class, () ->
                userAccountService.register("dup@example.com", "Dup", "password123"));
    }
}

