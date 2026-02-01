package com.spring.service;

import com.spring.model.User;
import com.spring.model.User.UserRole;
import com.spring.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Service
 *
 * Provides business logic for user management and authentication.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Authenticate user with username and password
     *
     * @param username the username
     * @param password the password
     * @return Optional containing the authenticated user
     */
    public Optional<User> authenticate(String username, String password) {
        logger.info("Attempting authentication for user: {}", username);

        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (!user.isActive()) {
                logger.warn("Authentication failed - user is inactive: {}", username);
                return Optional.empty();
            }

            // Update last login time
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            logger.info("Authentication successful for user: {}", username);
            return Optional.of(user);
        }

        logger.warn("Authentication failed for user: {}", username);
        return Optional.empty();
    }

    /**
     * Create a new user
     *
     * @param user the user to create
     * @return the created user
     * @throws IllegalArgumentException if username or email already exists
     */
    public User createUser(User user) {
        logger.info("Creating new user: {}", user.getUsername());

        // Check if username exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }

        // Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

        User savedUser = userRepository.save(user);
        logger.info("User created successfully: {}", savedUser.getId());
        return savedUser;
    }

    /**
     * Find user by ID
     *
     * @param id the user ID
     * @return Optional containing the user if found
     */
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    /**
     * Find user by username
     *
     * @param username the username
     * @return Optional containing the user if found
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Find user by email
     *
     * @param email the email
     * @return Optional containing the user if found
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find all users
     *
     * @return list of all users
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Find users by role
     *
     * @param role the user role
     * @return list of users with the role
     */
    public List<User> findByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    /**
     * Find all active users
     *
     * @return list of active users
     */
    public List<User> findActiveUsers() {
        return userRepository.findByActive(true);
    }

    /**
     * Find active users by role
     *
     * @param role the user role
     * @return list of active users with the role
     */
    public List<User> findActiveUsersByRole(UserRole role) {
        return userRepository.findByRoleAndActive(role, true);
    }

    /**
     * Update user
     *
     * @param user the user to update
     * @return the updated user
     */
    public User updateUser(User user) {
        logger.info("Updating user: {}", user.getId());

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully: {}", updatedUser.getId());
        return updatedUser;
    }

    /**
     * Update user password
     *
     * @param userId the user ID
     * @param newPassword the new password
     * @return true if password was updated
     */
    public boolean updatePassword(String userId, String newPassword) {
        logger.info("Updating password for user: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            logger.info("Password updated successfully for user: {}", userId);
            return true;
        }

        logger.warn("User not found for password update: {}", userId);
        return false;
    }

    /**
     * Deactivate user
     *
     * @param userId the user ID
     * @return true if user was deactivated
     */
    public boolean deactivateUser(String userId) {
        logger.info("Deactivating user: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(false);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            logger.info("User deactivated successfully: {}", userId);
            return true;
        }

        logger.warn("User not found for deactivation: {}", userId);
        return false;
    }

    /**
     * Activate user
     *
     * @param userId the user ID
     * @return true if user was activated
     */
    public boolean activateUser(String userId) {
        logger.info("Activating user: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            logger.info("User activated successfully: {}", userId);
            return true;
        }

        logger.warn("User not found for activation: {}", userId);
        return false;
    }

    /**
     * Delete user
     *
     * @param userId the user ID
     */
    public void deleteUser(String userId) {
        logger.info("Deleting user: {}", userId);
        userRepository.deleteById(userId);
        logger.info("User deleted successfully: {}", userId);
    }

    /**
     * Search users by name
     *
     * @param name the name pattern
     * @return list of matching users
     */
    public List<User> searchByName(String name) {
        return userRepository.searchByFullName(name);
    }

    /**
     * Count users by role
     *
     * @param role the user role
     * @return count of users
     */
    public long countByRole(UserRole role) {
        return userRepository.countByRole(role);
    }

    /**
     * Check if username exists
     *
     * @param username the username to check
     * @return true if exists
     */
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Check if email exists
     *
     * @param email the email to check
     * @return true if exists
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
