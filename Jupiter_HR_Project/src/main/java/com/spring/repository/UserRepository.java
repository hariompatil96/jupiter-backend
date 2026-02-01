package com.spring.repository;

import com.spring.model.User;
import com.spring.model.User.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository Interface
 *
 * Provides data access operations for User entities using Spring Data MongoDB.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by username
     *
     * @param username the username to search
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     *
     * @param email the email to search
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by username and password (for authentication)
     *
     * @param username the username
     * @param password the password
     * @return Optional containing the user if credentials match
     */
    Optional<User> findByUsernameAndPassword(String username, String password);

    /**
     * Find all users by role
     *
     * @param role the user role
     * @return list of users with the specified role
     */
    List<User> findByRole(UserRole role);

    /**
     * Find all active users
     *
     * @param active the active status
     * @return list of active/inactive users
     */
    List<User> findByActive(boolean active);

    /**
     * Find all active users by role
     *
     * @param role the user role
     * @param active the active status
     * @return list of users matching the criteria
     */
    List<User> findByRoleAndActive(UserRole role, boolean active);

    /**
     * Check if username exists
     *
     * @param username the username to check
     * @return true if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists
     *
     * @param email the email to check
     * @return true if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Search users by full name (case insensitive)
     *
     * @param fullName the name pattern to search
     * @return list of matching users
     */
    @Query("{ 'full_name': { $regex: ?0, $options: 'i' } }")
    List<User> searchByFullName(String fullName);

    /**
     * Count users by role
     *
     * @param role the user role
     * @return count of users with the role
     */
    long countByRole(UserRole role);
}
