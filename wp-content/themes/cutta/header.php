<!DOCTYPE html>

<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <title>Columbia Tutoring and Translating Agency</title>
    <link rel="icon" href="<?php path('images/favicon.ico') ?>" type="image/x-icon">
    <?php wp_head(); ?>
</head>

<body id="<?php page_id(); ?>">
    <div class="wrapper">
        <?php wp_nav_menu( array( 'sort_column' => 'menu_order', 'menu_class' => 'nav', 'theme_location' => 'primary-menu' ) ); ?>
