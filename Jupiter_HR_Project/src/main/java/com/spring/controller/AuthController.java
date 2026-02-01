package com.spring.controller;

import com.spring.model.User;
import com.spring.model.User.UserRole;
import com.spring.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

/**
 * Authentication Controller
 *
 * Handles user authentication via JSP pages including login,
 * logout, and role-based dashboard redirection.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Controller
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private static final String SESSION_USER = "loggedInUser";
    private static final String SESSION_USER_ID = "userId";
    private static final String SESSION_USER_ROLE = "userRole";
    private static final String SESSION_USERNAME = "username";

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Display home page - redirects to login
     *
     * @return redirect to login page
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    /**
     * Display login page
     *
     * @param model the model
     * @param session the HTTP session
     * @return login view or redirect to dashboard if already logged in
     */
    @GetMapping("/login")
    public String showLoginPage(Model model, HttpSession session) {
        // Check if user is already logged in
        if (session.getAttribute(SESSION_USER) != null) {
            User user = (User) session.getAttribute(SESSION_USER);
            return redirectToDashboard(user.getRole());
        }

        model.addAttribute("pageTitle", "JUPITER - Login");
        return "login";
    }

    /**
     * Process login form submission
     *
     * @param username the username
     * @param password the password
     * @param session the HTTP session
     * @param redirectAttributes for flash messages
     * @return redirect to appropriate dashboard or back to login with error
     */
    @PostMapping("/login")
    public String processLogin(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        logger.info("Login attempt for user: {}", username);

        // Validate input
        if (username == null || username.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Username and password are required");
            return "redirect:/login";
        }

        // Attempt authentication
        Optional<User> userOpt = userService.authenticate(username.trim(), password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Store user info in session
            session.setAttribute(SESSION_USER, user);
            session.setAttribute(SESSION_USER_ID, user.getId());
            session.setAttribute(SESSION_USER_ROLE, user.getRole().name());
            session.setAttribute(SESSION_USERNAME, user.getUsername());

            // Set session timeout (30 minutes)
            session.setMaxInactiveInterval(30 * 60);

            logger.info("User {} logged in successfully with role: {}", username, user.getRole());

            // Redirect based on role
            return redirectToDashboard(user.getRole());
        } else {
            logger.warn("Login failed for user: {}", username);
            redirectAttributes.addFlashAttribute("error", "Invalid username or password");
            return "redirect:/login";
        }
    }

    /**
     * Display student dashboard
     *
     * @param model the model
     * @param session the HTTP session
     * @return student dashboard view or redirect to login
     */
    @GetMapping("/student/dashboard")
    public String studentDashboard(Model model, HttpSession session) {
        User user = getAuthenticatedUser(session);

        if (user == null) {
            return "redirect:/login";
        }

        if (user.getRole() != UserRole.STUDENT && user.getRole() != UserRole.ADMIN) {
            return "redirect:/access-denied";
        }

        model.addAttribute("user", user);
        model.addAttribute("pageTitle", "Student Dashboard - JUPITER");
        return "student-dashboard";
    }

    /**
     * Display HR dashboard
     *
     * @param model the model
     * @param session the HTTP session
     * @return HR dashboard view or redirect to login
     */
    @GetMapping("/hr/dashboard")
    public String hrDashboard(Model model, HttpSession session) {
        User user = getAuthenticatedUser(session);

        if (user == null) {
            return "redirect:/login";
        }

        if (user.getRole() != UserRole.HR && user.getRole() != UserRole.ADMIN) {
            return "redirect:/access-denied";
        }

        model.addAttribute("user", user);
        model.addAttribute("pageTitle", "HR Dashboard - JUPITER");
        return "hr-dashboard";
    }

    /**
     * Display admin dashboard (optional)
     *
     * @param model the model
     * @param session the HTTP session
     * @return admin dashboard view or redirect
     */
    @GetMapping("/admin/dashboard")
    public String adminDashboard(Model model, HttpSession session) {
        User user = getAuthenticatedUser(session);

        if (user == null) {
            return "redirect:/login";
        }

        if (user.getRole() != UserRole.ADMIN) {
            return "redirect:/access-denied";
        }

        model.addAttribute("user", user);
        model.addAttribute("pageTitle", "Admin Dashboard - JUPITER");
        return "hr-dashboard"; // Use HR dashboard for admin as well
    }

    /**
     * Process logout
     *
     * @param session the HTTP session
     * @param redirectAttributes for flash messages
     * @return redirect to login page
     */
    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        String username = (String) session.getAttribute(SESSION_USERNAME);

        // Invalidate session
        session.invalidate();

        logger.info("User {} logged out successfully", username);
        redirectAttributes.addFlashAttribute("message", "You have been logged out successfully");

        return "redirect:/login";
    }

    /**
     * Display access denied page
     *
     * @param model the model
     * @return access denied view
     */
    @GetMapping("/access-denied")
    public String accessDenied(Model model) {
        model.addAttribute("pageTitle", "Access Denied - JUPITER");
        model.addAttribute("error", "You do not have permission to access this page");
        return "login";
    }

    /**
     * Get authenticated user from session
     *
     * @param session the HTTP session
     * @return the authenticated user or null
     */
    private User getAuthenticatedUser(HttpSession session) {
        return (User) session.getAttribute(SESSION_USER);
    }

    /**
     * Redirect to appropriate dashboard based on role
     *
     * @param role the user's role
     * @return redirect URL
     */
    private String redirectToDashboard(UserRole role) {
        switch (role) {
            case STUDENT:
                return "redirect:/student/dashboard";
            case HR:
                return "redirect:/hr/dashboard";
            case ADMIN:
                return "redirect:/admin/dashboard";
            default:
                return "redirect:/login";
        }
    }
}
