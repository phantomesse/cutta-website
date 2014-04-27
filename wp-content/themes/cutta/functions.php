<?php

add_filter( 'show_admin_bar', 'my_function_admin_bar');
add_action('init', 'theme_enqueue_styles');
add_action( 'init', 'register_my_menu' );

// Disable the Admin Bar
function my_function_admin_bar() {
    return false;
}

// Enqueue less scripts
function theme_enqueue_styles() {
    wp_enqueue_style('styles', get_stylesheet_directory_uri().'/css/style.less');
}

// Register area for custom menu
function register_my_menu() {
    register_nav_menu( 'primary-menu', __( 'Primary Menu' ) );
}

// Easy way to get assets from current theme path
function path($asset) {
    echo get_stylesheet_directory_uri().'/'.$asset;
}

// Creates an ID for the page
function page_id() {
    $name = str_replace(' ', '-', strtolower(get_the_title()));
    if ($name == '') {
        echo 'home';
    } else {
        echo $name;
    }
}

?>