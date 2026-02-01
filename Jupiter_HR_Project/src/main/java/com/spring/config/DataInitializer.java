package com.spring.config;

import com.spring.model.User;
import com.spring.model.User.UserRole;
import com.spring.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Data Initializer
 *
 * Initializes demo data when the application starts.
 * Creates default users for testing purposes.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Component
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;

    @Autowired
    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Initialize demo data on application startup.
     * This method is called when the Spring context is refreshed.
     */
    @EventListener(ContextRefreshedEvent.class)
    public void initializeData() {
        logger.info("Initializing JUPITER demo data...");

        // Create demo users if they don't exist
        createUserIfNotExists("admin", "admin123", "admin@jupiter.edu", "System Administrator", UserRole.ADMIN);
        createUserIfNotExists("hr1", "pass123", "hr1@jupiter.edu", "HR Manager", UserRole.HR);
        createUserIfNotExists("hr2", "pass123", "hr2@jupiter.edu", "HR Assistant", UserRole.HR);
        createUserIfNotExists("student1", "pass123", "student1@jupiter.edu", "John Doe", UserRole.STUDENT);
        createUserIfNotExists("student2", "pass123", "student2@jupiter.edu", "Jane Smith", UserRole.STUDENT);
        createUserIfNotExists("student3", "pass123", "student3@jupiter.edu", "Bob Johnson", UserRole.STUDENT);

        logger.info("JUPITER demo data initialization complete!");
        logger.info("=================================================");
        logger.info("Demo Credentials:");
        logger.info("  Admin:   admin / admin123");
        logger.info("  HR:      hr1 / pass123");
        logger.info("  Student: student1 / pass123");
        logger.info("=================================================");
    }

    /**
     * Create a user if it doesn't already exist.
     *
     * @param username the username
     * @param password the password
     * @param email the email
     * @param fullName the full name
     * @param role the user role
     */
    private void createUserIfNotExists(String username, String password, String email, String fullName, UserRole role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User(username, password, email, fullName, role);
            userRepository.save(user);
            logger.info("Created demo user: {} ({})", username, role);
        } else {
            logger.debug("User already exists: {}", username);
        }
    }
}
