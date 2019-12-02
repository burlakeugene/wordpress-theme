<!doctype html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="<?php echo bloginfo('template_directory'); ?>/favicon.png" type="image/x-icon" />
  <meta name="theme-color" content="<?= get_option('theme-color') ?>">
  <?= get_option('head_additions') ?>
  <?php get_template_part('open-graph') ?>
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <div id="app">