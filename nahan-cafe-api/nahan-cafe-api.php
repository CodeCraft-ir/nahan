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
 * اگه WooCommerce فعاله محصولات رو grouped برمی‌گردونه،
 * وگرنه از CPT nahan_gallery استفاده می‌کنه.
 */
function nahan_api_get_gallery(WP_REST_Request $request) {
    if (function_exists('wc_get_products')) {
        return nahan_api_get_gallery_woocommerce();
    }
    return nahan_api_get_gallery_cpt();
}

function nahan_api_get_gallery_woocommerce() {
    $default_cat_id = (int) get_option('default_product_cat');

    $categories = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
        'exclude'    => $default_cat_id ? [$default_cat_id] : [],
    ]);

    $result = [];

    if (!is_wp_error($categories) && !empty($categories)) {
        foreach ($categories as $category) {
            $products = wc_get_products([
                'status'   => 'publish',
                'limit'    => -1,
                'category' => [$category->slug],
                'orderby'  => 'date',
                'order'    => 'DESC',
            ]);
            if (empty($products)) continue;
            $result[] = [
                'category' => ['id' => $category->slug, 'label' => $category->name],
                'items'    => array_map('nahan_format_wc_product', $products),
            ];
        }
    }

    if (empty($result)) {
        $all = wc_get_products(['status' => 'publish', 'limit' => -1, 'orderby' => 'date', 'order' => 'DESC']);
        if (!empty($all)) {
            $result[] = [
                'category' => ['id' => 'all', 'label' => 'همه محصولات'],
                'items'    => array_map('nahan_format_wc_product', $all),
            ];
        }
    }

    return new WP_REST_Response($result, 200);
}

function nahan_api_get_gallery_cpt() {
    $categories = get_terms([
        'taxonomy'   => 'nahan_gallery_category',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);

    $result = [];

    if (!is_wp_error($categories) && !empty($categories)) {
        foreach ($categories as $category) {
            $posts = get_posts([
                'post_type'      => 'nahan_gallery',
                'posts_per_page' => -1,
                'tax_query'      => [[
                    'taxonomy' => 'nahan_gallery_category',
                    'field'    => 'term_id',
                    'terms'    => $category->term_id,
                ]],
                'orderby' => 'menu_order',
                'order'   => 'ASC',
            ]);
            if (empty($posts)) continue;
            $result[] = [
                'category' => ['id' => $category->slug, 'label' => $category->name],
                'items'    => array_map('nahan_format_gallery_post', $posts),
            ];
        }
    }

    if (empty($result)) {
        $all = get_posts(['post_type' => 'nahan_gallery', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC']);
        if (!empty($all)) {
            $result[] = [
                'category' => ['id' => 'all', 'label' => 'گالری'],
                'items'    => array_map('nahan_format_gallery_post', $all),
            ];
        }
    }

    return new WP_REST_Response($result, 200);
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

function nahan_format_gallery_post(WP_Post $post) {
    $acf = function_exists('get_fields') ? get_fields($post->ID) : [];
    return [
        'id'          => (string) $post->ID,
        'title'       => $post->post_title,
        'image'       => get_the_post_thumbnail_url($post->ID, 'large') ?: '',
        'description' => wp_strip_all_tags($post->post_content),
        'price'       => isset($acf['price']) ? (string) $acf['price'] : '',
        'sale_price'  => isset($acf['sale_price']) ? (string) $acf['sale_price'] : '',
    ];
}

function nahan_format_wc_product(WC_Product $product) {
    $image_id  = $product->get_image_id();
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
    return [
        'id'          => (string) $product->get_id(),
        'title'       => $product->get_name(),
        'image'       => $image_url ?: '',
        'description' => wp_strip_all_tags($product->get_description()),
        'price'       => (string) $product->get_regular_price(),
        'sale_price'  => (string) $product->get_sale_price(),
    ];
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
// REGISTRATION POST TYPE
// ============================================================================

add_action('init', 'nahan_register_registration_post_type');

function nahan_register_registration_post_type() {
    register_post_type('nahan_registration', [
        'label'           => 'ثبت‌نام رویداد',
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'show_in_rest'    => false,
        'capability_type' => 'post',
        'supports'        => ['title', 'custom-fields'],
        'menu_icon'       => 'dashicons-groups',
        'has_archive'     => false,
        'rewrite'         => false,
    ]);
}

// ============================================================================
// REGISTRATION REST ENDPOINT
// ============================================================================

add_action('rest_api_init', 'nahan_register_registration_route');

function nahan_register_registration_route() {
    register_rest_route(NAHAN_REST_NAMESPACE, '/events/(?P<id>\d+)/register', [
        'methods'             => 'POST',
        'callback'            => 'nahan_api_register_event',
        'permission_callback' => '__return_true',
        'args' => [
            'id'    => ['validate_callback' => function($v) { return is_numeric($v); }],
            'name'  => ['required' => true,  'sanitize_callback' => 'sanitize_text_field'],
            'phone' => ['required' => true,  'sanitize_callback' => 'sanitize_text_field'],
            'email' => ['required' => false, 'sanitize_callback' => 'sanitize_email'],
        ],
    ]);
}

function nahan_api_register_event(WP_REST_Request $request) {
    $event_id  = (int) $request->get_param('id');
    $name      = $request->get_param('name');
    $phone     = $request->get_param('phone');
    $email     = $request->get_param('email') ?: '';

    // بررسی وجود رویداد
    $event = get_post($event_id);
    if (!$event || $event->post_type !== 'nahan_event' || $event->post_status !== 'publish') {
        return new WP_REST_Response(['success' => false, 'code' => 'not_found', 'message' => 'رویداد یافت نشد.'], 404);
    }

    // بررسی ظرفیت
    $capacity   = (int) get_field('capacity',   $event_id);
    $registered = (int) get_field('registered', $event_id);

    if ($capacity > 0 && $registered >= $capacity) {
        return new WP_REST_Response(['success' => false, 'code' => 'capacity_full', 'message' => 'ظرفیت این رویداد تکمیل است.'], 409);
    }

    // بررسی ثبت‌نام تکراری با همان شماره موبایل
    $duplicate = get_posts([
        'post_type'      => 'nahan_registration',
        'posts_per_page' => 1,
        'meta_query'     => [
            ['key' => 'event_id', 'value' => $event_id],
            ['key' => 'phone',    'value' => $phone],
        ],
    ]);

    if (!empty($duplicate)) {
        return new WP_REST_Response(['success' => false, 'code' => 'already_registered', 'message' => 'این شماره موبایل قبلاً ثبت‌نام کرده است.'], 409);
    }

    // ذخیره ثبت‌نام
    $reg_id = wp_insert_post([
        'post_type'   => 'nahan_registration',
        'post_title'  => $name . ' — ' . $event->post_title,
        'post_status' => 'publish',
    ]);

    if (is_wp_error($reg_id)) {
        return new WP_REST_Response(['success' => false, 'code' => 'server_error', 'message' => 'خطا در ذخیره اطلاعات.'], 500);
    }

    update_post_meta($reg_id, 'event_id', $event_id);
    update_post_meta($reg_id, 'name',     $name);
    update_post_meta($reg_id, 'phone',    $phone);
    update_post_meta($reg_id, 'email',    $email);

    // افزایش شمارنده registered
    update_field('registered', $registered + 1, $event_id);

    return new WP_REST_Response([
        'success' => true,
        'message' => 'ثبت‌نام شما با موفقیت انجام شد.',
    ], 201);
}

// ============================================================================
// CORS برای endpoint ثبت‌نام
// ============================================================================

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = ['https://nahancafe.ir', 'https://nahancafe.liara.run'];
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
        }
        return $value;
    });
}, 15);

// ============================================================================
// REGISTRATION ADMIN COLUMNS
// ============================================================================

add_filter('manage_nahan_registration_posts_columns', function ($cols) {
    return array_merge(['cb' => $cols['cb']], [
        'title'    => 'نام',
        'phone'    => 'موبایل',
        'email'    => 'ایمیل',
        'event'    => 'رویداد',
        'date'     => 'تاریخ ثبت‌نام',
    ]);
});

add_action('manage_nahan_registration_posts_custom_column', function ($col, $post_id) {
    switch ($col) {
        case 'phone':
            echo esc_html(get_post_meta($post_id, 'phone', true));
            break;
        case 'email':
            echo esc_html(get_post_meta($post_id, 'email', true));
            break;
        case 'event':
            $eid = get_post_meta($post_id, 'event_id', true);
            $ev  = $eid ? get_post($eid) : null;
            echo $ev ? esc_html($ev->post_title) : '—';
            break;
    }
}, 10, 2);

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