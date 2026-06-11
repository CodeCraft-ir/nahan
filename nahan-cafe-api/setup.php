<?php
/**
 * Nahan Café API - Initial Setup Script
 * 
 * Run this once to create:
 * - Sample menu categories
 * - Sample menu items
 * - Sample events
 * - Sample gallery images
 * 
 * Usage: Add to functions.php temporarily and visit admin
 * Or run: wp eval-file setup.php
 */

if (!defined('ABSPATH')) {
    exit;
}

function nahan_setup_sample_data()
{
    if (get_option('nahan_setup_complete')) {
        return;
    }

    // ======================
    // Menu Categories
    // ======================

    $menu_categories = [
        'espresso' => 'اسپرسو بار',
        'ice-coffee' => 'آیس کافی',
        'hot-bar' => 'بار گرم',
        'brew' => 'دمی بار',
        'shake' => 'شیک و بستنی',
        'sherbet' => 'شربت',
        'mocktail' => 'ماکتل',
    ];

    $menu_category_ids = [];

    foreach ($menu_categories as $slug => $name) {

        $term = term_exists($slug, 'nahan_menu_category');

        if (!$term) {
            $term = wp_insert_term(
                $name,
                'nahan_menu_category',
                [
                    'slug' => $slug
                ]
            );
        }

        if (!is_wp_error($term)) {
            $menu_category_ids[$slug] = is_array($term)
                ? $term['term_id']
                : $term['term_id'];
        }
    }

    // ======================
    // Event Categories
    // ======================

    $event_categories = [
        'workshop' => 'ورکشاپ',
        'class' => 'کلاس آموزشی',
        'letters' => 'دورنشین حروف',
        'film' => 'نمایش فیلم',
    ];

    foreach ($event_categories as $slug => $name) {

        if (!term_exists($slug, 'nahan_event_category')) {

            wp_insert_term(
                $name,
                'nahan_event_category',
                [
                    'slug' => $slug
                ]
            );
        }
    }

    // ======================
    // Gallery Categories
    // ======================

    $gallery_categories = [
        'interior' => 'دکوراسیون',
        'kitchen' => 'آشپزخانه',
        'events' => 'رویدادها',
    ];

    foreach ($gallery_categories as $slug => $name) {

        if (!term_exists($slug, 'nahan_gallery_category')) {

            wp_insert_term(
                $name,
                'nahan_gallery_category',
                [
                    'slug' => $slug
                ]
            );
        }
    }

    // ======================
    // Sample Menu Item
    // ======================

    $existing = get_posts([
        'post_type' => 'nahan_menu_item',
        'posts_per_page' => 1
    ]);

    if (empty($existing)) {

        $post_id = wp_insert_post([
            'post_type' => 'nahan_menu_item',
            'post_title' => 'اسپرسو دابل',
            'post_content' => 'نمونه آیتم منو',
            'post_status' => 'publish',
        ]);

        if ($post_id) {

            wp_set_post_terms(
                $post_id,
                [$menu_category_ids['espresso']],
                'nahan_menu_category'
            );

            if (function_exists('update_field')) {

                update_field('price', '45000', $post_id);
                update_field('badge', 'محبوب', $post_id);

            } else {

                update_post_meta($post_id, 'price', '45000');
                update_post_meta($post_id, 'badge', 'محبوب');
            }
        }
    }

    // ======================
    // Sample Event
    // ======================

    $existing_event = get_posts([
        'post_type' => 'nahan_event',
        'posts_per_page' => 1
    ]);

    if (empty($existing_event)) {

        $event_id = wp_insert_post([
            'post_type' => 'nahan_event',
            'post_title' => 'رویداد نمونه',
            'post_content' => 'رویداد تستی',
            'post_status' => 'publish',
        ]);

        if ($event_id) {

            if (function_exists('update_field')) {

                update_field(
                    'event_date',
                    date('Y-m-d', strtotime('+7 day')),
                    $event_id
                );

                update_field(
                    'event_time',
                    '18:00',
                    $event_id
                );

                update_field(
                    'capacity',
                    20,
                    $event_id
                );

                update_field(
                    'registered',
                    0,
                    $event_id
                );
            }
        }
    }

    update_option('nahan_setup_complete', true);
}