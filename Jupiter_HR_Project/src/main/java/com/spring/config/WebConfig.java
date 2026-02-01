package com.spring.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Spring MVC Web Configuration Class
 *
 * Configures the Spring MVC framework including view resolvers,
 * message converters, and static resource handlers.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.spring")
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures the JSP View Resolver.
     * Maps logical view names to JSP files in /WEB-INF/views/ directory.
     *
     * @return configured ViewResolver
     */
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setViewClass(JstlView.class);
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        resolver.setContentType("text/html;charset=UTF-8");
        resolver.setOrder(1);
        return resolver;
    }

    /**
     * Creates and configures the Jackson ObjectMapper.
     * Handles JSON serialization/deserialization with Java 8 date/time support.
     *
     * @return configured ObjectMapper
     */
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Register Java 8 Date/Time module
        mapper.registerModule(new JavaTimeModule());

        // Disable writing dates as timestamps (use ISO-8601 format instead)
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Don't fail on empty beans
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

        return mapper;
    }

    /**
     * Creates the JSON message converter using Jackson.
     *
     * @return configured MappingJackson2HttpMessageConverter
     */
    @Bean
    public MappingJackson2HttpMessageConverter jsonConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper());
        return converter;
    }

    /**
     * Creates the String message converter with UTF-8 encoding.
     *
     * @return configured StringHttpMessageConverter
     */
    @Bean
    public StringHttpMessageConverter stringConverter() {
        StringHttpMessageConverter converter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        converter.setWriteAcceptCharset(false);
        return converter;
    }

    /**
     * Configures message converters for handling HTTP request/response bodies.
     *
     * @param converters list of converters to configure
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(stringConverter());
        converters.add(jsonConverter());
    }

    /**
     * Configures static resource handlers.
     * Maps URL patterns to physical resource locations.
     *
     * @param registry ResourceHandlerRegistry to configure
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Static resources
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/");

        registry.addResourceHandler("/static/**")
                .addResourceLocations("/static/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("/js/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("/images/");
    }

    /**
     * Enables the default servlet handler for serving static content.
     *
     * @param configurer DefaultServletHandlerConfigurer to configure
     */
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
}
