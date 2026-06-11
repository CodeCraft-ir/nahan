<?php
/**
 * Plugin Name: Nahan Café REST API
 * Plugin URI: https://nahancafe.ir
 * Description: REST API و Custom Post Types برای نهان کافه‌گالری
 * Version: 1.0.0
 * Author: Nahan Café
 * Author URI: https://nahancafe.ir
 * License: GPL2
 * Text Domain: nahan-cafe-api
 * Domain Path: /languages
 * 
 * Requires: WordPress 6.0+
 * Requires PHP: 8.0+
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// ============================================================================
// CONSTANTS
// ============================================================================

define('NAHAN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NAHAN_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NAHAN_PLUGIN_VERSION', '1.0.0');
define('NAHAN_REST_NAMESPACE', 'nahan/v1');

// ============================================================================
// ACTIVATION
// ============================================================================

register_activation_hook(__FILE__, 'nahan_plugin_activate');

function nahan_plugin_activate()
{
    // ثبت CPT ها و Taxonomy ها
    nahan_register_post_types();
    nahan_register_taxonomies();

    // بروزرسانی permalink ها
    flush_rewrite_rules();

    // ساخت داده اولیه
    if (function_exists('nahan_setup_sample_data')) {
        nahan_setup_sample_data();
    }
}

register_deactivation_hook(__FILE__, 'nahan_plugin_deactivate');

function nahan_plugin_deactivate()
{
    flush_rewrite_rules();
}

// ============================================================================
// CUSTOM POST TYPES
// ============================================================================

add_action('init', 'nahan_register_post_types');

function nahan_register_post_types() {
    // Menu Items
    register_post_type('nahan_menu_item', [
        'label' => 'آیتم منو',
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'menu-items',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-coffee',
        'has_archive' => false,
        'rewrite' => false,
    ]);

    // Events
    register_post_type('nahan_event', [
        'label' => 'رویداد',
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'events',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-calendar',
        'has_archive' => false,
        'rewrite' => false,
    ]);

    // Gallery
    register_post_type('nahan_gallery', [
        'label' => 'عکس گالری',
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => 'gallery',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => ['title', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-format-image',
        'has_archive' => false,
        'rewrite' => false,
    ]);
}

// ============================================================================
// CUSTOM TAXONOMIES
// ============================================================================

add_action('init', 'nahan_register_taxonomies');

function nahan_register_taxonomies() {
    // Menu Categories
    register_taxonomy('nahan_menu_category', 'nahan_menu_item', [
        'label' => 'دسته‌بندی منو',
        'public' => true,
        'publicly_queryable' => true,
        'show_in_rest' => true,
        'rest_base' => 'menu-categories',
        'hierarchical' => false,
        'rewrite' => false,
    ]);

    // Event Categories
    register_taxonomy('nahan_event_category', 'nahan_event', [
        'label' => 'دسته‌بندی رویداد',
        'public' => true,
        'publicly_queryable' => true,
        'show_in_rest' => true,
        'rest_base' => 'event-categories',
        'hierarchical' => false,
        'rewrite' => false,
    ]);

    // Gallery Categories
    register_taxonomy('nahan_gallery_category', 'nahan_gallery', [
        'label' => 'دسته‌بندی گالری',
        'public' => true,
        'publicly_queryable' => true,
        'show_in_rest' => true,
        'rest_base' => 'gallery-categories',
        'hierarchical' => false,
        'rewrite' => false,
    ]);
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

add_action('rest_api_init', 'nahan_register_rest_routes');

function nahan_register_rest_routes() {
    // Menu Items Grouped by Category
    register_rest_route(NAHAN_REST_NAMESPACE, '/menu', [
        'methods' => 'GET',
        'callback' => 'nahan_api_get_menu',
        'permission_callback' => '__return_true',
    ]);

    // Events Grouped by Category
    register_rest_route(NAHAN_REST_NAMESPACE, '/events', [
        'methods' => 'GET',
        'callback' => 'nahan_api_get_events',
        'permission_callback' => '__return_true',
    ]);

    // Gallery
    register_rest_route(NAHAN_REST_NAMESPACE, '/gallery', [
        'methods' => 'GET',
        'callback' => 'nahan_api_get_gallery',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * GET /wp-json/nahan/v1/menu
 * 
 * Returns menu items grouped by category
 * [
 *   {
 *     "category": { "id": "espresso", "label": "اسپرسو بار" },
 *     "items": [...]
 *   }
 * ]
 */
function nahan_api_get_menu(WP_REST_Request $request) {
    $menu_categories = get_terms([
        'taxonomy' => 'nahan_menu_category',
        'hide_empty' => false,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);

    if (is_wp_error($menu_categories)) {
        return new WP_REST_Response([], 200);
    }

    $result = [];

    foreach ($menu_categories as $category) {
        $items = get_posts([
            'post_type' => 'nahan_menu_item',
            'posts_per_page' => -1,
            'tax_query' => [
                [
                    'taxonomy' => 'nahan_menu_category',
                    'field' => 'term_id',
                    'terms' => $category->term_id,
                ],
            ],
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        $group = [
            'category' => [
                'id' => $category->slug,
                'label' => $category->name,
            ],
            'items' => array_map(function ($post) {
                return nahan_format_menu_item($post);
            }, $items),
        ];

        $result[] = $group;
    }

    return new WP_REST_Response($result, 200);
}

/**
 * GET /wp-json/nahan/v1/events
 * 
 * Returns events grouped by category
 */
function nahan_api_get_events(WP_REST_Request $request) {
    $event_categories = get_terms([
        'taxonomy' => 'nahan_event_category',
        'hide_empty' => false,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);

    if (is_wp_error($event_categories)) {
        return new WP_REST_Response([], 200);
    }

    $result = [];

    foreach ($event_categories as $category) {
        $events = get_posts([
            'post_type' => 'nahan_event',
            'posts_per_page' => -1,
            'tax_query' => [
                [
                    'taxonomy' => 'nahan_event_category',
                    'field' => 'term_id',
                    'terms' => $category->term_id,
                ],
            ],
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        $group = [
            'category' => [
                'id' => $category->slug,
                'label' => $category->name,
            ],
            'items' => array_map(function ($post) {
                return nahan_format_event($post);
            }, $events),
        ];

        $result[] = $group;
    }

    return new WP_REST_Response($result, 200);
}

/**
 * GET /wp-json/nahan/v1/gallery
 * 
 * Returns gallery images (optionally grouped by category)
 */
function nahan_api_get_gallery(WP_REST_Request $request) {
    $query = $request->get_query_params();
    $group_by_category = isset($query['group']) && $query['group'] === 'true';

    if ($group_by_category) {
        $categories = get_terms([
            'taxonomy' => 'nahan_gallery_category',
            'hide_empty' => false,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        if (is_wp_error($categories)) {
            return new WP_REST_Response([], 200);
        }

        $result = [];

        foreach ($categories as $category) {
            $gallery = get_posts([
                'post_type' => 'nahan_gallery',
                'posts_per_page' => -1,
                'tax_query' => [
                    [
                        'taxonomy' => 'nahan_gallery_category',
                        'field' => 'term_id',
                        'terms' => $category->term_id,
                    ],
                ],
                'orderby' => 'menu_order',
                'order' => 'ASC',
            ]);

            $group = [
                'category' => [
                    'id' => $category->slug,
                    'label' => $category->name,
                ],
                'images' => array_map(function ($post) {
                    return nahan_format_gallery_image($post);
                }, $gallery),
            ];

            $result[] = $group;
        }

        return new WP_REST_Response($result, 200);
    } else {
        // Flat list
        $gallery = get_posts([
            'post_type' => 'nahan_gallery',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        $result = array_map(function ($post) {
            return nahan_format_gallery_image($post);
        }, $gallery);

        return new WP_REST_Response($result, 200);
    }
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Format a menu item post into API response
 */
function nahan_format_menu_item(WP_Post $post) {
    $acf_fields = function_exists('get_fields') ? get_fields($post->ID) : [];

    return [
        'id' => (string) $post->ID,
        'title' => $post->post_title,
        'description' => wp_strip_all_tags($post->post_content),
        'price' => isset($acf_fields['price']) ? (string) $acf_fields['price'] : '',
        'image' => get_the_post_thumbnail_url($post->ID) ?: '',
        'badge' => isset($acf_fields['badge']) ? $acf_fields['badge'] : '',
    ];
}

/**
 * Format an event post into API response
 */
function nahan_format_event(WP_Post $post) {
    $acf_fields = function_exists('get_fields') ? get_fields($post->ID) : [];

    return [
        'id' => (string) $post->ID,
        'title' => $post->post_title,
        'description' => wp_strip_all_tags($post->post_content),
        'date' => isset($acf_fields['event_date']) ? $acf_fields['event_date'] : '',
        'time' => isset($acf_fields['event_time']) ? $acf_fields['event_time'] : '',
        'capacity' => isset($acf_fields['capacity']) ? (int) $acf_fields['capacity'] : 0,
        'registered' => isset($acf_fields['registered']) ? (int) $acf_fields['registered'] : 0,
        'image' => get_the_post_thumbnail_url($post->ID) ?: '',
        'link' => get_permalink($post->ID),
    ];
}

/**
 * Format a gallery image post into API response
 */
function nahan_format_gallery_image(WP_Post $post) {
    $image_id = get_post_thumbnail_id($post->ID);
    $image_url = get_the_post_thumbnail_url($post->ID);
    
    // Get multiple image sizes
    $image_data = [
        'id' => (string) $post->ID,
        'title' => $post->post_title,
        'full' => $image_url ?: '',
        'thumbnail' => wp_get_attachment_image_src($image_id, 'thumbnail')[0] ?? '',
        'medium' => wp_get_attachment_image_src($image_id, 'medium')[0] ?? '',
        'large' => wp_get_attachment_image_src($image_id, 'large')[0] ?? '',
    ];

    return $image_data;
}

// ============================================================================
// ACF FIELD GROUPS (for admin UI)
// ============================================================================

add_action('acf/init', 'nahan_add_acf_field_groups');

function nahan_add_acf_field_groups() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // Menu Item Fields
    acf_add_local_field_group([
        'key' => 'group_nahan_menu',
        'title' => 'تنظیمات آیتم منو',
        'fields' => [
            [
                'key' => 'field_nahan_menu_price',
                'label' => 'قیمت',
                'name' => 'price',
                'type' => 'text',
                'instructions' => 'مثال: 45,000',
                'required' => 1,
            ],
            [
                'key' => 'field_nahan_menu_badge',
                'label' => 'برچسب (badge)',
                'name' => 'badge',
                'type' => 'text',
                'instructions' => 'مثال: محبوب، تازه، ویژه',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'nahan_menu_item',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);

    // Event Fields
    acf_add_local_field_group([
        'key' => 'group_nahan_event',
        'title' => 'تنظیمات رویداد',
        'fields' => [
            [
                'key' => 'field_nahan_event_date',
                'label' => 'تاریخ رویداد',
                'name' => 'event_date',
                'type' => 'date_picker',
                'display_format' => 'Y-m-d',
                'return_format' => 'Y-m-d',
                'required' => 1,
            ],
            [
                'key' => 'field_nahan_event_time',
                'label' => 'ساعت شروع',
                'name' => 'event_time',
                'type' => 'time_picker',
                'display_format' => 'H:i',
                'return_format' => 'H:i',
            ],
            [
                'key' => 'field_nahan_event_capacity',
                'label' => 'ظرفیت',
                'name' => 'capacity',
                'type' => 'number',
                'instructions' => 'تعداد افراد',
            ],
            [
                'key' => 'field_nahan_event_registered',
                'label' => 'نفرات ثبت‌نام شده',
                'name' => 'registered',
                'type' => 'number',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'nahan_event',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);

    // Gallery Fields (metadata)
    acf_add_local_field_group([
        'key' => 'group_nahan_gallery',
        'title' => 'تنظیمات گالری',
        'fields' => [
            [
                'key' => 'field_nahan_gallery_alt',
                'label' => 'متن جایگزین (Alt)',
                'name' => 'alt_text',
                'type' => 'text',
                'instructions' => 'برای SEO و دسترسی‌پذیری',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'nahan_gallery',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
}

// ============================================================================
// ADMIN ENHANCEMENTS
// ============================================================================

add_filter('manage_nahan_menu_item_posts_columns', 'nahan_menu_columns');
add_action('manage_nahan_menu_item_posts_custom_column', 'nahan_menu_column_content', 10, 2);

function nahan_menu_columns($columns) {
    $columns['price'] = 'قیمت';
    return $columns;
}

function nahan_menu_column_content($column, $post_id) {
    if ($column === 'price') {
        $price = get_field('price', $post_id);
        echo $price ? esc_html($price) : '—';
    }
}

// ============================================================================
// PLUGIN INFO
// ============================================================================

add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'nahan_action_links');

function nahan_action_links($links) {
    $settings_link = '<a href="' . admin_url('admin.php?page=nahan-api-docs') . '">راهنما</a>';
    array_unshift($links, $settings_link);
    return $links;
}

require_once plugin_dir_path(__FILE__) . 'setup.php';